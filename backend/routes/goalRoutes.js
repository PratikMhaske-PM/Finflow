const express = require('express');
const { getGoals, addGoal, deleteGoal } = require('../controllers/goalController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(protect, getGoals).post(protect, addGoal);
router.route('/:id').delete(protect, deleteGoal);

module.exports = router;
