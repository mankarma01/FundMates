const mongoose = require("mongoose");

const expenseShareSchema = new mongoose.Schema(
  {
    expense: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amountOwed: {
      type: Number,
      required: true,
    },
    isSettled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ExpenseShare = mongoose.model("ExpenseShare", expenseShareSchema);
module.exports = ExpenseShare;
