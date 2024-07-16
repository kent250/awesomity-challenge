const Product = require('./product');
const Category = require('./category');
const Order = require('./order');
const User = require('./user');
const OrderItems = require('./orderItems');


const setupAssociations = () => {

    //Product-Category relationship 
    Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
    Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });

    //User-Order relationship 
    Order.belongsTo(User, { foreignKey: 'buyer_id', as: 'buyer' });
    User.hasMany(Order, { foreignKey: 'buyer_id', as: 'orders' });

    //Order-OrderDetails relationship
    OrderItems.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
    Order.hasMany(OrderItems, { foreignKey: 'order_id', as: 'orderItems' });

    //OrderDetails-Product relationship
    OrderItems.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
    Product.hasMany(OrderItems, { foreignKey: 'product_id', as: 'OrderItems' });
    

};

module.exports = setupAssociations;