/**
 * @swagger
 * tags:
 *   name: Ikimina
 *   description: Ikimina management
 */

const express = require('express')
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');
const bcrypt = require('bcrypt');  




router.post('/api/auth/register', authController.registerBuyer);
router.post('/api/auth/login', authController.login);

//manage profile
router.get('/api/auth/profile', authenticateToken, authController.profileDetails);
router.patch('/api/auth/profile', authenticateToken, authController.updateProfile);


router.get('/api/auth/all',authenticateToken ,authController.all);
// router.get('/api/auth/buyer',authenticateToken, authorizeRole(['buyer']),authController.buyer);
// router.get('/api/auth/admin',authenticateToken, authorizeRole(['admin']),authController.admin);









module.exports = router;