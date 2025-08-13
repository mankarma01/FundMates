import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const GroupDetails = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]); // ✅ New state
  const [memberNames, setMemberNames] = useState([]);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch group details
  useEffect(() => {
    if (!token || !groupId) return;

    const fetchGroupDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_URL}/api/groups/${groupId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroup(res.data);
        setMemberNames(res.data.members || []);
      } catch (err) {
        console.error("Error loading group details:", err);
        setError("Failed to load group details");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId, token, API_URL]);

  // Fetch expenses
  useEffect(() => {
    if (!token || !groupId) return;

    const fetchExpenses = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/expenses/group/${groupId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setExpenses(res.data);
      } catch (err) {
        console.error("Failed to fetch expenses", err);
        setError("Failed to load expenses");
      }
    };

    fetchExpenses();
  }, [groupId, token, API_URL]);

  // ✅ Fetch balances
  useEffect(() => {
    if (!token || !groupId) return;

    const fetchBalances = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/balances/group/${groupId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBalances(res.data);
      } catch (err) {
        console.error("Failed to fetch balances", err);
        setError("Failed to load balances");
      }
    };
    fetchBalances();
  }, [groupId, token, API_URL]);

  if (loading)
    return <p className="text-center mt-10 text-white text-lg">Loading...</p>;

  if (error)
    return <p className="text-center mt-10 text-red-500 text-lg">{error}</p>;

  if (!group)
    return <p className="text-center text-red-500 text-lg">Group not found</p>;

  if (!user)
    return (
      <p className="text-center text-red-500 text-lg">
        User not found. Please log in.
      </p>
    );

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const youPaid = expenses
    .filter((exp) => exp.paidBy?.userId === user._id)
    .reduce((sum, exp) => sum + exp.amount, 0);
  const othersPaid = expenses
    .filter((exp) => exp.paidBy?.userId !== user._id)
    .reduce((sum, exp) => sum + exp.amount, 0);

  const memberCount = memberNames.length > 0 ? memberNames.length : 1;
  const yourShare = othersPaid / memberCount;
  const othersOweYou = youPaid * ((memberCount - 1) / memberCount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-fuchsia-400 to-pink-300 py-10 px-4">
      <div className="max-w-3xl mx-auto backdrop-blur-xl bg-white/30 border border-white/20 rounded-3xl shadow-2xl p-8 text-white space-y-6">
        {/* Group Header */}
        <div className="flex justify-between items-center border-b border-white/40 pb-2">
          <h2 className="text-3xl font-bold">📌 {group.groupName}</h2>
          <span className="text-lg font-semibold">
            ₹{totalSpent.toFixed(2)}
          </span>
        </div>
        <p className="text-white/80 text-sm">
          Created by:{" "}
          <span className="font-medium">
            {group.createdBy?.name || "Unknown"}
          </span>
        </p>

        {/* Summary */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-md">
          <h3 className="text-xl font-bold mb-2">📊 Group Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white/90">
            <div>
              <p className="text-sm">Total Spent</p>
              <p className="font-semibold text-lg">₹{totalSpent.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm">You Paid</p>
              <p className="font-semibold text-lg">₹{youPaid.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm">Amount You Should Pay</p>
              <p className="font-semibold text-lg">₹{yourShare.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm">Others Owe You</p>
              <p className="font-semibold text-lg">
                ₹{othersOweYou.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* ✅ Balances Section (UI matched to other cards + Pay button) */}
        <div>
          <h3 className="text-2xl font-bold mb-2">⚖️ Balances</h3>
          {balances.length === 0 ? (
            <p className="text-white/80 italic">No balances calculated yet.</p>
          ) : (
            <ul className="space-y-3">
              {balances.map((b) => {
                const isYouOwed = b.to?._id === user._id;
                const isYouOwe = b.from?._id === user._id;

                return (
                  <li
                    key={b._id}
                    className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-white/20 shadow-md flex justify-between items-center"
                  >
                    <div>
                      <p className="text-white/90">
                        <strong>{b.from?.name}</strong> owes{" "}
                        <strong>{b.to?.name}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`font-bold px-3 py-1 rounded-full 
                     "bg-white-500/20 text-white-300 border border-white-400/30"
                     border-red-400/30"`}
                      >
                        ₹{b.amount.toFixed(2)}
                      </span>

                      {/* Pay button only if current user owes */}
                      {isYouOwe && (
                        <button
                          onClick={() => handlePay(b)}
                          className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded-full"
                        >
                          Pay
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Members */}
        <div>
          <h3 className="text-2xl font-bold mb-2">👥 Group Members</h3>
          <ul className="flex flex-wrap gap-2">
            {memberNames.map((member) => (
              <li
                key={member._id}
                className="bg-white/20 backdrop-blur-sm text-sm px-4 py-2 rounded-full border border-white/20 text-white shadow"
              >
                {member.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Expenses */}
        <div>
          <h3 className="text-2xl font-bold mb-2">💰 Expenses</h3>
          {expenses.length === 0 ? (
            <p className="text-white/80 italic">
              No expenses in this group yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {expenses.map((expense) => (
                <li
                  key={expense._id}
                  className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-white/20 shadow-md"
                >
                  <div className="flex justify-between">
                    <p className="text-lg font-semibold">{expense.title}</p>
                    <p className="text-lg font-bold">
                      ₹{expense.amount.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-white/90 text-sm">
                    Paid by: {expense.paidBy?.name || "Unknown"}
                  </p>
                  <p className="text-white/80 text-xs">
                    Date: {new Date(expense.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
