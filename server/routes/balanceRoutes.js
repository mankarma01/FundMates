const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const balanceController = require("../controllers/balanceController");



router.get("/group/:groupId", protect, balanceController.getGroupBalances);


module.exports = router;