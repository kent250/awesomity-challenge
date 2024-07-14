const Product = require('./product');
const Category = require('./category');
const Order = require('./order');
const User = require('./user');


const setupAssociations = () => {

    //product-category relationship 
    Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
    Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });

    //user-order relationship 
    Order.belongsTo(User, { foreignKey: 'buyer_id', as: 'buyer' });
    User.hasMany(Order, { foreignKey: 'buyer_id', as: 'orders' });
};

module.exports = setupAssociations;