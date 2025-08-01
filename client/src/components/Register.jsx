import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Inside handleRegister
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://fundmates-backend.onrender.com/api/users/register",
        {
          name,
          email,
          password,
        }
      );

      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      alert(message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-indigo-400 via-fuchsia-400 to-pink-300 font-inter">
      {/* Left Content */}
      <div className="md:w-1/2 text-white p-10 text-center space-y-6">
        <h1 className="text-5xl font-bold drop-shadow-md">💸 FundMates</h1>
        <p className="text-lg font-medium drop-shadow-sm">
          Split, Track, and Save — Together!
        </p>
        <ul className="space-y-2 text-left text-white/90 font-medium max-w-md mx-auto">
          <li>✅ Create budgeting groups</li>
          <li>✅ Log and manage shared expenses</li>
          <li>✅ Track contributions in real time</li>
        </ul>
      </div>

      {/* Right Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8">
        <form
          onSubmit={handleRegister}
          className="bg-white/40 backdrop-blur-xl shadow-xl rounded-3xl px-8 py-10 w-full max-w-md text-gray-800"
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-md">
            Create Your FundMates Account
          </h2>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-white/90 mb-1">
              Name
            </label>
            <div className="flex items-center border border-white/40 rounded px-3 bg-white/30 backdrop-blur-sm">
              <UserIcon className="h-5 w-5 text-white/80 mr-2" />
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-2 bg-transparent text-white placeholder-white/80 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-white/90 mb-1">
              Email
            </label>
            <div className="flex items-center border border-white/40 rounded px-3 bg-white/30 backdrop-blur-sm">
              <EnvelopeIcon className="h-5 w-5 text-white/80 mr-2" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2 bg-transparent text-white placeholder-white/80 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white/90 mb-1">
              Password
            </label>
            <div className="flex items-center border border-white/40 rounded px-3 bg-white/30 backdrop-blur-sm">
              <LockClosedIcon className="h-5 w-5 text-white/80 mr-2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-2 bg-transparent text-white placeholder-white/80 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-white text-indigo-700 font-bold py-2 rounded hover:bg-gray-100 transition"
          >
            Register
          </button>

          <p className="text-center mt-4 text-sm text-white/90">
            Already have an account?{" "}
            <Link to="/login" className="text-white underline font-medium">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
