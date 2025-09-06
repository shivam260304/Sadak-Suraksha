import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import Footer from "../components/Footer";

const statusOptions = [
  "Submitted",
  "Under Review",
  "In Progress",
  "Resolved",
  "Rejected",
];

const Complaints = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const { isAuthenticated, userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [uploadingReportId, setUploadingReportId] = useState(null);
  const [remarks, setRemarks] = useState({});

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

        const initialRemarks = {};
        (res.data.reports || []).forEach((report) => {
          initialRemarks[report._id] = report.adminRemarks || "";
        });
        setRemarks(initialRemarks);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch complaints.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [isAuthenticated, userRole]);

  const handleStatusChange = async (reportId, newStatus) => {
    const report = reports.find((r) => r._id === reportId);

    if (newStatus === "Resolved" && !report.adminImageUrl) {
      setError("Admin must upload an image before resolving the report.");
      return; // Do NOT update reports — just show error, keep current list
    }

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
      setError("");
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
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject report.");
    }
  };

  const handleImageUpload = async (reportId, file) => {
    if (!file) return;
    setUploadingReportId(reportId);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("adminImage", file);

      const res = await axios.post(
        `http://localhost:5000/api/complaints/${reportId}/admin-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newAdminImageUrl = res.data.report.adminImageUrl;

      setReports((prev) =>
        prev.map((r) =>
          r._id === reportId ? { ...r, adminImageUrl: newAdminImageUrl } : r
        )
      );
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload admin image.");
    } finally {
      setUploadingReportId(null);
    }
  };

  const handleRemarksChange = (reportId, value) => {
    setRemarks((prev) => ({ ...prev, [reportId]: value }));
  };

  const saveAdminRemarks = async (reportId) => {
    if (!remarks[reportId]) return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/complaints/${reportId}/admin-remarks`,
        { remarks: remarks[reportId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save admin remarks.");
    }
  };

  if (loading) {
    return (
      <div className="pt-20 px-4 flex justify-center">
        <p className="text-gray-600 text-center">Loading complaints...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 max-w-6xl mx-auto">
      {error && (
        <div className="mb-4 text-center text-red-600 font-semibold">{error}</div>
      )}
      <h1 className="text-3xl font-bold mb-6 text-blue-800 text-center">
        Admin Complaints Dashboard
      </h1>
      {reports.length === 0 ? (
        <p className="text-center text-gray-600">No complaints found.</p>
      ) : (
        <div className="space-y-6">
          {reports
            .filter((r) => r.status !== "Resolved" && r.status !== "Rejected")
            .map((report) => (
              <div
                key={report._id}
                className="bg-white shadow p-4 rounded border-l-4 border-blue-600"
              >
                <div className="flex justify-between items-center mb-2 space-x-4">
                  <div>
                    <h2 className="font-semibold text-xl">{report.title}</h2>
                    <p className="text-sm text-gray-600">
                      Reported by:{" "}
                      <span className="font-medium text-gray-800">
                        {report.user?.username || "Anonymous"}
                      </span>
                    </p>
                  </div>

                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={report.status}
                    onChange={(e) => handleStatusChange(report._id, e.target.value)}
                  >
                    {statusOptions
                      .filter((status) => status !== "Rejected")
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

                <div className="flex flex-wrap gap-4 mt-2 items-center">
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

                  {report.adminImageUrl && (
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

                {report.status === "In Progress" && (
                  <div className="mt-4">
                    <label
                      className="block font-semibold mb-1"
                      htmlFor={`file-upload-${report._id}`}
                    >
                      Upload Admin Image:
                    </label>
                    <input
                      id={`file-upload-${report._id}`}
                      type="file"
                      accept="image/*"
                      disabled={uploadingReportId === report._id}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleImageUpload(report._id, e.target.files[0]);
                          e.target.value = null;
                        }
                      }}
                      className="border p-1 rounded"
                    />
                    {uploadingReportId === report._id && (
                      <p className="text-sm text-blue-600 mt-1">Uploading image...</p>
                    )}
                  </div>
                )}

                {report.adminRemarks && report.adminRemarks.trim() !== "" && (
                  <p className="mt-4 text-gray-700">
                    <span className="font-semibold">Admin Remarks: </span>
                    {report.adminRemarks}
                  </p>
                )}

                <div className="mt-4">
                  <label
                    htmlFor={`admin-remarks-${report._id}`}
                    className="block font-semibold mb-1"
                  >
                    Edit Admin Remarks:
                  </label>
                  <textarea
                    id={`admin-remarks-${report._id}`}
                    rows={3}
                    value={remarks[report._id] || ""}
                    onChange={(e) => handleRemarksChange(report._id, e.target.value)}
                    className="w-full p-2 border rounded resize-y"
                    placeholder="Write remarks or review here"
                  />
                  <button
                    onClick={() => saveAdminRemarks(report._id)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Save Remarks
                  </button>
                </div>

                <p className="text-gray-400 text-xs mt-2">
                  Created at: {new Date(report.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Complaints;
