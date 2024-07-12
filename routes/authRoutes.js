const express = require('express')
const router = express.Router();
const authController = require('../controllers/authController');




router.post('/api/auth/register', authController.registerBuyer);



module.exports = router;