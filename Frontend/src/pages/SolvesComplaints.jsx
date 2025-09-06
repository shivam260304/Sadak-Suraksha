import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import Footer from "../components/Footer";

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

        // Adjust the API call to fetch only Resolved and Rejected directly, 
        // and subsequently apply filter client-side for toggling views
        const res = await axios.get("http://localhost:5000/api/resolved-reports", {
          headers: { Authorization: `Bearer ${token}` },
        });

        let data = res.data.reports || [];

        // Filter client-side based on selected filter
        if (filter === "resolved") {
          data = data.filter((r) => r.status === "Resolved");
        } else if (filter === "rejected") {
          data = data.filter((r) => r.status === "Rejected");
        } else {
          // default - show both resolved and rejected only (exclude other statuses if any)
          data = data.filter((r) => r.status === "Resolved" || r.status === "Rejected");
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
    setLoading(true);
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
        <option value="all">All Resolved & Rejected</option>
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
                : "border-red-600"
            }`}
          >
            {/* Username display */}
            <h2 className="text-md font-semibold mb-1 text-gray-700">
              Reported by: {report.user?.username || "Anonymous"}
            </h2>

            <h3 className="font-semibold text-xl mb-2">{report.title}</h3>
            <p className="text-gray-700 mb-1">{report.description}</p>
            <p className="text-gray-500 text-sm mb-1">
              Priority: <strong>{report.priority}</strong>
            </p>
            <p className="text-gray-500 text-sm mb-1">Location: {report.location}</p>

            {/* Images side-by-side */}
            {(report.imageUrl || (report.adminImageUrl && report.adminImageUrl.trim() !== "")) && (
              <div className="flex items-start space-x-6 mt-2 max-w-xs">
                {/* Before Image */}
                {report.imageUrl && (
                  <div className="flex flex-col items-center">
                    <span className="mb-1 font-semibold text-gray-700">Before Image</span>
                    <img
                      src={`http://localhost:5000${report.imageUrl}`}
                      alt="User uploaded"
                      className="max-w-xs rounded border"
                    />
                  </div>
                )}

                {/* After Image */}
                {report.adminImageUrl && report.adminImageUrl.trim() !== "" && (
                  <div className="flex flex-col items-center">
                    <span className="mb-1 font-semibold text-gray-700">After Image</span>
                    <img
                      src={
                        report.adminImageUrl.startsWith("http")
                          ? report.adminImageUrl
                          : `http://localhost:5000${report.adminImageUrl}`
                      }
                      alt="Admin uploaded"
                      className="max-w-xs rounded border"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Admin Remarks */}
            {report.adminRemarks && report.adminRemarks.trim() !== "" && (
              <p className="mt-4 text-gray-700">
                <span className="font-semibold">Admin Remarks: </span>
                {report.adminRemarks}
              </p>
            )}

            <p className="text-gray-400 text-xs mt-2">
              Created at: {new Date(report.createdAt).toLocaleString()}
            </p>
            <p
              className={`mt-1 font-semibold ${
                report.status === "Resolved"
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              Status: {report.status}
            </p>
          </div>
        ))}
      </div>
    )}
    <Footer />
  </div>
);

};

export default SolvesComplaints;
