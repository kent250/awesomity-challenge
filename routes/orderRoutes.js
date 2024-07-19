const express = require('express')
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Endpoints related to management of orders
 */

/**
 * @swagger
 * /api/orders/:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     description: Creates a new order with the given products (Buyer only).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                       description: The ID of the product to order
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       description: The quantity of the product to order
 *                       example: 200
 *                     unit_price:
 *                       type: number
 *                       description: The unit price of the product
 *                       example: 10000
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [Success]
 *                 message:
 *                   type: object
 *                   properties:
 *                     orderId:
 *                       type: integer
 *                       description: The ID of the created order
 *                       example: 17
 *                     orderStatus:
 *                       type: string
 *                       description: The status of the created order
 *                       example: pending
 *                     totalAmount:
 *                       type: number
 *                       description: The total amount of the order
 *                       example: 2000000
 *             examples:
 *               OrderCreated:
 *                 summary: Order created successfully
 *                 value:
 *                   status: "Success"
 *                   message: 
 *                     orderId: 17
 *                     orderStatus: "pending"
 *                     totalAmount: 2000000
 *       403:
 *         description: Invalid user account
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
 *               InvalidUser:
 *                 summary: Forbidden
 *                 value:
 *                   status: "Fail"
 *                   message: "Forbidden"
 *       500:
 *         description: Internal server error
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
 *               InsufficientStock:
 *                 summary: Invalid product or insufficient stock
 *                 value:
 *                   status: "Fail"
 *                   message: "Invalid product or insufficient stock for product_id: 12"
 *               ServerError:
 *                 summary: Internal server error
 *                 value:
 *                   status: "Fail"
 *                   message: "Internal Server error"
 */
router.post('/orders/', authenticateToken, authorizeRole(['buyer']) , orderController.makeOrder);

router.get('/orders/', authenticateToken, authorizeRole(['buyer', 'admin']) , orderController.retrieveOrders);

router.get('/orders/:id(\\d+)', authenticateToken, authorizeRole(['buyer', 'admin']), orderController.orderDetails);

router.patch('/orders/:id', authenticateToken, authorizeRole(['admin']), orderController.updateOrderStatus);

router.get('/orders/history', authenticateToken, authorizeRole(['buyer','admin']), orderController.viewOrderHistory);



module.exports = router;

