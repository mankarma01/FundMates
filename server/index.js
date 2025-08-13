const expenseRoutes = require("./routes/expenseRoutes");
const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");
 const balanceRoutes = require("./routes/balanceRoutes");

const express = require("express");
const cors = require("cors"); // ✅ Add this
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173", // React local dev
      "incandescent-pastelito-21f7fa.netlify.app", // deployed site
    ],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Routes
app.use("/api/expenses", expenseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/balances", balanceRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
