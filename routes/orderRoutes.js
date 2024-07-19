const express = require('express')
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');


router.post('/orders/', authenticateToken, authorizeRole(['buyer']) , orderController.makeOrder);

// router.get('/orders/', authenticateToken, authorizeRole(['buyer', 'admin']) , orderController.retrieveOrders);

// router.get('/orders/:id(\\d+)', authenticateToken, authorizeRole(['buyer', 'admin']), orderController.orderDetails);

// router.patch('/orders/:id', authenticateToken, authorizeRole(['admin']), orderController.updateOrderStatus);

// router.get('/orders/history', authenticateToken, authorizeRole(['buyer']), orderController.viewOrderHistory);



module.exports = router;

