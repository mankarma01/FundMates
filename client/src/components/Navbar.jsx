import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (  // 
    <nav className="bg-gradient-to-br from-indigo-400 via-fuchsia-400 to-pink-300 shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo + Title */}
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="FundMates Logo"
            className="h-10 w-10 object-cover rounded-full border border-white"
          />
          <span className="text-white text-2xl font-bold tracking-wider">
            FundMates
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/dashboard" className="text-white hover:text-purple-200 transition">
            Dashboard
          </Link>
          <Link to="/groups" className="text-white hover:text-purple-200 transition">
            Groups
          </Link>
          <Link to="/expenses" className="text-white hover:text-purple-200 transition">
            Expenses
          </Link>
          <Link to="/profile" className="text-white hover:text-purple-200 transition">
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="ml-4 px-4 py-1 bg-white text-[#4A3C8C] font-semibold rounded-md hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden text-white">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#4A3C8C]/90 backdrop-blur-md px-6 pb-4 pt-2 text-white space-y-3 rounded-b-lg">
          <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block hover:text-purple-200">
            Dashboard
          </Link>
          <Link to="/groups" onClick={() => setMenuOpen(false)} className="block hover:text-purple-200">
            Groups
          </Link>
          <Link to="/expenses" onClick={() => setMenuOpen(false)} className="block hover:text-purple-200">
            Expenses
          </Link>
          <Link to="/profile" onClick={() => setMenuOpen(false)} className="block hover:text-purple-200">
            Profile
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="w-full text-left mt-2 bg-white text-[#4A3C8C] px-4 py-1 rounded-md hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
