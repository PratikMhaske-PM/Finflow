const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Goal = sequelize.define('Goal', {
    title: { type: DataTypes.STRING, allowNull: false },
    targetAmount: { type: DataTypes.FLOAT, allowNull: false },
    currentAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
    deadline: { type: DataTypes.DATE, allowNull: false }
});

User.hasMany(Goal, { foreignKey: 'userId', onDelete: 'CASCADE' });
Goal.belongsTo(User, { foreignKey: 'userId' });

module.exports = Goal;
