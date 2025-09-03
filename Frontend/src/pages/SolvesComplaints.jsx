import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";

const SolvesComplaints = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const { isAuthenticated, userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, resolved, rejected

  useEffect(() => {
    if (!isAuthenticated || userRole !== "admin") {
      setError("Access denied. Admins only.");
      setLoading(false);
      return;
    }

    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/complaints", {
          headers: { Authorization: `Bearer ${token}` },
        });

        let data = res.data.reports || [];

        // Apply filter
        if (filter === "resolved") {
          data = data.filter((r) => r.status === "Resolved");
        } else if (filter === "rejected") {
          data = data.filter((r) => r.status === "Rejected");
        }

        // Sort by createdAt descending (latest first)
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setReports(data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [isAuthenticated, userRole, filter]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  if (loading)
    return (
      <div className="pt-20 px-4 flex justify-center">
        <p className="text-gray-600 text-center">Loading reports...</p>
      </div>
    );

  if (error)
    return (
      <div className="pt-20 px-4 flex justify-center">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );

  return (
    <div className="pt-20 px-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-green-800 text-center">
        Solved & Rejected Complaints
      </h1>

      <div className="mb-6 flex justify-center max-w-xs mx-auto">
        <label htmlFor="filter" className="mr-2 font-semibold text-gray-700">
          Filter:
        </label>
        <select
          id="filter"
          value={filter}
          onChange={handleFilterChange}
          className="border rounded px-2 py-1"
        >
          <option value="all">All Reports</option>
          <option value="resolved">Resolved Reports</option>
          <option value="rejected">Rejected Reports</option>
        </select>
      </div>

      {reports.length === 0 ? (
        <p className="text-center text-gray-600">No reports found.</p>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <div
              key={report._id}
              className={`bg-white shadow p-4 rounded border-l-4 ${
                report.status === "Resolved"
                  ? "border-green-600"
                  : report.status === "Rejected"
                  ? "border-red-600"
                  : "border-gray-400"
              }`}
            >
              <h2 className="font-semibold text-xl mb-2">{report.title}</h2>
              <p className="text-gray-700 mb-1">{report.description}</p>
              <p className="text-gray-500 text-sm mb-1">
                Priority: <strong>{report.priority}</strong>
              </p>
              <p className="text-gray-500 text-sm mb-1">Location: {report.location}</p>
              {report.imageUrl && (
                <img
                  src={`http://localhost:5000${report.imageUrl}`}
                  alt="Report"
                  className="max-w-xs mt-2 rounded border"
                />
              )}
              <p className="text-gray-400 text-xs mt-2">
                Created at: {new Date(report.createdAt).toLocaleString()}
              </p>
              <p
                className={`mt-1 font-semibold ${
                  report.status === "Resolved"
                    ? "text-green-700"
                    : report.status === "Rejected"
                    ? "text-red-700"
                    : "text-gray-700"
                }`}
              >
                Status: {report.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SolvesComplaints;
