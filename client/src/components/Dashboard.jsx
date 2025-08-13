import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  UserGroupIcon,
  CurrencyDollarIcon,
  ArrowLeftOnRectangleIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get API URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL;

  // Get User details from localstrorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!token || !userData) {
      navigate("/login");
    } else {
      setUser(userData);
    }
  }, [navigate]);

  // Get total groups from DB where user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchGroups = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/groups`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroups(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching groups:", err);
        setError("Failed to load groups");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [API_URL]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const groupIds = groups.map((g) => g._id);
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const res = await axios.post(
          `${API_URL}/api/expenses/by-gorups`,
          { groupIds },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setExpenses(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching expenses:", err);
        setError("Failed to load expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [groups, API_URL]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (!user) {
    // Optionally return null or a loading state until user is loaded
    return null;
  }

  // Calculate total you paid
  const totalSpendByYou = expenses
    .filter((exp) => exp.paidBy.userId === user.id)
    .reduce((sum, exp) => sum + exp.amount, 0);

  const OwnAmount = expenses
    .filter((exp) => exp.paidBy.userId === user.id)
    .reduce(
      (sum, exp) =>
        sum +
        (exp.amount / exp.splitBetween.length) * (exp.splitBetween.length - 1),
      0
    );

  const amountYouShouldPay = expenses
    .filter(
      (exp) => exp.paidBy.userId !== user.id && exp.splitBetween.length > 1
    )
    .reduce((sum, exp) => sum + exp.amount / exp.splitBetween.length, 0);

  const yourBalance = OwnAmount - amountYouShouldPay;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-fuchsia-400 to-pink-300 font-inter p-6 pt-16">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white drop-shadow-md">
          💸 App Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-white/30 text-white font-semibold px-4 py-2 rounded-xl hover:bg-white/40 transition flex items-center"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
          Logout
        </button>
      </header>

      {/* Welcome Message */}
      <div className="bg-white/20 backdrop-blur-xl text-white rounded-2xl shadow-xl p-6 mb-8 text-center">
        <h2 className="text-2xl font-semibold">
          Welcome back, {user.name || "User"} 👋
        </h2>
        <p className="text-white/90 mt-1">
          Let's manage your group expenses smartly and transparently.
        </p>
      </div>

      {/* Strats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
        <div className="bg-white/30 rounded-2xl p-6 shadow-md flex items-center space-x-4 backdrop-blur-md">
          <UserGroupIcon className="h-10 w-10 text-white" />
          <div>
            <p className="text-lg font-bold">{groups.length}</p>
            <p className="text-sm text-white/80">Groups Joined</p>
          </div>
        </div>
        <div className="bg-white/30 rounded-2xl p-6 shadow-md flex items-center space-x-4 backdrop-blur-md">
          <CurrencyDollarIcon className="h-10 w-10 text-white" />
          <div>
            <p className="text-lg font-bold">₹{totalSpendByYou}</p>
            <p className="text-sm text-white/80">Total Expenses</p>
          </div>
        </div>
        <div className="bg-white/30 rounded-2xl p-6 shadow-md flex items-center space-x-4 backdrop-blur-md">
          <Squares2X2Icon className="h-10 w-10 text-white" />
          <div>
            <p className="text-lg font-bold">₹{yourBalance}</p>
            <p className="text-sm text-white/80">Your Balance</p>
          </div>
        </div>
      </div>

      {/* Future: List of Groups/Expenses can go here */}
      <div className="mt-10 bg-white/10 text-white text-center py-4 rounded-xl border border-white/30">
        🚧 More features like group list, recent activity, charts, etc. coming
        soon!
      </div>

      {/* Show Error if any */}
      {error && (
        <p className="mt-4 text-center text-red-500 font-semibold">{error}</p>
      )}
    </div>
  );
}

export default Dashboard;
