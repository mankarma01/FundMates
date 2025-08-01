const expenseRoutes = require("./routes/expenseRoutes");
const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");
// const authRoutes = require("./routes/authRoutes");

const express = require("express");
const cors = require("cors"); // ✅ Add this
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// ✅ Enable CORS
app.use(
  cors({
    origin: "https://incandescent-pastelito-21f7fa.netlify.app", // ✅ NEW frontend URL
    credentials: true,
  })
);


app.use(express.json());

// ✅ Routes
// app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
