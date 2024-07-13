const Product = require('../models/product');
const Category = require('../models/category');
const jsend = require('../config/apiFormat');


const newProduct = async (req, res) => {
    try {

        const { product_name, description, price, stock_quantity, category_id } = req.body;

        //data validation
        if (!product_name || typeof product_name !== 'string') {
            return res.status(422).json(jsend('Fail', 'A valid product name is required.'));
        }
        if (!stock_quantity || typeof stock_quantity !== 'number') {
            return res.status(422).json(jsend('Fail', 'Stock quantity must be a valid number.'));
        }
        if (!price || typeof price !== 'number' || price < 0 ) {
            return res.status(422).json(jsend('Fail', 'Product price must be a valid number.'));
        }
        if(description && typeof description !== 'string') {
            return res.status(422).json(jsend('Fail', 'Valid Product description is required.'));
        }
        if (!category_id || typeof category_id !== 'number') {
            return res.status(422).json(jsend('Fail', 'A valid category ID is required.'));
        }

        //check if there is exisiting product with same name if so generate error
        const checkProductName = await Product.findOne({
            where: {
                product_name: product_name,
            }
        });

        if (checkProductName) {
            return res.status(422).json(jsend('Fail', 'A product with this name already exists.'));
        }

        //check if provided category exist if so generate error
        const checkCategoryId = await Category.findOne({
            where: {
                id: category_id,
        }});

        if (!checkCategoryId) {
            return res.status(422).json(jsend('Fail', 'The specified product category ID does not exist.'));
        }

        //save the product
        const saveProduct = await Product.create(req.body);

        if (!saveProduct) {
            return res.status(500).json(jsend('Fail', 'Internal server error'));
        }

        res.status(201).json(jsend('Success', 'Product Created Successfully', saveProduct));
        
    } catch (error) {
        console.log('There was an error Creating new product',error);
        res.status(500).json(jsend('Fail', 'Internal Server Error'));
    }
}


const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { product_name, description, price, stock_quantity, category_id } = req.body;

        // Find the product to be updated
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json(jsend('Fail', 'Product not found.'));
        }

        // data validation
        if (product_name && typeof product_name !== 'string') {
            return res.status(422).json(jsend('Fail', 'A valid product name is required.'));
        }
        if (stock_quantity && typeof stock_quantity !== 'number') {
            return res.status(422).json(jsend('Fail', 'Stock quantity must be a valid number.'));
        }
        if (price && (typeof price !== 'number' || price < 0)) {
            return res.status(422).json(jsend('Fail', 'Product price must be a valid number.'));
        }
        if (description && typeof description !== 'string') {
            return res.status(422).json(jsend('Fail', 'Product description must be a string.'));
        }
        if (category_id && typeof category_id !== 'number') {
            return res.status(422).json(jsend('Fail', 'Category ID must be a valid number.'));
        }

        //check if there is exisiting product with same name if so generate error
        if (product_name && product_name !== product.product_name) {
            const checkProductName = await Product.findOne({
                where: { product_name: product_name }
            });
            if (checkProductName) {
                return res.status(422).json(jsend('Fail', 'A product with this name already exists.'));
            }
        }

        // Check category exists if it's being updated
        if (category_id) {
            const checkCategoryId = await Category.findByPk(category_id);
            if (!checkCategoryId) {
                return res.status(422).json(jsend('Fail', 'The specified product category does not exist.'));
            }
        }

        // Update the product
        const updatedProduct = await product.update(req.body);

        if (!updatedProduct) {
            return res.status(500).json(jsend('Fail', 'Internal server error'));
        }

        res.status(200).json(jsend('Success', 'Product Updated Successfully', updatedProduct));
        
    } catch (error) {
        console.log('There was an error updating the product', error);
        res.status(500).json(jsend('Fail', 'Internal Server Error'));
    }
}


const deleteProduct = async (req, res) => {

}

module.exports = {
    newProduct,
    updateProduct
}