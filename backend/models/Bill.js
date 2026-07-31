const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Bill = sequelize.define('Bill', {
    title: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    dueDate: { type: DataTypes.DATE, allowNull: false },
    category: { type: DataTypes.STRING, defaultValue: 'Other' },
    status: { type: DataTypes.STRING, defaultValue: 'Pending' }
});

User.hasMany(Bill, { foreignKey: 'userId', onDelete: 'CASCADE' });
Bill.belongsTo(User, { foreignKey: 'userId' });

module.exports = Bill;
