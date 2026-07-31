const express = require('express');
const { getSuggestions } = require('../controllers/suggestionsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, getSuggestions);

module.exports = router;
