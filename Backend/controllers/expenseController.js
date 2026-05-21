const Expense = require('../models/Expense');

const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const addExpense = async (req, res) => {
    try {
        const { title, amount, category, date, description, receiptUrl } = req.body;

        const expense = await Expense.create({
            user: req.user.id,
            title,
            amount,
            category,
            date,
            description,
            receiptUrl
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ message: 'Invalid expense data' });
    }
};

const getStats = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id });

        // This is a simplified stats logic. We can move more complex aggregation to MongoDB
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getExpenses, addExpense, getStats };
