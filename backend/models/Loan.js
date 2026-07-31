const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Loan = sequelize.define('Loan', {
    loanName: { type: DataTypes.STRING, allowNull: false },
    totalAmount: { type: DataTypes.FLOAT, allowNull: false },
    remainingBalance: { type: DataTypes.FLOAT, allowNull: false },
    interestRate: { type: DataTypes.FLOAT, allowNull: false },
    emi: { type: DataTypes.FLOAT, allowNull: false }
});

User.hasMany(Loan, { foreignKey: 'userId', onDelete: 'CASCADE' });
Loan.belongsTo(User, { foreignKey: 'userId' });

module.exports = Loan;
