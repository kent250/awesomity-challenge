const express = require('express')
const router = express.Router();
const userProfileController = require('../controllers/userProfileController');
const { authenticateToken } = require('../middlewares/auth');

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

router.get('/allusers',userProfileController.getAllUsers);


module.exports = router;