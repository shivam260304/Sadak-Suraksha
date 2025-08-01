import React, { useEffect, useState } from "react";
import axios from "axios";

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch from backend
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get("http://localhost:5000/api/report/my", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReports(res.data.reports);
        setFiltered(res.data.reports);
      } catch (err) {
        setError(err.response?.data?.message || "Could not fetch your reports");
      }
    };
    fetchReports();
  }, []);

  // Filter by location or date string
  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);
    const result = reports.filter((report) =>
      report.location.toLowerCase().includes(keyword) ||
      new Date(report.createdAt).toLocaleDateString().includes(keyword)
    );
    setFiltered(result);
  };

  // Optionally, you can implement report deletion as a backend operation (not just front-end removal)

  return (
    <div className="pt-20 px-4 flex justify-center">
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">📋 My Reports</h2>
        <input
          type="text"
          placeholder="Search by location or date (e.g. 25/06/2025)"
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
              <div key={report._id || index} className="bg-white shadow p-4 rounded border-l-4 border-blue-600 relative">
                {/* You can add a delete button that makes a DELETE request if you add such an endpoint */}
                <h3 className="text-lg font-semibold text-blue-700">{report.title}</h3>
                <p className="text-gray-700 mb-1">{report.description}</p>
                <p className="text-sm text-gray-500">
                  📍 {report.location} | 🕒 {new Date(report.createdAt).toLocaleString()}
                </p>
                {report.imageUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">📷 Photo:</p>
                    {/* You need to serve uploaded images properly in the backend to use this */}
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
