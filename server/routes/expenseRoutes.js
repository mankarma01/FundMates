const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

const expenseCtrl = require("../controllers/expenseController");

// All routes protected
router.post("/", protect, expenseCtrl.createExpense);
router.get("/", protect, expenseCtrl.getMyExpenses);
router.post("/by-gorups", protect, expenseCtrl.getExpensesPaidByUser);
router.get("/splitWithUser", protect, expenseCtrl.getExpensesnotbyuser);
router.get("/group/:groupId", protect, expenseCtrl.getExpenseByGroupId);
router.put("/:id", protect, expenseCtrl.updateExpense);
router.delete("/:id", protect, expenseCtrl.deleteExpense);

module.exports = router;
