import React, { useEffect, useState } from "react";
import UserFooter from "../components/UserFooter";

const CityOverview = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResolvedReports = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/resolved-reports/onlyresolved");
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
              <h2 className="text-md font-semibold mb-1 text-gray-700">
                Reported by:{" "}
                {report.user?.username  ? report.user.username  : "Anonymous"}
              </h2>
              <h3 className="font-semibold text-xl mb-2">{report.title}</h3>
              <p className="text-gray-700 mb-1">{report.description}</p>
              <p className="text-gray-500 text-sm mb-1">
                Priority: <strong>{report.priority}</strong>
              </p>
              <p className="text-gray-500 text-sm mb-1">Location: {report.location}</p>

              {/* Before and After Images */}
              <div className="flex flex-wrap gap-6 mt-3 items-center">
                <div className="flex flex-col items-center">
                  <span className="mb-1 font-semibold text-gray-700">Before Image</span>
                  {report.imageUrl ? (
                    <img
                      src={`http://localhost:5000${report.imageUrl}`}
                      alt="User uploaded"
                      className="max-w-xs rounded border"
                    />
                  ) : (
                    <span className="text-gray-400 italic">No user image available</span>
                  )}
                </div>

                <div className="flex flex-col items-center">
                  <span className="mb-1 font-semibold text-gray-700">After Image</span>
                  {report.adminImageUrl ? (
                    <img
                      src={
                        report.adminImageUrl.startsWith("http")
                          ? report.adminImageUrl
                          : `http://localhost:5000${report.adminImageUrl}`
                      }
                      alt="Admin uploaded"
                      className="max-w-xs rounded border"
                    />
                  ) : (
                    <span className="text-gray-400 italic">No image available</span>
                  )}
                </div>
              </div>

              {/* Admin Remarks */}
              <p className="mt-4 text-gray-700">
                <span className="font-semibold">Admin Remarks: </span>
                {report.adminRemarks ? (
                  <span>{report.adminRemarks}</span>
                ) : (
                  <span className="italic text-gray-400">No remarks added</span>
                )}
              </p>

              <p className="text-gray-400 text-xs mt-2">
                Created at: {new Date(report.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
      <UserFooter />
    </div>
  );
};

export default CityOverview;
