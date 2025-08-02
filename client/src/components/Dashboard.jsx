import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!token || !userData) {
      navigate("/login");
    } else {
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchGroups = async () => {
      try {
        const res = await axios.get(
          "https://fundmates-backend.onrender.com/api/groups",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setGroups(res.data);
      } catch (err) {
        console.error("Error fetching groups:", err);
        setError("Failed to load groups");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

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
          Welcome back, {user?.name || "User"} 👋
        </h2>
        <p className="text-white/90 mt-1">
          Let's manage your group expenses smartly and transparently.
        </p>
      </div>

      {/* Stats Section */}
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
            <p className="text-lg font-bold">₹12,350</p>
            <p className="text-sm text-white/80">Total Expenses</p>
          </div>
        </div>
        <div className="bg-white/30 rounded-2xl p-6 shadow-md flex items-center space-x-4 backdrop-blur-md">
          <Squares2X2Icon className="h-10 w-10 text-white" />
          <div>
            <p className="text-lg font-bold">₹1,200</p>
            <p className="text-sm text-white/80">Your Balance</p>
          </div>
        </div>
      </div>

      {/* Future: List of Groups/Expenses can go here */}
      <div className="mt-10 bg-white/10 text-white text-center py-4 rounded-xl border border-white/30">
        🚧 More features like group list, recent activity, charts, etc. coming
        soon!
      </div>
    </div>
  );
}

export default Dashboard;
