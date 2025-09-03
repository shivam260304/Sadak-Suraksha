/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../components/AuthContext";

const AdminHome = () => {
  const [counts, setCounts] = useState({ Resolved: 0, Rejected: 0 });
  const [error, setError] = useState("");
  const { isAuthenticated, userRole } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || userRole !== "admin") return;

    const fetchStatusCounts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/report/status-counts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCounts(res.data);
        setError("");
      } catch (err) {
        console.log(error);
        setError(err.response?.data?.message || "Failed to fetch report counts.");
      }
    };

    fetchStatusCounts();
  }, [isAuthenticated, userRole]);

  if (!isAuthenticated || userRole !== "admin") {
    return (
      <div className="pt-20 px-4 flex justify-center">
        <p className="text-red-600 text-center">Access denied. Admins only.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 text-gray-800 px-6 py-16 sm:px-12 md:px-20 lg:px-32">
      {/* Hero Section */}
      <section className="text-center mb-16 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-blue-800 leading-tight">
          🚧 Sadak Suraksha - Admin
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
          Administrative dashboard to manage road hazard reports and complaints.
        </p>
        <div className="flex justify-center gap-6 mt-8">
          <Link to="/complaints" aria-label="Manage complaints">
            <button className="px-8 py-3 cursor-pointer bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white rounded-lg shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
              Complaints 🛣️
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 max-w-6xl mx-auto text-left">
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold text-blue-700 mb-3">✅ Solved Reports</h2>
          <p className="text-gray-600 leading-relaxed">
            Review all resolved reports to ensure quality and closure.
          </p>
          <p className="mt-2 text-lg font-semibold">Total: {counts.Resolved}</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold text-blue-700 mb-3">❌ Rejected Reports</h2>
          <p className="text-gray-600 leading-relaxed">
            Review reports rejected for spam or inappropriate submissions.
          </p>
          <p className="mt-2 text-lg font-semibold">Total: {counts.Rejected}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 text-center text-sm text-gray-500 select-none">
        🇮🇳 Made with care for Indian roads by Team Sadak Suraksha
      </footer>
    </div>
  );
};

export default AdminHome;
