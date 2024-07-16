const express = require('express')
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');


router.post('/order/', authenticateToken, authorizeRole(['buyer']) , orderController.makeOrder);


module.exports = router;

