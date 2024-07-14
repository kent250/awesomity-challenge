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

const retrieveAllProducts = async (req, res) => {
    try {
        const getProducts = await Product.findAll({
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id','name', 'description']
            }]
        });

        if (getProducts.length <= 0) {
            return res.status(200).json(jsend('Success', 'You have no products saved!!'));
        }
        res.status(200).json(jsend('Success', 'Products Retrieved Successfully', getProducts));
    } catch (error) {
        res.status(500).json(jsend('Fail', 'Internal Server error'));
    }
}

const makeProductFeatured = async (req, res) => {
    try {
        const { id } = req.params;

        //check if product is exist
        const productExists = await Product.findByPk(id);
        if (!productExists) {
            return res.status(422).json(jsend('Fail', 'Valid Product ID is required!'));
        }

        //update product
        const updateProduct = await Product.update(
            { is_featured: true },
            {
                where : {
                id: id
            }
        });

        //if product not updated
        if (!updateProduct) {
            return res.status(422).json(jsend('Fail', 'Product is not featured'));
        }
        //retrieve updated product
        const updatedProduct = await Product.findByPk(id);
        res.status(200).json(jsend('Success', 'Product is featured successfully!', updatedProduct));


    } catch (error) {
        console.log('There was an error retrieving products');
        res.status(500).json(jsend('Fail', 'Internal Server error'));
    }
}

const makeProductNotFeatured = async (req, res) => {
    try {
        const { id } = req.params;

        //check if product exists
        const productExists = await Product.findByPk(id);
        if (!productExists) {
            return res.status(422).json(jsend('Fail', 'Valid Product ID is required!'));
        }

        //update product to un featured
        const updateProduct = await Product.update(
            { is_featured: false },
            {
                where : {
                id: id
            }
        });

        // if not updated
        if (!updateProduct) {
            return res.status(422).json(jsend('Fail', 'Product is not Unfeatured'));
        }

        //retrieve updated product
        const updatedProduct = await Product.findByPk(id);
        res.status(200).json(jsend('Success', 'Product is Unfeatured successfully!', updatedProduct));


    } catch (error) {
        res.status(500).json(jsend('Fail', 'Internal Server error'));
    }
}


module.exports = {
    newProduct,
    updateProduct,
    retrieveAllProducts,
    makeProductFeatured,
    makeProductNotFeatured
}