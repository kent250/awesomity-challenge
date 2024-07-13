const Product = require('./product');
const Category = require('./category');
const { RelationshipType } = require('sequelize/lib/errors/database/foreign-key-constraint-error');

const setupAssociations = () => {

    //product-category relationship 
    Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
    Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
};

module.exports = setupAssociations;