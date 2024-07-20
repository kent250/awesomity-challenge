const Product = require('../models/product');
const Category = require('../models/category');
const jsend = require('../config/apiFormat');
const { Op } = require('sequelize');

//new product
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
            return res.status(400).json(jsend('Fail', 'A product with this name already exists.'));
        }

        //check if provided category exist if so generate error
        const checkCategoryId = await Category.findOne({
            where: {
                id: category_id,
        }});

        if (!checkCategoryId) {
            return res.status(400).json(jsend('Fail', 'The specified product category ID does not exist.'));
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
            return res.status(400).json(jsend('Fail', 'Valid Product ID is required!'));
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
            return res.status(400).json(jsend('Fail', 'Product is not featured'));
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

const productsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        //check if given category exists
        const checkCategoryExists = await Category.findByPk(categoryId);
        if (!checkCategoryExists) {
            return res.status(400).json(jsend('Fail', 'Category Unknown'))
        }

        //retrieve category related products
        const retrieveProducts = await Product.findAll({
            where: {
                category_id: categoryId
            },
            include: [{
                model: Category,
                as: 'category'
            }]
        });

        //error checking if there is problem fetching products and if 0 products returned
        if (!retrieveProducts) {
            return res.status(500).json(jsend('Fail', 'There was an error retriving product details'));
        }
        if (retrieveProducts.length === 0) {
            return res.status(204).json(jsend('Success', '0 Products in this category'));
        }
        
        return res.status(200).json(jsend('Success', `Products in category ${categoryId} retrieved successfully`, retrieveProducts));

    } catch (error) {
        return res.status(500).json(jsend('Fail', 'Internal Server error'));
    }
}

const getSingleProductDetails = async (req, res) =>{
    try {
        const productId  = req.params.id;

        //find product details

        const retrieveProductDetails = await Product.findOne({
            where: {
                id: productId
            },
            include: [{
                model: Category,
                as: 'category'
            }]
        });

        if (!retrieveProductDetails) {
            return res.status(400).json(jsend('Success', 'No Details for that product or product not found'));
        }
        return res.status(200).json(jsend('Success', 'Product details retrieved successfully', retrieveProductDetails));

    } catch (error) {
         console.error('Internal server error:', error);
        return res.status(500).json(jsend('Fail', 'Internal server error'));
    }
}


const searchProducts = async (req, res) => {
    try {
      const { name, category, minPrice, maxPrice } = req.query;
  
      // Build the search conditions dynamically
      let searchConditions = {
        where: {},
        include: [{
          model: Category,
          as: 'category'
        }]
      };
  
      if (name) {
        searchConditions.where.product_name = { [Op.like]: `%${name}%` };
      }
  
      if (category) {
        searchConditions.include[0].where = { name: { [Op.like]: `%${category}%` } };
      }
  
      if (minPrice) {
        searchConditions.where.price = { ...searchConditions.where.price, [Op.gte]: minPrice };
      }
  
      if (maxPrice) {
        searchConditions.where.price = { ...searchConditions.where.price, [Op.lte]: maxPrice };
      }
  
      // Retrieve products based on search conditions
      const products = await Product.findAll(searchConditions);
  
      // Check if products are found
      if (!products.length) {
        return res.status(200).json(jsend('Success', 'No products found matching your criteria'));
      }
  
      // Format the response
      const formattedProducts = products.map(product => ({
        id: product.id,
        product_name: product.product_name,
        category: product.category.name,
        description: product.description,
        price: product.price,
        stock_quantity: product.stock_quantity,
        is_featured: product.is_featured,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      }));
  
      // Send the response
      return res.status(200).json(jsend('Success', 'Products retrieved successfully', formattedProducts));
  
    } catch (error) {
      console.error('Internal server error:', error);
      return res.status(500).json(jsend('Fail', 'Internal server error'));
    }
}

module.exports = {
    newProduct,
    updateProduct,
    retrieveAllProducts,
    makeProductFeatured,
    makeProductNotFeatured,
    productsByCategory,
    getSingleProductDetails,
    searchProducts
}
