const { default: mongoose } = require("mongoose");
const Expense = require("../models/Expense");
const Group = require("../models/Group");
const { updateBalancesForExpense } = require("../services/balanceService");
console.log("Is updateBalancesForExpense a function?", typeof updateBalancesForExpense);

console.log("About to require balanceService.js");
const balanceService = require("../services/balanceService");
console.log("balanceService loaded:", balanceService);

// Create Expense
exports.createExpense = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { title, amount, description, group, date } = req.body;
    const paidBy = req.user.id;

    const groupData = await Group.findById(group).session(session);
    if (!groupData) {
      throw new Error("Group not found");
    }
    const members = groupData.members.map(m => m.userId.toString());

    await updateBalancesForExpense(group, paidBy, amount, members, session);
  
    const expense = await Expense.create({
      title,
      amount,
      description,
      paidBy: {
        userId: req.user.id,
        name: req.user.name,
      },
      group: group || null,
      splitBetween: members,
      date: date || Date.now(),
    });

    
    await session.commitTransaction();
    session.endSession();
    res.status(201).json({ message: "Expense created successfully"})
    // 3. Split amount equally
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating expense", err);
    res
      .status(500)
      .json({ message: "Failed to create expense", error: err.message });
  }
};

// Get all expenses for logged-in user (personal + where user paid //)
exports.getMyExpenses = async (req, res) => {
  try {
    const userId = req.user._id;
    const expenses = await Expense.find({
      $or: [{ "paidBy.userId": userId }, { splitBetween: userId }],
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
  const { groupIds } = req.body;
  try {
    const expenses = await Expense.find({
      group: { $in: groupIds },
    });
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
