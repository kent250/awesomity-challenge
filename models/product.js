const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database.js');


const Product = sequelize.define('Product', {
    product_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    stock_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    is_featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'categories',
            key: 'id'
        },
        allowNull: false
    }

},
{
    tableName: 'products',
    timestamps: true,
});




module.exports = Product;