import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const commonUserLinks = (
    <>
      <Link to="/" onClick={() => setIsOpen(false)} className="inline-block px-2 py-1 hover:text-orange-300">
        Home
      </Link>
      <Link to="/report" onClick={() => setIsOpen(false)} className="inline-block px-2 py-1 hover:text-orange-300">
        Reports
      </Link>
      <Link to="/my-reports" onClick={() => setIsOpen(false)} className="inline-block px-2 py-1 hover:text-orange-300">
        My Reports
      </Link>
    </>
  );

  const adminLinks = (
    <>
      <Link to="/admin-home" onClick={() => setIsOpen(false)} className="inline-block px-2 py-1 hover:text-orange-300">
        Admin Home Page
      </Link>
      <Link to="/complaints" onClick={() => setIsOpen(false)} className="inline-block px-2 py-1 hover:text-orange-300">
        Complaints
      </Link>
      <Link to="/solves-complaints" onClick={() => setIsOpen(false)} className="inline-block px-2 py-1 hover:text-orange-300">
        Solves Complaints
      </Link>
    </>
  );

  return (
    <nav className="bg-blue-800 text-white px-6 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {userRole === "admin" ? (
          <span className="text-xl font-bold cursor-default select-none">
            🚧 Sadak Suraksha
          </span>
        ) : (
          <Link to="/" className="text-xl font-bold">
            🚧 Sadak Suraksha
          </Link>
        )}

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-sm md:text-base">
          {isAuthenticated ? (userRole === "admin" ? adminLinks : commonUserLinks) : null}
          {!isAuthenticated ? (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} className="inline-block px-2 py-1 hover:text-orange-300">
                Login
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="inline-block px-2 py-1 hover:text-orange-300">
                Register
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="inline-block px-2 py-1 hover:text-orange-300">
              Logout
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-2 space-y-2 px-4">
          {isAuthenticated ? (userRole === "admin" ? adminLinks : commonUserLinks) : null}
          {!isAuthenticated ? (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} className="inline-block px-2 py-1 hover:text-orange-300">
                Login
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="inline-block px-2 py-1 hover:text-orange-300">
                Register
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="inline-block px-2 py-1 hover:text-orange-300">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
