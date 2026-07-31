const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Income = sequelize.define('Income', {
    title: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: { notEmpty: { msg: 'Please add an income title' } }
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0 }
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'Please add a category' } }
    },
    description: {
        type: DataTypes.STRING(200),
        defaultValue: ''
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: { notEmpty: { msg: 'Please add a date' } }
    }
});

// Relationships
User.hasMany(Income, { foreignKey: 'userId', onDelete: 'CASCADE' });
Income.belongsTo(User, { foreignKey: 'userId' });

module.exports = Income;
