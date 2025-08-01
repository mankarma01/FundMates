const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
 //     console.log("🔐 Token received:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
 //     console.log("🔓 Decoded JWT:", decoded); // <--- Important

      const user = await User.findById(decoded.userId);
 //     console.log("👤 Fetched user from DB:", user); // <--- Important

      if (!user) {
        return res.status(404).json({ message: "User not found in DB" });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error("❌ Token verification failed:", err.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};
