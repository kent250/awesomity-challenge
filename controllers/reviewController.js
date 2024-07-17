const Product = require('../models/product');
const User = require('../models/user');
const Review = require('../models/review');
const Order = require('../models/order');
const jsend = require('../config/apiFormat');
const OrderItems = require('../models/orderItems');



const createReview = async (req, res) => {
    try {
        //information gathering
        const { productId, rating, comment } = req.body
        const loggedInUserId = req.user.id;

        //check if user has ordered that product before
        const checkProduct = await Order.findOne({
            where: {buyer_id: loggedInUserId, status: 'completed'},
            include: [{
                model: OrderItems,
                as: 'orderItems',
                where: {product_id: productId}
            }]
        });

        if (!checkProduct) {
            return res.status(403).json(jsend('Fail', 'You can only review products you have ordered.'))
        }

        //check if user has reviewed the product before if so generate error
        const checkExistingReview = await Review.findOne({
            where: {
                buyer_id: loggedInUserId,
                product_id: productId
            }
        });

        if (checkExistingReview) {
            return res.status(403).json(jsend('Fail', 'You have already reviewed this product'));
        }

        //create review

        const createReview = Review.create({
            product_id: productId,
            buyer_id: loggedInUserId,
            order_id: checkProduct.id,
            rating: rating,
            comment: comment
        })

        if (!createReview) {
            res.status(500).json(jsend('Fail', 'There was an error reviewing product, try again later'))
        }

        res.status(201).json(jsend('Success', 'Product review Sucessfully!'));


     
    } catch (error) {
        console.log('Internal server error', error);
        res.status(500).json(jsend('Fail', 'Internal Server error'));
        
    }
}

module.exports = {
    createReview
}

