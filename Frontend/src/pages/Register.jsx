import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // ✅ Simulate registration (replace with API call later)
    if (email && name && password.length >= 6) {
      localStorage.setItem("token", "dummy_token");
      navigate("/"); // Redirect to home
    } else {
      setError("Please fill all fields correctly.");
    }
  };

  return (
    <div className="pt-20 flex justify-center items-center min-h-screen bg-blue-50 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Register</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleRegister}>
          <label className="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 mb-4 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
            Register
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
