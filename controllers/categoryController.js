const Category = require('../models/category');
const jsend = require('../config/apiFormat');


const newCategory = async (req, res) => {
    try {
        const  { name, description } = req.body;
        
        // catagory validation
        if (!name || typeof name !== 'string') {
            return res.status(400).json(jsend('Fail', 'Valid Category name is required.'));
        }

        //check if exists
        const checkCategoryName = await Category.findOne({
            where: {
                name: name,
            },
        });
        if (checkCategoryName) {
            return res.status(400).json(jsend('Fail', 'Category already exists.'))
        }

        //save category
        const saveCategory = await Category.create({
            name: name,
            description: description
        });
        if (!saveCategory) {
            res.status(500).json(jsend('Fail', 'Category Is not created, try again in a moment!'));
        }

        res.status(201).json(jsend('Success', 'Category created successfully!', saveCategory));
        
    } catch (error) {
        console.log('Internal Server error', error);
        res.status(500).json(jsend('Fail', 'Internal server error'));
    }
}

const retrieveCategories = async (req, res) => {
    try {
        const allCategories = await Category.findAll();

        if (allCategories.length === 0 ) {
            return res.status(200).json(jsend('Success', '0 category Found'));
        }
        return  res.status(200).json(jsend('Success', 'Categories Found',allCategories));

    } catch (error) {
        console.log(error);
        res.status(500).json(jsend('Fail', 'There was an error retrieving all categories'));
    }
}
 
module.exports = {
     newCategory,
     retrieveCategories
}