import { useEffect, useState } from "react";
import axios from "axios";
import Group from "./Group";
import { useNavigate } from "react-router-dom";

function GroupsPage() {
  const [showModal, setShowModal] = useState(false);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Declare API_URL from your .env
  const API_URL = import.meta.env.VITE_API_URL;

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  // Fetch groups from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to view groups.");
      setLoading(false);
      return;
    }

    const fetchGroups = async () => {
      try {
        setLoading(true);
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

  // Update groups after a new group is created
  const handleGroupCreated = (newGroup) => {
    setGroups((prev) => [...prev, newGroup]);
    handleClose();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-fuchsia-400 to-pink-300 py-10 px-4 font-inter">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-md">
            Your Groups
          </h1>
          <button
            className="bg-white text-indigo-700 font-semibold px-5 py-2 rounded-lg shadow hover:bg-gray-100 transition"
            onClick={handleOpen}
          >
            + Create Group
          </button>
        </div>

        {/* Status */}
        {loading ? (
          <div className="text-white/90 text-lg">Loading groups...</div>
        ) : error ? (
          <div className="text-red-200 text-lg">{error}</div>
        ) : groups.length === 0 ? (
          <div className="bg-white/30 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-white text-center shadow-md">
            You haven’t created any groups yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groups.map((group) => (
              <div
                key={group._id}
                onClick={() => navigate(`/groups/${group._id}`)}
                className="cursor-pointer bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl hover:bg-white/40 hover:scale-[1.01] transition transform"
              >
                <h3 className="text-2xl font-bold text-white drop-shadow">
                  {group.groupName}
                </h3>
                <p className="text-white/80 mt-2 text-sm">
                  Created At: {new Date(group.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <Group onClose={handleClose} onGroupCreated={handleGroupCreated} />
      )}
    </div>
  );
}

export default GroupsPage;
