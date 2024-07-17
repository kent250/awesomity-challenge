const Product = require('../models/product');
const User = require('../models/user');
const Review = require('../models/review');
const Order = require('../models/order');
const jsend = require('../config/apiFormat');
const OrderItems = require('../models/orderItems');


//create a review
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

//retrieve alll reviews for a product
const retrieveReviews = async (req,res) => {
    const productId = req.params.productId;
    try {
        const retrieveReviews = await Review.findAll({ 
            where: {
                product_id: productId
            },
            include: [{
                model: Product,
                as: 'product'
            },
            {
                model: User,
                as: 'user'
            }]
        });

        if (!retrieveReviews) {
            return res.status(500).json(jsend('Fail', 'There was an error retrieving reviews, try again later'))
        }
        const formattedReviews = {
            productId: retrieveReviews[0].product.id,
            productName: retrieveReviews[0].product.product_name,

            review: retrieveReviews.map(review => ({
                userNames: review.user.name,
                rating: review.rating,
                comment: review.comment
            }))
        };

        res.json(jsend('Success', 'Product reviews retrieved successfully', formattedReviews));

    } catch (error) {
        console.log('Internal server error', error);
        res.status(500).json(jsend('Fail', 'Internal Server error'));
    }
}

module.exports = {
    createReview,
    retrieveReviews
}

