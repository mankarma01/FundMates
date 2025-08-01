const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // ❌ REMOVE manual bcrypt hash
    // const hashed = await bcrypt.hash(password, 10);

    // ✅ Let schema do the hashing
    const user = await User.create({ name, email, password });

    res.status(201).json({ message: "User registered", userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔐 Login request received:", email, password);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ Email not found in DB");
      return res.status(400).json({ message: "Invalid credentials - email" });
    }

    console.log("✅ User found:", user);

    console.log("📦 Stored hashed password:", user.password);
    console.log("🔑 Plain password:", password);

    const isMatch = await bcrypt.compare(password,user.password);
  
    console.log(user.password);
    console.log(password)
    console.log("🧪 bcrypt.compare result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials - password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("🔥 Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
