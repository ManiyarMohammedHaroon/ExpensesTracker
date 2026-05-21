const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount']
    },
    category: {
        type: String,
        required: [true, 'Please select a category']
    },
    date: {
        type: Date,
        required: [true, 'Please add a date'],
        default: Date.now
    },
    description: {
        type: String
    },
    receiptUrl: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);
