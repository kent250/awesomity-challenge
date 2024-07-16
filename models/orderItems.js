const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database.js');


const OrderItems = sequelize.define('OrderItems', {
    order_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'orders',
            key: 'id'
        },
        allowNull: false
    },
    product_id: {
        type: DataTypes.INTEGER,
        referenceS: {
            model: 'products',
            key: 'id'
        },
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    unit_price: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
},
{
    tableName: 'order_items',
    timestamps: true,
});




module.exports = OrderItems;