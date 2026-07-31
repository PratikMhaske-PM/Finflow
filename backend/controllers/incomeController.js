const Income = require('../models/Income');

// @desc    Get all incomes for a user
// @route   GET /api/incomes
// @access  Private
exports.getIncomes = async (req, res) => {
    try {
        const incomes = await Income.findAll({
            where: { userId: req.user.id },
            order: [['date', 'DESC']]
        });
        res.json({ success: true, count: incomes.length, data: incomes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add a new income
// @route   POST /api/incomes
// @access  Private
exports.addIncome = async (req, res) => {
    try {
        const { title, amount, category, description, date } = req.body;
        const income = await Income.create({
            userId: req.user.id,
            title,
            amount,
            category,
            description,
            date
        });
        res.status(201).json({ success: true, data: income });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete an income
// @route   DELETE /api/incomes/:id
// @access  Private
exports.deleteIncome = async (req, res) => {
    try {
        const income = await Income.findByPk(req.params.id);
        if (!income) {
            return res.status(404).json({ success: false, message: 'Income not found' });
        }
        
        // Make sure user owns the income
        if (income.userId !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        await income.destroy();
        res.json({ success: true, message: 'Income removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
