import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";

const statusColors = {
  Submitted: "text-gray-600 bg-gray-200",
  "Under Review": "text-yellow-700 bg-yellow-100",
  "In Progress": "text-blue-700 bg-blue-100",
  Resolved: "text-green-700 bg-green-100",
};

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated === false) {
      setError("You must be logged in to view your reports.");
      setLoading(false);
      return;
    }

    if (isAuthenticated === null || isAuthenticated === undefined) {
      // Authentication status unknown yet
      return;
    }

    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/myReport", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const reports = Array.isArray(res.data.reports) ? res.data.reports : res.data;
        setReports(reports);
        setFiltered(reports);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Could not fetch your reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [isAuthenticated]);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);
    const result = reports.filter(
      (report) =>
        (report.location && report.location.toLowerCase().includes(keyword)) ||
        (report.createdAt && new Date(report.createdAt).toLocaleDateString().includes(keyword))
    );
    setFiltered(result);
  };

  if (loading) {
    return (
      <div className="pt-20 px-4 flex justify-center">
        <p className="text-center text-gray-600">Loading your reports...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 flex justify-center">
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">📋 My Reports</h2>
        <input
          type="text"
          placeholder="Search by location or date (e.g., 25/06/2025)"
          value={search}
          onChange={handleSearch}
          className="w-full mb-6 px-4 py-2 border rounded shadow-sm"
        />
        {error && <p className="text-center text-red-500">{error}</p>}

        {filtered.length === 0 ? (
          <p className="text-center text-gray-600">No reports found.</p>
        ) : (
          <div className="space-y-6">
            {filtered.map((report, index) => (
              <div
                key={report._id || index}
                className="bg-white shadow p-4 rounded border-l-4 border-blue-600 relative"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-blue-700">{report.title}</h3>

                  {/* Status badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColors[report.status] || "text-gray-600 bg-gray-200"
                    }`}
                  >
                    {report.status}
                  </span>
                </div>

                <p className="text-gray-700 mb-1">{report.description}</p>
                <p className="text-sm text-gray-500">
                  📍 {report.location} | 🕒{" "}
                  {report.createdAt ? new Date(report.createdAt).toLocaleString() : ""}
                </p>
                {report.imageUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">📷 Photo:</p>
                    <img
                      src={report.imageUrl}
                      alt="Uploaded"
                      className="mt-1 max-w-xs border rounded"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;
