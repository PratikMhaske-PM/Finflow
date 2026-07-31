const express = require('express');
const { getAnalytics, exportCSV } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/analytics', protect, getAnalytics);
router.get('/export', protect, exportCSV);

module.exports = router;
