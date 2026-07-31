const express = require('express');
const { getIncomes, addIncome, deleteIncome } = require('../controllers/incomeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(protect, getIncomes)
    .post(protect, addIncome);

router.route('/:id')
    .delete(protect, deleteIncome);

module.exports = router;
