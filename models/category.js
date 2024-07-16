const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database.js');


const Category = sequelize.define('Category', {

    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        notEmpty: true,
    },
    description: {
        type: DataTypes.TEXT,
    },
}, 
{
    tableName: 'categories',
    timestamps: true,
});



module.exports = Category;