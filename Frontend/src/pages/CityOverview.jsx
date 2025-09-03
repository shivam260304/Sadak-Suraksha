import React, { useEffect, useState } from "react";

const CityOverview = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResolvedReports = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/resolved-reports");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setReports(data.reports || []);
        setError("");
      } catch (err) {
        setError(err.message || "Could not fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchResolvedReports();
  }, []);

  if (loading)
    return (
      <div className="pt-20 px-4 flex justify-center">
        <p className="text-gray-600 text-center">Loading city overview...</p>
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
        City Overview: Solved Reports
      </h1>
      {reports.length === 0 ? (
        <p className="text-center text-gray-600">No resolved reports found.</p>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-white shadow p-4 rounded border-l-4 border-green-600"
            >
              <h2 className="font-semibold text-xl mb-2">{report.title}</h2>
              <p className="text-gray-700 mb-1">{report.description}</p>
              <p className="text-gray-500 text-sm mb-1">
                Priority: <strong>{report.priority}</strong>
              </p>
              <p className="text-gray-500 text-sm mb-1">
                Location: {report.location}
              </p>
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

export default CityOverview;
