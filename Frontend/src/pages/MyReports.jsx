import React, { useEffect, useState } from "react";

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("reports")) || [];
    setReports(stored);
    setFiltered(stored);
  }, []);

  // 🔍 Filter by location or date string
  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);
    const result = reports.filter((report) =>
      report.location.toLowerCase().includes(keyword) ||
      new Date(report.createdAt).toLocaleDateString().includes(keyword)
    );
    setFiltered(result);
  };

  // 🗑️ Delete a report
  const handleDelete = (indexToDelete) => {
    const updated = [...reports];
    updated.splice(indexToDelete, 1);
    setReports(updated);
    setFiltered(updated);
    localStorage.setItem("reports", JSON.stringify(updated));
  };

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

        {filtered.length === 0 ? (
          <p className="text-center text-gray-600">No reports found.</p>
        ) : (
          <div className="space-y-6">
            {filtered.map((report, index) => (
              <div
                key={index}
                className="bg-white shadow p-4 rounded border-l-4 border-blue-600 relative"
              >
                <button
                  onClick={() => handleDelete(index)}
                  className="absolute top-2 right-2 text-sm bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                >
                  Delete
                </button>

                <h3 className="text-lg font-semibold text-blue-700">{report.title}</h3>
                <p className="text-gray-700 mb-1">{report.description}</p>
                <p className="text-sm text-gray-500">
                  📍 {report.location} | 🕒{" "}
                  {new Date(report.createdAt).toLocaleString()}
                </p>

                {report.image && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">📷 Photo:</p>
                    <img
                      src={URL.createObjectURL(report.image)}
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
