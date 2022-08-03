const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
    email: { type: String, required: true },
    winnings: { type: Number, required: true },
    game: {type: String, required: true},
    date: {type: Date, required: true}
  });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;