const Budget = require('../models/Budget');

exports.getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.findAll({ where: { userId: req.user.id } });
        res.json({ success: true, count: budgets.length, data: budgets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addBudget = async (req, res) => {
    try {
        const { category, amount, period, startDate, endDate } = req.body;
        const budget = await Budget.create({
            userId: req.user.id,
            category,
            amount,
            period,
            startDate,
            endDate
        });
        res.status(201).json({ success: true, data: budget });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findByPk(req.params.id);
        if (!budget) {
            return res.status(404).json({ success: false, message: 'Budget not found' });
        }
        if (budget.userId !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }
        await budget.destroy();
        res.json({ success: true, message: 'Budget removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
