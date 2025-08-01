import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BanknotesIcon } from "@heroicons/react/24/outline";

function AddExpense() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [group, setGroup] = useState("");
  const [splitBetween, setSplitBetween] = useState([]);
  // const [allUsers, setAllUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ✅ Fetch users & groups for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const userRes = await axios.get("https://fundmates-backend.onrender.com/api/users", {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // setAllUsers(userRes.data);

        const groupRes = await axios.get(
          "https://fundmates-backend.onrender.com/api/groups",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setGroups(groupRes.data);
        console.log("Groups fetched:", groupRes.data);
      } catch (err) {
        console.error("Error fetching users/groups", err);
      }
    };
    fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://fundmates-backend.onrender.com/api/expenses",
        {
          title,
          amount,
          description,
          group: group || null,
          splitBetween,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Expense added successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error adding expense", err);
      alert("Failed to add expense");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-400 via-fuchsia-400 to-pink-300 font-inter px-4">
      <div className="bg-white/40 backdrop-blur-xl shadow-2xl rounded-3xl p-10 w-full max-w-2xl text-white">
        <h2 className="text-4xl font-bold text-center mb-8 drop-shadow-md">
          Add New Expense
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm mb-1 font-medium">Title</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded bg-white/30 text-white placeholder-white/80 border border-white/40 focus:outline-none"
              placeholder="Dinner at restaurant"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm mb-1 font-medium">Amount (₹)</label>
            <input
              type="number"
              className="w-full px-4 py-2 rounded bg-white/30 text-white placeholder-white/80 border border-white/40 focus:outline-none"
              placeholder="500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-1 font-medium">
              Description (optional)
            </label>
            <textarea
              className="w-full px-4 py-2 rounded bg-white/30 text-white placeholder-white/80 border border-white/40 focus:outline-none"
              placeholder="Food, drinks, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            />
          </div>

          {/* Group Selection */}
          <div>
            <label className="block text-sm mb-1 font-medium">
              Group (optional)
            </label>
            <select
              className="w-full px-4 py-2 rounded bg-white/30 text-white border border-white/40 focus:outline-none"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            >
              <option value="" className="text-gray-400">
                None
              </option>
              {groups.map((g) => (
                <option key={g._id} value={g._id} className="text-gray-800">
                  {g.groupName}
                </option>
              ))}
            </select>
          </div>

          {/* Split Between */}
          {/* <div>
            <label className="block text-sm mb-1 font-medium">
              Split Between
            </label>
            <select
              multiple
              className="w-full px-4 py-2 rounded bg-white/30 text-white border border-white/40 focus:outline-none"
              value={splitBetween}
              onChange={(e) =>
                setSplitBetween(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {allUsers.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div> */}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-white text-indigo-700 font-bold py-2 rounded hover:bg-gray-100 transition"
          >
            Add Expense
          </button>
        </form>

        <div className="mt-6 flex justify-center">
          <BanknotesIcon className="h-10 w-10 text-white drop-shadow-lg" />
        </div>
      </div>
    </div>
  );
}

export default AddExpense;
