const Income = require('../models/Income');
const Expense = require('../models/Expense');

// @desc    Get comprehensive analytics and report data
// @route   GET /api/reports/analytics
// @access  Private
exports.getAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        const incomes = await Income.findAll({ where: { userId } });
        const expenses = await Expense.findAll({ where: { userId } });

        const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
        const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

        // Top Spending Categories
        const expenseByCategory = expenses.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});

        const topCategories = Object.keys(expenseByCategory)
            .map(key => ({ category: key, amount: expenseByCategory[key] }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);

        // Daily Cashflow (Last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentIncomes = incomes.filter(i => new Date(i.date) >= thirtyDaysAgo);
        const recentExpenses = expenses.filter(e => new Date(e.date) >= thirtyDaysAgo);

        res.json({
            success: true,
            data: {
                summary: {
                    totalIncome,
                    totalExpense,
                    netBalance: totalIncome - totalExpense,
                    savingsRate: savingsRate.toFixed(2)
                },
                topCategories,
                recentIncomes,
                recentExpenses
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Download CSV Report
// @route   GET /api/reports/export
// @access  Private
exports.exportCSV = async (req, res) => {
    try {
        const incomes = await Income.findAll({ where: { userId: req.user.id } });
        const expenses = await Expense.findAll({ where: { userId: req.user.id } });

        let csv = 'Type,Title,Category,Amount,Date\n';
        
        incomes.forEach(i => {
            csv += `Income,"${i.title}","${i.category}",${i.amount},${new Date(i.date).toISOString().split('T')[0]}\n`;
        });
        
        expenses.forEach(e => {
            csv += `Expense,"${e.title}","${e.category}",${e.amount},${new Date(e.date).toISOString().split('T')[0]}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="finflow_report.csv"');
        res.status(200).send(csv);

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
