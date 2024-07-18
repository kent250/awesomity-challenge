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
 *     summary: Register a new admin account
 *     tags: [Authentication]
 *     description: Endpoint for registering new admin accounts. Requires appropriate authorization.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: jane doe
 *               email:
 *                 type: string
 *                 example: janedoe@gmail.com
 *               password:
 *                 type: string
 *                 example: StrongAdminPass1
 *     responses:
 *       201:
 *         description: Admin User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin User registered successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 4
 *                     name:
 *                       type: string
 *                       example: "Jane Doe"
 *                     email:
 *                       type: string
 *                       example: "adminemail@gmail.com"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *                     is_email_verified:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Invalid password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     Errors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           validation:
 *                             type: string
 *                           arguments:
 *                             type: integer
 *                           message:
 *                             type: string
 *             examples:
 *               All Errors:
 *                 value:
 *                   status: "Fail"
 *                   message: "Password does not meet required rules"
 *                   data:
 *                     Errors:
 *                       - validation: "min"
 *                         arguments: 8
 *                         message: "The string should have a minimum length of 8 characters"
 *                       - validation: "uppercase"
 *                         message: "The string should have a minimum of 1 uppercase letter"
 *                       - validation: "lowercase"
 *                         message: "The string should have a minimum of 1 lowercase letter"
 *                       - validation: "digits"
 *                         message: "The string should have a minimum of 1 digit"
 *               Length Error:
 *                 value:
 *                   status: "Fail"
 *                   message: "Password does not meet required rules"
 *                   data:
 *                     Errors:
 *                       - validation: "min"
 *                         arguments: 8
 *                         message: "The string should have a minimum length of 8 characters"
 *               Upper or Lower case Error:
 *                 value:
 *                   status: "Fail"
 *                   message: "Password does not meet required rules"
 *                   data:
 *                     Errors:
 *                       - validation: "uppercase"
 *                         message: "The string should have a minimum of 1 uppercase letter"
 *       422:
 *         description: Validation error - Invalid input or email already registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Fail"
 *                 message:
 *                   type: string
 *             examples:
 *               Invalid Email:
 *                 value:
 *                   status: "Fail"
 *                   message: "Please enter a valid email address."
 *               Email Exists:
 *                 value:
 *                   status: "Fail"
 *                   message: "The Email already registered!"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 error:
 *                   type: string
 */
router.post('/register/admin', authController.registerAdmin);
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
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@gmail.com
 *               password:
 *                 type: string
 *                 example: Strong!Pass1
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Welcome! Check email johndore@gmail.com to verify."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       example: buyer
 *                     is_email_verified:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Invalid password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     Errors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           validation:
 *                             type: string
 *                           arguments:
 *                             type: integer
 *                           message:
 *                             type: string
 *             examples:
 *               All Errors:
 *                 value:
 *                   status: "Fail"
 *                   message: "Password does not meet required rules"
 *                   data:
 *                     Errors:
 *                       - validation: "min"
 *                         arguments: 8
 *                         message: "The string should have a minimum length of 8 characters"
 *                       - validation: "uppercase"
 *                         message: "The string should have a minimum of 1 uppercase letter"
 *                       - validation: "lowercase"
 *                         message: "The string should have a minimum of 1 lowercase letter"
 *                       - validation: "digits"
 *                         message: "The string should have a minimum of 1 digit"
 *               Length Error:
 *                 value:
 *                   status: "Fail"
 *                   message: "Password does not meet required rules"
 *                   data:
 *                     Errors:
 *                       - validation: "min"
 *                         arguments: 8
 *                         message: "The string should have a minimum length of 8 characters"
 *               Upper or Lower case Error:
 *                 value:
 *                   status: "Fail"
 *                   message: "Password does not meet required rules"
 *                   data:
 *                     Errors:
 *                       - validation: "uppercase"
 *                         message: "The string should have a minimum of 1 uppercase letter"
 *       422:
 *         description: Invalid Email or email already registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Fail"
 *                 message:
 *                   type: string
 *                   example: "Please enter a valid email address."
 *             examples:
 *               Invalid Email:
 *                 value:
 *                   status: "Fail"
 *                   message: "Please enter a valid email address."
 *               Email Exists:
 *                 value:
 *                   status: "Fail"
 *                   message: "The Email already registered!"
 *   
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *             examples:
 *               General Error:
 *                 value:
 *                   message: "Internal server error"
 *               Database Error:
 *                 value:
 *                   message: "Internal server error"
 */
router.post('/register/buyer', authController.registerBuyer);

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
router.get('/verify/:token', authController.verifyBuyerAccount);


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