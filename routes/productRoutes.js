const express = require('express')
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Create a new product
 *     description: This endpoint creates a new product. Only users with the 'admin' role can access this endpoint.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_name:
 *                 type: string
 *                 example: "Prod2eu"
 *               description:
 *                 type: string
 *                 example: "Product 1 Description"
 *               price:
 *                 type: number
 *                 example: 1
 *               stock_quantity:
 *                 type: number
 *                 example: 23
 *               category_id:
 *                 type: number
 *                 example: 1
 *             required:
 *               - product_name
 *               - price
 *               - stock_quantity
 *               - category_id
 *     responses:
 *       201:
 *         description: Product Created Successfully
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
 *                   example: Product Created Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     is_featured:
 *                       type: boolean
 *                       example: false
 *                     id:
 *                       type: integer
 *                       example: 9
 *                     product_name:
 *                       type: string
 *                       example: "Prod2eu"
 *                     description:
 *                       type: string
 *                       example: "Product 1 Description"
 *                     price:
 *                       type: number
 *                       example: 1
 *                     stock_quantity:
 *                       type: number
 *                       example: 23
 *                     category_id:
 *                       type: number
 *                       example: 1
 *                     updatedAt:
 *                       type: string
 *                       example: "2024-07-13T14:19:05.018Z"
 *                     createdAt:
 *                       type: string
 *                       example: "2024-07-13T14:19:05.018Z"
 *       422:
 *         description: Validation Error
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
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - A product with this name already exists.
 *                     - A valid product name is required.
 *                     - Stock quantity must be a valid number.
 *                     - Product price must be a valid number.
 *                     - Valid Product description is required.
 *                     - A valid category ID is required.
 *                     - The specified product category ID does not exist.
 *       500:
 *         description: Internal Server Error
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
 *                   example: Internal Server Error
 */
router.post('/product', authenticateToken, authorizeRole(['admin']), productController.newProduct);

/**
 * @swagger
 * /api/product/{id}:
 *   patch:
 *     summary: Update a product by ID
 *     description: Update an existing product by its ID. Only users with the 'admin' role can access this endpoint.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_name:
 *                 type: string
 *                 example: "updated product"
 *               description:
 *                 type: string
 *                 example: "updated Description"
 *               price:
 *                 type: number
 *                 example: 0
 *               stock_quantity:
 *                 type: number
 *                 example: 230000
 *               category_id:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Product Updated Successfully
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
 *                   example: Product Updated Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     product_name:
 *                       type: string
 *                       example: "updated product"
 *                     description:
 *                       type: string
 *                       example: "updated Description"
 *                     price:
 *                       type: number
 *                       example: 0
 *                     stock_quantity:
 *                       type: number
 *                       example: 230000
 *                     is_featured:
 *                       type: boolean
 *                       example: false
 *                     category_id:
 *                       type: number
 *                       example: 1
 *                     createdAt:
 *                       type: string
 *                       example: "2024-07-13T12:58:35.675Z"
 *                     updatedAt:
 *                       type: string
 *                       example: "2024-07-13T13:34:22.799Z"
 *       404:
 *         description: Product not found
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
 *                   example: Product not found.
 *       422:
 *         description: Validation Error or Category not found
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
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - A valid product name is required.
 *                     - Stock quantity must be a valid number.
 *                     - Product price must be a valid number.
 *                     - Product description must be a string.
 *                     - Category ID must be a valid number.
 *                     - A product with this name already exists.
 *                     - The specified product category does not exist.
 *       500:
 *         description: Internal Server Error
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
 *                   example: Internal Server Error
 */

router.patch('/product/:id', authenticateToken, authorizeRole(['admin']), productController.updateProduct);

module.exports = router;