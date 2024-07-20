const express = require('express')
const router = express.Router();
const userProfileController = require('../controllers/userProfileController');
const { authenticateToken,authorizeRole } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: User Profile
 *   description: Endpoints for user profile management
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile details
 *     description: Retrieve the profile details of the authenticated user
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved profile details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile found
 *                 profileDetails:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 12
 *                     name:
 *                       type: string
 *                       example: buyer2
 *                     email:
 *                       type: string
 *                       example: buyer2@gmail.com
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 error:
 *                   type: string
 */
router.get('/profile', authenticateToken, userProfileController.profileDetails);

/**
 * @swagger
 * /api/user/profile:
 *   patch:
 *     summary: Update user profile
 *     description: Update the authenticated user's profile information
 *     tags: [User Profile]
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
 *                 example: buyer245
 *               email:
 *                 type: string
 *                 example: buyer2@gmail.com
 *               currentPassword:
 *                 type: string
 *                 example: buyer
 *             required:
 *               - currentPassword
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 12
 *                     name:
 *                       type: string
 *                       example: buyer245
 *                     email:
 *                       type: string
 *                       example: buyer2@gmail.com
 *                     is_email_verified:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Bad request - Missing password or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password is required to update your profile info
 *       401:
 *         description: Unauthorized - Invalid token or incorrect password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Incorrect password!
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 error:
 *                   type: string
 */
router.patch('/profile', authenticateToken, userProfileController.updateProfile);

/**
 * @swagger
 * /api/user/allusers:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Users]
 *     description: Retrieve a list of all users in the system. Accessible only by admins.
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Successfully returned Users"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: integer
 *                         example: 30
 *                       Names:
 *                         type: string
 *                         example: "kent mars 2002"
 *                       email:
 *                         type: string
 *                         example: "kentmars2002@gmail.com"
 *                       role:
 *                         type: string
 *                         example: "buyer"
 *                       joinDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-07-20T13:45:04.365Z"
 *       404:
 *         description: No users found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "0 Users returned"
 *       500:
 *         description: Internal server error
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
 *                   example: "Internal server error"
 *                 error:
 *                   type: string
 *                   example: "Error details"
 */

router.get('/allusers',authenticateToken,authorizeRole(['admin']) ,userProfileController.getAllUsers);


module.exports = router;