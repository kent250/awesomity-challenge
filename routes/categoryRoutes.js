const express = require('express')
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Endpoints for category management
 */


/**
 * @swagger
 * /api/category:
 *   get:
 *     summary: Retrieve all categories
 *     description: Get a list of all categories (admin only)
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
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
 *                   example: Categories Found
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 21
 *                       name:
 *                         type: string
 *                         example: New category
 *                       description:
 *                         type: string
 *                         example: category description
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-07-13T09:19:42.020Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-07-13T09:19:42.020Z
 *       204:
 *         description: No categories found
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
 *                   example: No categories Found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not an admin
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
 *                   example: There was an error retrieving all categories
 */
router.get('/category', authenticateToken, authorizeRole(['admin']),categoryController.retrieveCategories);

/** 
 * @swagger
 * /api/category:
 *   post:
 *     summary: Create a new category
 *     description: Create a new category (admin only)
 *     tags: [Category]
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
 *                 example: Category 1
 *               description:
 *                 type: string
 *                 example: Category 1 Description
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Category created successfully
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
 *                   example: Category created successfully!
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Category 1
 *                     description:
 *                       type: string
 *                       example: Category 1 Description
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request - Invalid input or category already exists
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
 *                   example: Category already exists.
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not an admin
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
router.post('/category', authenticateToken, authorizeRole(['admin']),categoryController.newCategory);


module.exports = router;