import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";

const statusOptions = [
  "Submitted",
  "Under Review",
  "In Progress",
  "Resolved",
  "Rejected", // optionally show 'Rejected' if you want in dropdown
];

const Complaints = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const { isAuthenticated, userRole } = useAuth();
  const [loading, setLoading] = useState(true);

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
        setReports(res.data.reports || []);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch complaints.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [isAuthenticated, userRole]);

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/complaints/${reportId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports((prev) =>
        prev.map((r) => (r._id === reportId ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status.");
    }
  };

  const handleReject = async (reportId) => {
    if (!window.confirm("Are you sure you want to reject this report?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/complaints/${reportId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports((prev) => prev.filter((r) => r._id !== reportId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject report.");
    }
  };

  if (loading) {
    return (
      <div className="pt-20 px-4 flex justify-center">
        <p className="text-gray-600 text-center">Loading complaints...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 px-4 flex justify-center">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  const visibleReports = reports.filter((r) => r.status !== "Resolved" && r.status !== "Rejected");

  return (
    <div className="pt-20 px-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-800 text-center">
        Admin Complaints Dashboard
      </h1>
      {visibleReports.length === 0 ? (
        <p className="text-center text-gray-600">No complaints found.</p>
      ) : (
        <div className="space-y-6">
          {visibleReports.map((report) => (
            <div key={report._id} className="bg-white shadow p-4 rounded border-l-4 border-blue-600">
              <div className="flex justify-between items-center mb-2 space-x-4">
                <h2 className="font-semibold text-xl">{report.title}</h2>

                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={report.status}
                  onChange={(e) => handleStatusChange(report._id, e.target.value)}
                >
                  {statusOptions
                    .filter((status) => status !== "Rejected") /* Optional: hide 'Rejected' in dropdown */
                    .map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                </select>

                <button
                  onClick={() => handleReject(report._id)}
                  className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition"
                  title="Reject report"
                  type="button"
                >
                  Reject
                </button>
              </div>

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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Complaints;
