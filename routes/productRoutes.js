const express = require('express')
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Endpoints for Products management
 */



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

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Retrieve all products
 *     description: Get a list of all products including their categories (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products Retrieved Successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: Success
 *                     message:
 *                       type: string
 *                       example: Products Retrieved Successfully
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           product_name:
 *                             type: string
 *                             example: Prod2eu
 *                           description:
 *                             type: string
 *                             example: Product 1 Description
 *                           price:
 *                             type: number
 *                             example: 1
 *                           stock_quantity:
 *                             type: number
 *                             example: 23
 *                           is_featured:
 *                             type: boolean
 *                             example: false
 *                           category_id:
 *                             type: number
 *                             example: 1
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2024-07-13T15:03:49.373Z
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2024-07-13T15:03:49.373Z
 *                           category:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 1
 *                               name:
 *                                 type: string
 *                                 example: New category
 *                               description:
 *                                 type: string
 *                                 example: category description
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: Success
 *                     message:
 *                       type: string
 *                       example: 0 products saved
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
router.get('/product', productController.retrieveAllProducts);

/**
 * @swagger
 * /api/product/category/{categoryId}:
 *   get:
 *     summary: Retrieve products by category
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Products retrieved successfully
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       204:
 *         $ref: '#/components/responses/NoProducts'
 *       400:
 *         $ref: '#/components/responses/CategoryNotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 * 
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         product_name:
 *           type: string
 *         category_id:
 *           type: integer
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         stock_quantity:
 *           type: integer
 *         is_featured:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         category:
 *           $ref: '#/components/schemas/Category'
 *     
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *   responses:
 *     CategoryNotFound:
 *       description: Category not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "Fail"
 *               message:
 *                 type: string
 *                 example: "Category Unknown"
 *     
 *     InternalServerError:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "Fail"
 *               message:
 *                 type: string
 *                 example: "There was an error retrieving product details"
 *     
 *     NoProducts:
 *       description: No products in the category
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "Success"
 *               message:
 *                 type: string
 *                 example: "0 Products in this category"
 */
router.get('/product/category/:categoryId', productController.productsByCategory);



router.patch('/product/featured/:id', authenticateToken, authorizeRole(['admin']), productController.makeProductFeatured);

router.patch('/product/unfeatured/:id', authenticateToken, authorizeRole(['admin']), productController.makeProductNotFeatured);




module.exports = router;