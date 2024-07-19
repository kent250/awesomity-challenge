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

/**
 * @swagger
 * /api/orders/:
 *   get:
 *     summary: Retrieve all orders for the logged-in user
 *     tags: [Orders]
 *     description: Retrieves all orders for the logged-in user. Admins can retrieve all orders.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved orders or no orders found
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/OrdersFound'
 *                 - $ref: '#/components/schemas/NoOrders'
 *             examples:
 *               OrdersFound:
 *                 summary: Orders found
 *                 value:
 *                   status: "Success"
 *                   message: "Success retrieving orders"
 *                   data:
 *                     - orderId: 17
 *                       status: "pending"
 *                       totalAmount: 2000000
 *                       orderDate: "2024-07-19T12:03:47.343Z"
 *                     - orderId: 16
 *                       status: "pending"
 *                       totalAmount: 2000000
 *                       orderDate: "2024-07-19T12:01:09.874Z"
 *                     - orderId: 12
 *                       status: "completed"
 *                       totalAmount: 2000000
 *                       orderDate: "2024-07-19T08:38:58.000Z"
 *                     - orderId: 10
 *                       status: "completed"
 *                       totalAmount: 2000000
 *                       orderDate: "2024-07-19T08:38:40.594Z"
 *               NoOrders:
 *                 summary: No orders found
 *                 value:
 *                   status: "Success"
 *                   message: "No orders found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               ServerError:
 *                 summary: Internal server error
 *                 value:
 *                   status: "Fail"
 *                   message: "Internal server error"
 * 
 * components:
 *   schemas:
 *     OrdersFound:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [Success]
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: integer
 *               status:
 *                 type: string
 *               totalAmount:
 *                 type: number
 *               orderDate:
 *                 type: string
 *                 format: date-time
 *     NoOrders:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [Success]
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items: {}
 *     Forbidden:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [Fail]
 *         message:
 *           type: string
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [Fail]
 *         message:
 *           type: string
 */
router.get('/orders/', authenticateToken, authorizeRole(['buyer', 'admin']) , orderController.retrieveOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Retrieve details of a specific order
 *     tags: [Orders]
 *     description: Retrieves details of a specific order by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the order to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderDetails'
 *             examples:
 *               OrderFound:
 *                 summary: Order found
 *                 value:
 *                   status: "Success"
 *                   message: "Order details retrieved successfully"
 *                   data:
 *                     order_id: 12
 *                     order_date: "2024-07-19T08:38:58.000Z"
 *                     total_amount: 2000000
 *                     items:
 *                       - productId: 1
 *                         productName: "updated product"
 *                         productDescription: "updated Description"
 *                         quantity: 200
 *                         unitPrice: 10000
 *                         totalPrice: 2000000
 *       403:
 *         description: Forbidden - You are not authorized to view this order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Forbidden'
 *             examples:
 *               NotAuthorized:
 *                 summary: User not authorized to view the order
 *                 value:
 *                   status: "Fail"
 *                   message: "You are not authorized to view this order"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFound'
 *             examples:
 *               OrderNotFound:
 *                 summary: Order not found
 *                 value:
 *                   status: "Fail"
 *                   message: "Order not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               ServerError:
 *                 summary: Internal server error
 *                 value:
 *                   status: "Fail"
 *                   message: "Internal server error"
 * 
 * components:
 *   schemas:
 *     OrderDetails:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [Success]
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             order_id:
 *               type: integer
 *             order_date:
 *               type: string
 *               format: date-time
 *             total_amount:
 *               type: number
 *             items:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: integer
 *                   productName:
 *                     type: string
 *                   productDescription:
 *                     type: string
 *                   quantity:
 *                     type: integer
 *                   unitPrice:
 *                     type: number
 *                   totalPrice:
 *                     type: number
 *     Forbidden:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [Fail]
 *         message:
 *           type: string
 *     NotFound:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [Fail]
 *         message:
 *           type: string
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [Fail]
 *         message:
 *           type: string
 */

router.get('/orders/:id(\\d+)', authenticateToken, authorizeRole(['buyer', 'admin']), orderController.orderDetails);

/**
 * @swagger
 * /api/orders/{id}:
 *   patch:
 *     summary: Update the status of an order
 *     tags: [Orders]
 *     description: Updates the status of a specific order by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the order to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newStatus:
 *                 type: string
 *                 enum: [pending, paid, shipped, delivered, cancelled]
 *                 example: paid
 *     responses:
 *       200:
 *         description: Successfully updated order status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderStatusUpdateSuccess'
 *             examples:
 *               OrderUpdated:
 *                 summary: Order status updated and notification email sent
 *                 value:
 *                   status: "Success"
 *                   message: "Order status updated, Notification E-mail sent"
 *                   data:
 *                     id: 12
 *                     buyer_id: 8
 *                     status: "paid"
 *                     total_amount: 2000000
 *                     createdAt: "2024-07-19T08:38:58.000Z"
 *                     updatedAt: "2024-07-19T10:26:05.525Z"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequest'
 *             examples:
 *               InvalidStatus:
 *                 summary: Invalid status provided
 *                 value:
 *                   status: "Fail"
 *                   message: "You are sending unknown order status"
 *               NoChange:
 *                 summary: No change in order status
 *                 value:
 *                   status: "Fail"
 *                   message: "The order already has the status paid. No changes were made."
 *               NotificationFailure:
 *                 summary: Status updated but notification email failed
 *                 value:
 *                   status: "Fail"
 *                   message: "The order Status has been updated but notification not sent"
 *       403:
 *         description: Forbidden - You are not authorized to update this order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Forbidden'
 *             examples:
 *               NotAuthorized:
 *                 summary: User not authorized to update the order
 *                 value:
 *                   status: "Fail"
 *                   message: "You are not authorised"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               ServerError:
 *                 summary: Internal server error
 *                 value:
 *                   status: "Fail"
 *                   message: "Internal server error"
 * 
 * components:
 *   schemas:
 *     OrderStatusUpdateSuccess:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [Success]
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             buyer_id:
 *               type: integer
 *             status:
 *               type: string
 *             total_amount:
 *               type: number
 *             createdAt:
 *               type: string
 *               format: date-time
 *             updatedAt:
 *               type: string
 *               format: date-time
 *     BadRequest:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [Fail]
 *         message:
 *           type: string
 *     Forbidden:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [Fail]
 *         message:
 *           type: string
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [Fail]
 *         message:
 *           type: string
 */

router.patch('/orders/:id', authenticateToken, authorizeRole(['admin']), orderController.updateOrderStatus);


/**
 * @swagger
 * /api/orders/history:
 *   get:
 *     summary: View order history
 *     tags: [Orders]
 *     description: Retrieve the order history for the logged-in user. Admin users can view all orders.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved order history
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderHistoryResponse'
 *             examples:
 *               OrderHistory:
 *                 summary: Successfully retrieved order history
 *                 value:
 *                   status: "Success"
 *                   message: "Order History returned"
 *                   data: [
 *                     {
 *                       orderId: 17,
 *                       orderDate: "2024-07-19T12:03:47.343Z",
 *                       status: "pending",
 *                       productCount: 1,
 *                       productNames: "updated product",
 *                       totalAmount: 2000000
 *                     },
 *                     {
 *                       orderId: 16,
 *                       orderDate: "2024-07-19T12:01:09.874Z",
 *                       status: "pending",
 *                       productCount: 1,
 *                       productNames: "updated product",
 *                       totalAmount: 2000000
 *                     },
 *                     {
 *                       orderId: 12,
 *                       orderDate: "2024-07-19T08:38:58.000Z",
 *                       status: "completed",
 *                       productCount: 1,
 *                       productNames: "updated product",
 *                       totalAmount: 2000000
 *                     },
 *                     {
 *                       orderId: 10,
 *                       orderDate: "2024-07-19T08:38:40.594Z",
 *                       status: "completed",
 *                       productCount: 1,
 *                       productNames: "updated product",
 *                       totalAmount: 2000000
 *                     }
 *                   ]
 *               NoOrderHistory:
 *                 summary: No order history available
 *                 value:
 *                   status: "Success"
 *                   message: "No order history available"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               ServerError:
 *                 summary: Internal server error
 *                 value:
 *                   status: "Fail"
 *                   message: "Internal server error"
 * 
 * components:
 *   schemas:
 *     OrderHistoryResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [Success]
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: integer
 *               orderDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *               productCount:
 *                 type: integer
 *               productNames:
 *                 type: string
 *               totalAmount:
 *                 type: number
 *                 format: float
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [Fail]
 *         message:
 *           type: string
 */

router.get('/orders/history', authenticateToken, authorizeRole(['buyer','admin']), orderController.viewOrderHistory);



module.exports = router;

