const express = require('express')
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Endpoints for Product reviews
 */


/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     description: Creates a new review for a product. User must have ordered the product and not reviewed it before.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - rating
 *               - comment
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: ID of the product being reviewed
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating given to the product (1-5)
 *               comment:
 *                 type: string
 *                 description: Review comment
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [Success]
 *                 message:
 *                   type: string
 *             example:
 *               status: "Success"
 *               message: "Product review Sucessfully!"
 *       403:
 *         description: Forbidden - User hasn't ordered the product or has already reviewed it
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [Fail]
 *                 message:
 *                   type: string
 *             examples:
 *               Not ordered this product:
 *                 value:
 *                   status: "Fail"
 *                   message: "You can only review products you have ordered."
 *               User already reviewed:
 *                 value:
 *                   status: "Fail"
 *                   message: "You have already reviewed this product"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [Fail]
 *                 message:
 *                   type: string
 *             examples:
 *               Error reviewing Product:
 *                 value:
 *                   status: "Fail"
 *                   message: "There was an error reviewing product, try again later"
 *               Internal Server error:
 *                 value:
 *                   status: "Fail"
 *                   message: "Internal Server error"
 */
router.post('/reviews', authenticateToken, authorizeRole(['buyer']), reviewController.createReview);

/**
 * @swagger
 * /api/reviews/product/{productId}:
 *   get:
 *     summary: Retrieve reviews for a specific product
 *     tags: [Reviews]
 *     description: Retrieves all reviews associated with a given product ID
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: Numeric ID of the product to get reviews for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved product reviews or no reviews found
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ReviewsFound'
 *                 - $ref: '#/components/schemas/NoReviews'
 *             examples:
 *               reviewsFound:
 *                 summary: Reviews found for the product
 *                 value:
 *                   status: Success
 *                   message: Product reviews retrieved successfully
 *                   data:
 *                     productId: 1
 *                     productName: updated product
 *                     review:
 *                       - userId: 8
 *                         userNames: buyer2
 *                         rating: 2
 *                         comment: comment of the review
 *               noReviews:
 *                 summary: No reviews found for the product
 *                 value:
 *                   status: Success
 *                   message: There is no Reviews for this product
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 * components:
 *   schemas:
 *     ReviewsFound:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             productId:
 *               type: integer
 *             productName:
 *               type: string
 *             review:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: integer
 *                   userNames:
 *                     type: string
 *                   rating:
 *                     type: integer
 *                   comment:
 *                     type: string
 *     NoReviews:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *         message:
 *           type: string
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *         message:
 *           type: string
 */
router.get('/reviews/product/:productId', reviewController.retrieveReviews);


module.exports = router; 