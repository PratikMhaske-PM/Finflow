const Bill = require('../models/Bill');
const Subscription = require('../models/Subscription');
const Loan = require('../models/Loan');

// Bills
exports.getBills = async (req, res) => {
    try {
        const bills = await Bill.findAll({ where: { userId: req.user.id } });
        res.json({ success: true, data: bills });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addBill = async (req, res) => {
    try {
        const bill = await Bill.create({ ...req.body, userId: req.user.id });
        res.status(201).json({ success: true, data: bill });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteBill = async (req, res) => {
    try {
        const bill = await Bill.findByPk(req.params.id);
        if (bill && bill.userId === req.user.id) {
            await bill.destroy();
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, message: 'Not found or not authorized' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Subscriptions
exports.getSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.findAll({ where: { userId: req.user.id } });
        res.json({ success: true, data: subscriptions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addSubscription = async (req, res) => {
    try {
        const sub = await Subscription.create({ ...req.body, userId: req.user.id });
        res.status(201).json({ success: true, data: sub });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteSubscription = async (req, res) => {
    try {
        const sub = await Subscription.findByPk(req.params.id);
        if (sub && sub.userId === req.user.id) {
            await sub.destroy();
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, message: 'Not found or not authorized' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Loans
exports.getLoans = async (req, res) => {
    try {
        const loans = await Loan.findAll({ where: { userId: req.user.id } });
        res.json({ success: true, data: loans });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addLoan = async (req, res) => {
    try {
        const loan = await Loan.create({ ...req.body, userId: req.user.id });
        res.status(201).json({ success: true, data: loan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteLoan = async (req, res) => {
    try {
        const loan = await Loan.findByPk(req.params.id);
        if (loan && loan.userId === req.user.id) {
            await loan.destroy();
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, message: 'Not found or not authorized' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
