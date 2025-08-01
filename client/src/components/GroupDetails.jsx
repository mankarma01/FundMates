import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const GroupDetails = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [memberNames, setMemberNames] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchGroupDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/groups/${groupId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setGroup(res.data);
        setMemberNames(res.data.members);
      } catch (err) {
        console.error("Error loading group details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:3000/api/expenses/group/${groupId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setExpenses(res.data);
      } catch (err) {
        console.error("Failed to fetch expenses", err);
      }
    };
    fetchExpenses();
  }, [groupId]);

  if (loading)
    return <p className="text-center mt-10 text-white text-lg">Loading...</p>;

  if (!group)
    return <p className="text-center text-red-500 text-lg">Group not found</p>;

  // Calculate fixed summary values
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const youPaid = expenses
    .filter((exp) => exp.paidBy === user.id)
    .reduce((sum, exp) => sum + exp.amount, 0);
  const othersPaid = expenses
    .filter((exp) => exp.paidBy !== user.id)
    .reduce((sum, exp) => sum + exp.amount, 0);
  const memberCount = memberNames.length || 1;
  const yourShare = othersPaid / memberCount;
  const othersOweYou = youPaid * ((memberCount - 1) / memberCount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-fuchsia-400 to-pink-300 py-10 px-4">
      <div className="max-w-3xl mx-auto backdrop-blur-xl bg-white/30 border border-white/20 rounded-3xl shadow-2xl p-8 text-white space-y-6">
        <div className="flex justify-between items-center border-b border-white/40 pb-2">
          <h2 className="text-3xl font-bold">📌 {group.groupName}</h2>
          <span className="text-lg font-semibold">
            ₹{totalSpent.toFixed(2)}
          </span>
        </div>
        <p className="text-white/80 text-sm">
          Created by: <span className="font-medium">{user.name}</span>
        </p>

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
