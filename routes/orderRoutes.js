const express = require('express')
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');


router.post('/orders/', authenticateToken, authorizeRole(['buyer']) , orderController.makeOrder);

router.get('/orders/', authenticateToken, authorizeRole(['buyer', 'admin']) , orderController.retrieveOrders);

router.get('/orders/:id', authenticateToken, authorizeRole(['buyer', 'admin']), orderController.orderDetails);



module.exports = router;

