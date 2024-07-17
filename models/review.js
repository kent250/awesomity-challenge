const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database.js');


const Review = sequelize.define('Review', {
    product_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'products',
            key: 'id'
        },
        allowNull: false
    },
    order_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'orders',
            key: 'id'
        },
        allowNull: false
    },
    buyer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            max: 5,
            min: 0
        }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
},
{
    tableName: 'reviews',
    timestamps: true,
});




module.exports = Review;