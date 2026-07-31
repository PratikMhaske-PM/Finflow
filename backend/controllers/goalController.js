const Goal = require('../models/Goal');

exports.getGoals = async (req, res) => {
    try {
        const goals = await Goal.findAll({ where: { userId: req.user.id } });
        res.json({ success: true, data: goals });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.addGoal = async (req, res) => {
    try {
        const goal = await Goal.create({ ...req.body, userId: req.user.id });
        res.status(201).json({ success: true, data: goal });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findByPk(req.params.id);
        if (goal && goal.userId === req.user.id) {
            await goal.destroy();
            res.json({ success: true });
        } else { res.status(404).json({ success: false, message: 'Not found' }); }
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
