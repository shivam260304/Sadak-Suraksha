import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import UserFooter from "../components/UserFooter";

const statusColors = {
  Submitted: "bg-gray-500",
  "Under Review": "bg-yellow-400",
  "In Progress": "bg-blue-500",
  Resolved: "bg-green-600",
  Rejected: "bg-red-600",
};

const getProgressData = (status) => {
  switch (status) {
    case "Submitted":
      return { percent: 25, color: statusColors["Submitted"] };
    case "Under Review":
      return { percent: 50, color: statusColors["Under Review"] };
    case "In Progress":
      return { percent: 75, color: statusColors["In Progress"] };
    case "Resolved":
      return { percent: 100, color: statusColors["Resolved"] };
    case "Rejected":
      return { percent: 100, color: statusColors["Rejected"] };
    default:
      return { percent: 0, color: "bg-gray-300" };
  }
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
      return;
    }

    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/myReport", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const reportsData = Array.isArray(res.data.reports) ? res.data.reports : res.data;
        setReports(reportsData);
        setFiltered(reportsData);
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
    <div>
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
              {filtered.map((report, index) => {
                const { percent, color } = getProgressData(report.status);
                return (
                  <div
                    key={report._id || index}
                    className="relative bg-white shadow p-4 rounded border-l-4 border-blue-600 flex"
                    style={{ paddingRight: "3rem" }}
                  >
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-blue-700">{report.title}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            statusColors[report.status]?.replace("bg-", "text-") || 
                            "text-gray-600 bg-gray-200"
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

                      {/* Before and After Images side by side */}
                      <div className="flex space-x-6 mt-3 max-w-xs">
                        <div className="flex flex-col items-center">
                          <span className="mb-1 font-semibold text-gray-700">Before Image</span>
                          {report.imageUrl ? (
                            <img
                              src={`http://localhost:5000${report.imageUrl}`}
                              alt="User uploaded"
                              className="max-w-xs rounded border"
                            />
                          ) : (
                            <span className="italic text-gray-400">No user image available</span>
                          )}
                        </div>

                        {/* Show AFTER image only if present */}
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

                      {/* Show Admin Remarks only if present and non-empty */}
                      {report.adminRemarks && report.adminRemarks.trim() !== "" && (
                        <p className="mt-4 text-gray-700">
                          <span className="font-semibold">Admin Remarks: </span>
                          {report.adminRemarks}
                        </p>
                      )}
                    </div>

                    {/* Vertical progress bar */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        height: "100%",
                        width: "8px",
                        overflow: "hidden",
                        borderTopRightRadius: "0.5rem",
                        borderBottomRightRadius: "0.5rem",
                        backgroundColor: "#e5e7eb",
                      }}
                      aria-label={`Progress: ${percent}%`}
                      title={`Progress: ${percent}%`}
                    >
                      <div
                        style={{
                          backgroundColor: color.replace("bg-", ""),
                          height: `${percent}%`,
                          width: "100%",
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          borderTopRightRadius: "0.5rem",
                          borderBottomRightRadius: "0.5rem",
                          transition: "height 0.3s ease",
                        }}
                        className={`${color}`}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <UserFooter />
    </div>
  );
};

export default MyReports;
