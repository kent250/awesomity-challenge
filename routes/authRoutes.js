const express = require('express')
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Endpoints for user authentication
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/auth/register/admin:
 *   post:
 *     summary: Register a new system admin account
 *     tags: [Authentication]
 *     description: Endpoint for admins to register new admin accounts. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: admin2
 *               email:
 *                 type: string
 *                 example: admin2@gmail.com
 *               password:
 *                 type: string
 *                 example: admin
 *     responses:
 *       201:
 *         description: Admin User registered successfully
 *       500:
 *         description: Internal server error
 */
router.post('/register/admin', authenticateToken, authorizeRole(['admin']), authController.registerAdmin);

/**
 * @swagger
 * /api/auth/register/buyer:
 *   post:
 *     summary: Register a new buyer account
 *     tags: [Authentication]
 *     description: Public endpoint for buyers to register new accounts.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: buyer2
 *               email:
 *                 type: string
 *                 example: buyer2@gmail.com
 *               password:
 *                 type: string
 *                 example: buyer
 *     responses:
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/register/buyer', authController.registerBuyer);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to the application
 *     tags: [Authentication]
 *     description: Endpoint for users to login with their credentials and receive a JWT token for authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: buyer2@gmail.com
 *               password:
 *                 type: string
 *                 example: buyer
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsIm5hbWUiOiJidXllcjI0NSIsImVtYWlsIjoiYnV5ZXIyQGdtYWlsLmNvbSIsInJvbGUiOiJidXllciIsImlhdCI6MTcyMDgwODUwNiwiZXhwIjoxNzIwODEyMTA2fQ.zT0YxAQDV1NDrjMfjT_Wn0U8xo6RAcDOvhvXGLLzKcw"
 *       401:
 *         description: Unauthorized - User not found or invalid password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error logging in
 */
router.post('/login', authController.login);

module.exports = router;