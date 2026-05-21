const express = require('express');
const router = express.Router();
const { getExpenses, addExpense, getStats } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getExpenses)
    .post(protect, addExpense);

router.get('/stats', protect, getStats);

module.exports = router;
