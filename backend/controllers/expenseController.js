const Expense = require('../models/Expense');

// @desc    Get all expenses for a user
// @route   GET /api/expenses
// @access  Private
exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll({
            where: { userId: req.user.id },
            order: [['date', 'DESC']]
        });
        res.json({ success: true, count: expenses.length, data: expenses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add a new expense
// @route   POST /api/expenses
// @access  Private
exports.addExpense = async (req, res) => {
    try {
        const { title, amount, category, description, date } = req.body;
        const expense = await Expense.create({
            userId: req.user.id,
            title,
            amount,
            category,
            description,
            date
        });
        res.status(201).json({ success: true, data: expense });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findByPk(req.params.id);
        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }
        
        // Make sure user owns the expense
        if (expense.userId !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        await expense.destroy();
        res.json({ success: true, message: 'Expense removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
