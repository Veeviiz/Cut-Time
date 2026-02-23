import { useEffect, useRef, useState } from "react";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { PiFilmSlateFill } from "react-icons/pi";
import { NavLink, useNavigate } from "react-router-dom";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const handleLogout = () => {
    // 1. ลบ token
    localStorage.removeItem("token");

    // 2. ไปหน้า login
    navigate("/login", { replace: true });
  };
  const linkStyle = ({ isActive }) =>
    isActive ? "text-sky-400 font-semibold" : "hover:text-sky-400 transition";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <nav className="bg-slate-800 text-white px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <NavLink className="flex gap-4 items-center">
          <PiFilmSlateFill className="text-2xl" />
          <h1 className="text-xl font-bold">CutTime</h1>
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <NavLink className={linkStyle} to="/">
            Dashboard
          </NavLink>
          <NavLink className={linkStyle} to="/projects">
            Projects
          </NavLink>
          <NavLink className={linkStyle} to="/about">
            About
          </NavLink>

          {/* Profile */}
          <div className="relative" ref={dropdownRef}>
            <FaUserCircle
              className="text-2xl cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-slate-800 text-white rounded-lg shadow-lg py-2">
                <NavLink
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </NavLink>

                <NavLink
                  to="/settings"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Settings
                </NavLink>

                <hr className="my-2" />

                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Button */}
        <div className="md:hidden">
          {isOpen ? (
            <FaTimes
              onClick={() => setIsOpen(false)}
              className="cursor-pointer"
            />
          ) : (
            <FaBars
              onClick={() => setIsOpen(true)}
              className="cursor-pointer"
            />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden mt-4 space-y-4 flex flex-col">
          <NavLink to="/" className={linkStyle}>
            Dashboard
          </NavLink>
          <NavLink to="/projects" className={linkStyle}>
            Projects
          </NavLink>
          <NavLink to="/about" className={linkStyle}>
            About
          </NavLink>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
