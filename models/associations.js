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
    Order.belongsTo(User, { 
        foreignKey: 'buyer_id', 
        as: 'buyer',
        onDelete: 'CASCADE',
        onUPDATE: 'CASCADE'
    });
    User.hasMany(Order, { 
        foreignKey: 'buyer_id', 
        as: 'orders',
        onDelete: 'CASCADE',
        onUPDATE: 'CASCADE'
    });

    //Order-Orderitems relationship
    OrderItems.belongsTo(Order, {
        foreignKey: 'order_id', 
        as: 'order',
        onDelete: 'CASCADE',
        onUPDATE: 'CASCADE'
    });
    Order.hasMany(OrderItems, {
        foreignKey: 'order_id',
        as: 'orderItems',
        onDelete: 'CASCADE',
        onUPDATE: 'CASCADE'
     });

    //OrderDetails-Product relationship
    OrderItems.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
    Product.hasMany(OrderItems, { foreignKey: 'product_id', as: 'orderItems' });
    

};

module.exports = setupAssociations;