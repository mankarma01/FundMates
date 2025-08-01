import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const navigate = useNavigate();
  //  console.log(user);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        //     console.log(token);
        const response = await axios.post(
          "https://fundmates-backend.onrender.com/api/users/profile",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.user);
        setUser(response.data.user);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        //     navigate("/login");
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return <p className="text-center text-white mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-fuchsia-400 to-pink-300 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white/30 backdrop-blur-md rounded-3xl p-8 shadow-2xl text-white space-y-6 border border-white/20">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-white text-indigo-700 font-bold flex items-center justify-center text-2xl shadow">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-3xl font-bold drop-shadow-md">👤 {user.name}</h2>
        </div>

        <div className="space-y-3 text-white">
          <p>
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">Mobile:</span>{" "}
            {user.mobile || "Not provided"}
          </p>
          <p>
            <span className="font-semibold">Gender:</span>{" "}
            {user.gender || "Not provided"}
          </p>
          <p>
            <span className="font-semibold">Date of Birth:</span>{" "}
            {user.dob
              ? new Date(user.dob).toLocaleDateString()
              : "Not provided"}
          </p>
          <p>
            <span className="font-semibold">Joined:</span>{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "Not provided"}
          </p>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <button
            className="bg-white text-indigo-700 font-bold py-2 px-4 rounded hover:bg-gray-100 transition"
            onClick={() => alert("Edit profile coming soon!")}
          >
            ✏️ Edit Profile
          </button>
          <button
            className="bg-white text-red-500 font-bold py-2 px-4 rounded hover:bg-red-100 transition"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
