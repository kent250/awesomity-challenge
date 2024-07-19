const jsend = require('../config/apiFormat');
const { sequelize } = require('../config/database');
const Order = require('../models/order');
const User = require('../models/user');
const Product = require('../models/product');
const OrderItems = require('../models/orderItems');
const sendEmails = require('../utils/sendEmails');

const { where } = require('sequelize');
const sendVerification = require('../utils/sendEmails');

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
}

const orderDetails = async (req, res) => {
    try {
       const loggedInUser = req.user.id;
       const loggedInUserRole = req.user.role;
       const orderId = req.params.id;

      // retrieve order
      const checkOrder = await Order.findByPk(orderId);

       if(!checkOrder) {
        return res.status(404).json(jsend('Fail', 'Order not found'));
       }

       // Check if the user is authorized to view this order
       if (loggedInUserRole !== 'admin') {
        if (checkOrder.buyer_id !== loggedInUser) {
            return res.status(403).json(jsend('Fail', 'You are not authorized to view this order'));
        }
      }

       // retrieve an order with its all items
       const retrieveOrder = await Order.findOne({
          where: {
            id: orderId
          },
          include: [{
            model: OrderItems,
            as: 'orderItems',
            include: [{
              model: Product,
              as: 'product',
              attributes: ['id', 'product_name', 'description']        
            }]
          }]
       });

       // Process the data
       const itemsDetails = retrieveOrder.orderItems.map(item => ({
        productId: item.product.id,
        productName: item.product.product_name,
        productDescription: item.product.description,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        totalPrice: item.quantity * item.unit_price
      }));

      const totalOrderAmount = itemsDetails.reduce((sum, item) => sum + item.totalPrice, 0);

      // Format the response
      const orderDetails = {
        order_id: retrieveOrder.id,
        order_date: retrieveOrder.createdAt,
        total_amount: totalOrderAmount,
        items: itemsDetails
      };

       res.status(200).json(jsend('Success', 'Order details retrieved successfully', orderDetails));

    } catch (error) { 
        console.error('Internal server error:', error);
        return res.status(500).json(jsend('Fail', 'Internal server error'));
    }
}

const updateOrderStatus = async (req, res) => {
    try {

      const orderId = req.params.id;
      const { newStatus } = req.body;
      const allowedStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

      const normalizedNewStatus = newStatus.toLowerCase();
      
      //Check if user is authorised to access 
      if(req.user.role !== 'admin') return res.status(403).json(jsend('Fail', 'You are not authorised'));

      //check if status is legit
      if(allowedStatuses.includes(normalizedNewStatus) !== true) return res.status(400).json(jsend('Fail', 'You are sending unknown order status'));
      
      //check current order status before update
      const checkCurrentOrderStatus = await Order.findOne({
        where: {
          id: orderId,
          status: normalizedNewStatus
        }
      });

      if (checkCurrentOrderStatus) {
        return res.status(400).json(jsend('Fail', `The order already has the status ${normalizedNewStatus}. No changes were made.`));
      }

      //update the order status and also get required info from returned record
      const [affectedRows, updatedRecords] = await Order.update(
        { status: normalizedNewStatus },
        {
        where: {
          id: orderId
        },
        returning: true,
      });

      const updatedOrder = updatedRecords[0];
      const orderDate = updatedOrder.createdAt
      const orderAmount = updatedOrder.total_amount
      
      //get order owner
      const getOrderOwner = await User.findOne({ 
        where: {
          id: updatedOrder.buyer_id
        }
      });
      const buyerEmail = getOrderOwner.email;
      const buyerNames = getOrderOwner.name;


      //send notification email
      const sendEmail = sendEmails.sendOrderStatusUpdate(buyerEmail, buyerNames, normalizedNewStatus, orderId, orderDate, orderAmount);
      if (!sendEmail) {
        return res.status(400).json(jsend('Fail', 'The order Status has been updated but notification not sent'));
      }
     
      // // once all passed
      res.status(200).json(jsend('Success', 'Order status updated, Notification E-mail sent', updatedOrder))
    } catch (error) {
      console.error('Internal server error:', error);
      return res.status(500).json(jsend('Fail', 'Internal server error'));
    }
}

const viewOrderHistory = async (req, res) => {
    const loggedInUserRole = req.user.role;
    const loggedInUserId = req.user.id;

  try {

    let orders;
    if (loggedInUserRole == 'admin') {
       orders = await Order.findAll({
        include: [
          {
            model: OrderItems,
            as: 'orderItems',
            include: [{
              model: Product,
              as: 'product',
              attributes: ['product_name']
            }]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    }else{
       orders = await Order.findAll({
        where: { buyer_id: loggedInUserId},
        include: [
          {
            model: OrderItems,
            as: 'orderItems',
            include: [{
              model: Product,
              as: 'product',
              attributes: ['product_name']
            }]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    }
    
      const formattedOrders = orders.map(order => {
        const orderItems = order.orderItems;
        const productCount = orderItems.length;
        const productNames = orderItems.map(item => item.product.product_name).join(', ');
        const totalAmount = orderItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  
        return {
          orderId: order.id,
          orderDate: order.createdAt,
          status: order.status,
          productCount: productCount,
          productNames: productNames,
          totalAmount: totalAmount
        };
      });

      res.status(200).json(jsend('Sucess', 'Order Hisotry returned', formattedOrders));

  } catch (error) {
    console.error('Internal server error:', error);
      return res.status(500).json(jsend('Fail', 'Internal server error'));
  }
}



module.exports = {
    makeOrder,
    retrieveOrders,
    orderDetails,
    updateOrderStatus,
    viewOrderHistory
};