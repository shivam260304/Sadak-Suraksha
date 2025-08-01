// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
  e.preventDefault();

  if (email === "user@example.com" && password === "123456") {
    localStorage.setItem("token", "dummy_token");
    window.dispatchEvent(new Event("storage")); // 🚀 Notifies other components (like Navbar)
    navigate("/");
  } else {
    setError("Invalid email or password");
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Login</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleLogin}>
          <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            className="w-full px-3 py-2 mb-4 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            required
            className="w-full px-3 py-2 mb-4 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don’t have an account? <a href="/register" className="text-blue-600 underline">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
