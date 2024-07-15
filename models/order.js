const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database.js');


const Order = sequelize.define('Order', {
    buyer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(15),
        allowNull: false,
        validate: {
            isIn: [['pending', 'paid', 'shipped', 'delivered', 'cancelled']],
        },
    },
    total_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,

    }
},
{
    tableName: 'orders',
    timestamps: true,
});




module.exports = Order;