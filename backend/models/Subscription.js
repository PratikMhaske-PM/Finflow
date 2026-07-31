const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Subscription = sequelize.define('Subscription', {
    serviceName: { type: DataTypes.STRING, allowNull: false },
    cost: { type: DataTypes.FLOAT, allowNull: false },
    billingCycle: { type: DataTypes.STRING, defaultValue: 'Monthly' },
    nextBillingDate: { type: DataTypes.DATE, allowNull: false }
});

User.hasMany(Subscription, { foreignKey: 'userId', onDelete: 'CASCADE' });
Subscription.belongsTo(User, { foreignKey: 'userId' });

module.exports = Subscription;
