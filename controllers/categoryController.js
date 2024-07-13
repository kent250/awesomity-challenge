const Category = require('../models/category');

const newCategory = async (req, res) => {
    try {
        const  { name, description } = req.body;

        if (!name || typeof name !== 'string') {
            res.status(400).json({message: 'Valid Category name is required'});
        }


        const checkCategoryName = await Category.findOne({
            where: {
                name: name,
            },
        });

        if (checkCategoryName) {
          return res.status(400).json({ message: 'Category already exists' });
        }

        const saveCategory = await Category.create({
            name: name,
            description: description
        });
        if (saveCategory) {
            res.status(201).json({message: 'Category Created Successfully', 
                data:{
                    id: saveCategory.id,
                    name: saveCategory.name,
                    description: saveCategory.description
                }
            });
        }
  
    } catch (error) {
        console.log('There was an error saving category', error);
        res.status(500).json({message: 'Internal Server Error', error: error.message})
    }
}

const retrieveCategories = async (req, res) => {
    try {
        const allCategories = await Category.findAll();
        if (!allCategories || allCategories.length === 0 ) {
           return  res.status(404).json({message: 'No categories Found'});
        }
        res.status(200).json(allCategories);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'There was an error retrieving all categories'});
    }
}

module.exports = {
     newCategory,
     retrieveCategories
}