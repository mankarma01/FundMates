const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String, trim: true },
    paidBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" }, // optional now
    splitBetween: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // optional now
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
