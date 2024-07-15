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
/**
 * @swagger
 * /api/auth/verify/{token}:
 *   get:
 *     summary: Verify buyer account
 *     description: Verify a buyer's account using the provided token. This route should only be accessed by logged-in buyers.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The verification token sent to the buyer's email
 *     responses:
 *       200:
 *         description: Account verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 message:
 *                   type: string
 *                   example: Account verified successfully, Login again
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *       401:
 *         description: Unauthorized - Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Fail
 *                 message:
 *                   type: string
 *                   example: "Unauthorized: JsonWebTokenError"
 *       403:
 *         description: Forbidden - User is not a buyer
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Fail
 *                 message:
 *                   type: string
 *                   example: User not found
 *       422:
 *         description: Account verification failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Fail
 *                 message:
 *                   type: string
 *                   example: Your account wasn't verified. Try again in a moment
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Fail
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.get('/verify/:token', authenticateToken, authorizeRole(['buyer']), authController.verifyBuyerAccount);

module.exports = router;