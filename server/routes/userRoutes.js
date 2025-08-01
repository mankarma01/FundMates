const express = require('express');
const router = express.Router();
const { register, login, getUserProfile, getUserByEmail } = require('../controllers/userController');
const { protect } = require("../middlewares/authMiddleware");

router.post('/register', register);
router.post('/login', login);
router.post('/profile',protect,getUserProfile);
router.get("/by-email/:email",protect, getUserByEmail);

module.exports = router;
