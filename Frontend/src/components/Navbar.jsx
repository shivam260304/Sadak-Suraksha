// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check auth status on mount
useEffect(() => {
  const checkToken = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  };

  checkToken(); // Run on first load
  window.addEventListener("storage", checkToken); // Run when storage changes (login/logout)

  return () => window.removeEventListener("storage", checkToken);
}, []);


  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

 const navLinks = (
  <>
    <Link to="/" className="inline-block px-2 py-1 hover:text-orange-300" onClick={() => setIsOpen(false)}>Home</Link>
    <Link to="/report" className="inline-block px-2 py-1 hover:text-orange-300" onClick={() => setIsOpen(false)}>Report</Link>
    <Link to="/my-reports" className="inline-block px-2 py-1 hover:text-orange-300" onClick={() => setIsOpen(false)}>My Reports</Link>

    {!isLoggedIn ? (
      <>
        <Link to="/login" className="inline-block px-2 py-1 hover:text-orange-300" onClick={() => setIsOpen(false)}>Login</Link>
        <Link to="/register" className="inline-block px-2 py-1 hover:text-orange-300" onClick={() => setIsOpen(false)}>Register</Link>
      </>
    ) : (
      <button
        onClick={handleLogout}
        className="inline-block px-2 py-1 hover:text-orange-300"
      >
        Logout
      </button>
    )}
  </>
);


  return (
    <nav className="bg-blue-800 text-white px-6 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          🚧 Sadak Suraksha
        </Link>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-sm md:text-base">
            {navLinks}
        </div>

      </div>

      {isOpen && (
        <div className="md:hidden mt-2 space-y-2 px-4">
          {navLinks}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
