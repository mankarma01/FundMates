import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  UserIcon,
  LockClosedIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Declare API_URL from your frontend .env file
  const API_URL = import.meta.env.VITE_API_URL;
// ...  handle login logic
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      });

      console.log(res.data);
      console.log("Success");

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const user = JSON.parse(localStorage.getItem("user")); // ✅ verify user stored
      console.log(user);

      navigate("/dashboard");
    } catch (err) {
      alert("Something went wrong");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-indigo-400 via-fuchsia-400 to-pink-300 font-inter">
      {/* Left: Icon & Info */}
      <div className="md:w-1/2 text-white p-10 text-center space-y-6">
        <h1 className="text-5xl font-bold drop-shadow-md">💸 FundMates</h1>
        <p className="text-lg font-medium drop-shadow-sm">
          Smarter way to track and split group expenses.
        </p>
        <ul className="space-y-2 text-left text-white/90 font-medium max-w-md mx-auto">
          <li>✅ Create or join budgeting groups</li>
          <li>✅ Add and manage shared expenses</li>
          <li>✅ Track balances in real-time</li>
          <li>✅ Transparent, secure and fast</li>
        </ul>

        <div className="flex justify-center">
          <BanknotesIcon className="h-32 w-32 text-white drop-shadow-lg" />
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8">
        <form
          onSubmit={handleLogin}
          className="bg-white/40 backdrop-blur-xl shadow-xl rounded-3xl px-8 py-10 w-full max-w-md text-gray-800"
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-md">
            Sign in to FundMates
          </h2>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-white/90 mb-1">
              Email address
            </label>
            <div className="flex items-center border border-white/40 rounded px-3 bg-white/30 backdrop-blur-sm">
              <UserIcon className="h-5 w-5 text-white/80 mr-2" />
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-white text-indigo-700 font-bold py-2 rounded hover:bg-gray-100 transition"
          >
            Login
          </button>

          {/* Sign up CTA */}
          <p className="text-center mt-4 text-sm text-white/90">
            Don’t have an account?{" "}
            <Link to="/register" className="text-white underline font-medium">
              Sign up here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
