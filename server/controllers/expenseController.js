const { default: mongoose } = require("mongoose");
const Expense = require("../models/Expense");
const Group = require("../models/Group");

// Create Expense
exports.createExpense = async (req, res) => {
  try {
    const { title, amount, description, group, splitBetween, date } = req.body;

    const groupDetails = await Group.findById(group);
    const memberArr = groupDetails.members;
    console.log(groupDetails.members);
    const expense = await Expense.create({
      title,
      amount,
      description,
      paidBy: {
        userId: req.user._id,
        name: req.user.name,
      },
      group: group || null,
      splitBetween: memberArr,
      date: date || Date.now(),
    });
    //   console.log(res.user)
    res.status(201).json(expense);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create expense", error: err.message });
  }
};

// Get all expenses for logged-in user (personal + where user paid //)
exports.getMyExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      $or: [{ paidBy: req.user._id }, { splitBetween: req.user._id }],
    }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch expenses", error: err.message });
  }
};

// Get Total expenses paid by logged-in user
exports.getExpensesPaidByUser = async (req, res) => {
  try {
    const expenses = await Expense.find({
      paidBy: mongoose.Types.ObjectId(req.user.id),
    }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch expenses", error: err.message });
  }
};

// get expnese all not paid by user
exports.getExpensesnotbyuser = async (req, res) => {
  try {
    const expenses = await Expense.find({ splitBetween: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(expenses);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch expenses", error: err.message });
  }
};

//Get Expense by groupId
exports.getExpenseByGroupId = async (req, res) => {
  try {
    const groupId = req.params.groupId;

    const expenses = await Expense.find({ group: groupId }).sort({
      createdAt: -1,
    });
    if (!expenses) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.status(200).json(expenses);
  } catch (err) {
    console.error("Error fetching expenses by group ID:", err);
    res.status(500).json({
      message: "Failed to fetch expenses",
      error: err.message,
    });
  }
};

// Update expense (only creator/paidBy allowed for now)
exports.updateExpense = async (req, res) => {
  try {
    const exp = await Expense.findById(req.params.id);
    if (!exp) return res.status(404).json({ message: "Expense not found" });

    if (exp.paidBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only payer can update expense" });
    }

    const { amount, description, group, splitBetween, date } = req.body;
    if (amount !== undefined) exp.amount = amount;
    if (description !== undefined) exp.description = description;
    if (group !== undefined) exp.group = group;
    if (splitBetween !== undefined) exp.splitBetween = splitBetween;
    if (date !== undefined) exp.date = date;

    await exp.save();
    res.json(exp);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update expense", error: err.message });
  }
};

// Delete expense (only payer allowed)
exports.deleteExpense = async (req, res) => {
  try {
    const exp = await Expense.findById(req.params.id);
    if (!exp) return res.status(404).json({ message: "Expense not found" });

    if (exp.paidBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only payer can delete expense" });
    }

    await exp.deleteOne();
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete expense", error: err.message });
  }
};
