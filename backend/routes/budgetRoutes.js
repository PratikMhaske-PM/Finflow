const express = require('express');
const { getBudgets, addBudget, deleteBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(protect, getBudgets)
    .post(protect, addBudget);

router.route('/:id')
    .delete(protect, deleteBudget);

module.exports = router;
