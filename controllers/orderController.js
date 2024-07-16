const jsend = require('../config/apiFormat');
const { sequelize } = require('../config/database');
const Order = require('../models/order');
const User = require('../models/user');
const Product = require('../models/product');
const OrderItems = require('../models/orderItems');

const makeOrder = async (req, res) => {
    let t;
    try {
        t = await sequelize.transaction();

        // Get information
        const { products } = req.body;
        const loggedInUser = req.user.id;

        // Validate if user is legit
        const buyer = await User.findByPk(loggedInUser);
        if (!buyer) {
            return res.status(400).json(jsend('Fail', 'User Account not found'));
        }

        // Calculate total amount
        let totalAmount = 0;
        for (let product of products) {
            totalAmount += product.quantity * product.unit_price;
        }

        // Create order
        const saveOrder = await Order.create(
            {
                buyer_id: loggedInUser,
                total_amount: totalAmount,
            },
            { transaction: t }
        );

        // Create order details and save to database
        for (let product of products) {
            // Verify product exists and has sufficient stock
            const productAvailabilityCheck = await Product.findByPk(product.product_id);

            if (!productAvailabilityCheck || productAvailabilityCheck.stock_quantity < product.quantity) {
                return res.json(jsend('Fail', `Invalid product or insufficient stock for product_id: ${product.product_id}`));
            }

            // Save order details
            await OrderItems.create({
                order_id: saveOrder.id,
                product_id: product.product_id,
                quantity: product.quantity,
                unit_price: product.unit_price
            }, { transaction: t });

            // Update product stock
            await productAvailabilityCheck.decrement('stock_quantity', { by: product.quantity, transaction: t });
        }

        // save done queries using transaction
        await t.commit();
        res.status(201).json(jsend('Success', { orderId: saveOrder.id, totalAmount }));

    } catch (error) {
        if (t) await t.rollback();
        res.status(500).json(jsend('Fail', error.message));
    }
}

const retrieveOrders = async (req, res) => {
    try {
      const loggedInUser = req.user.id;
      const userRole = req.user.role;
  
      let retrieveOrders;
  
      if (userRole === 'admin') {
        retrieveOrders = await Order.findAll({
          order: [['createdAt', 'DESC']],
        });
      } else {
        retrieveOrders = await Order.findAll({
          order: [['createdAt', 'DESC']],
          where: {
            buyer_id: loggedInUser,
          },
        });
      }
  
      if (!retrieveOrders) {
        return res.status(422).json(jsend('Fail', 'There was an error retrieving orders'));
      }
  
      if (retrieveOrders.length === 0) {
        return res.status(200).json(jsend('Success', '0 Orders Found'));
      }
  
      // Mapping to extract required information
      const ordersData = retrieveOrders.map(order => ({
        orderId: order.id,
        status: order.status,
        totalAmount: order.total_amount,
        orderDate: order.createdAt,
      }));
  
      return res.status(200).json(jsend('Success', 'Success retrieving orders', ordersData));
    } catch (error) {
      console.error('Internal server error:', error);
      return res.status(500).json(jsend('Fail', 'Internal server error'));
    }
  };
  

module.exports = {
    makeOrder,
    retrieveOrders
};