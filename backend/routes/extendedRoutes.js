const express = require('express');
const { getBills, addBill, deleteBill, getSubscriptions, addSubscription, deleteSubscription, getLoans, addLoan, deleteLoan } = require('../controllers/extendedController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Bills Routes
router.route('/bills').get(protect, getBills).post(protect, addBill);
router.route('/bills/:id').delete(protect, deleteBill);

// Subscriptions Routes
router.route('/subscriptions').get(protect, getSubscriptions).post(protect, addSubscription);
router.route('/subscriptions/:id').delete(protect, deleteSubscription);

// Loans Routes
router.route('/loans').get(protect, getLoans).post(protect, addLoan);
router.route('/loans/:id').delete(protect, deleteLoan);

module.exports = router;
