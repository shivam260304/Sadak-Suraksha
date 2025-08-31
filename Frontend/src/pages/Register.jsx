import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); // Not 'name'
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const blockedEmailDomains = [
    "tempmail.com",
    "10minutemail.com",
    "disposablemail.com",
    // Add more disposable domains here as needed
  ];

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) return false;
    const domain = email.split("@")[1].toLowerCase();
    return !blockedEmailDomains.includes(domain);
  };

  const validateUsername = (username) => {
    // Allow letters and spaces only, 3-30 characters, at least 2 letters
    const alphabetCount = (username.match(/[a-zA-Z]/g) || []).length;
    const pattern = /^[a-zA-Z ]{3,30}$/;
    return pattern.test(username) && alphabetCount >= 2;
  };

  const validatePassword = (password) => {
    // Minimum 6 chars, at least 1 uppercase, 1 lowercase, 1 special char
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
    return pattern.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !username || !password) {
      return setError("All fields are required.");
    }

    if (!validateEmail(email)) return setError("Please enter a valid, non-disposable email.");
    if (!validateUsername(username))
      return setError(
        "Username must be 3-30 letters/spaces with at least 2 letters, no numbers or special chars."
      );
    if (!validatePassword(password))
      return setError(
        "Password must be at least 6 characters, contain uppercase, lowercase, and special character."
      );

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password, role }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Registration failed");
      localStorage.setItem("token", data.token);
      navigate("/login");
    } catch {
      setError("Server error. Try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Register</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            required
            placeholder="Full Name"
            className="w-full px-3 py-2 mb-4 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            required
            placeholder="Email"
            className="w-full px-3 py-2 mb-4 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            placeholder="Password"
            className="w-full px-3 py-2 mb-4 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 mb-4 border rounded"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
          >
            Register
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
