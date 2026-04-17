"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";

export default function ReportsDashboard() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  // const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchReports();
    }
  }, [isLoggedIn]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/report/my-reports`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );


      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }

      const data = await response.json();
      setReports(data);
      setError(null);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/report/download/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to download report");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;

      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "report.pdf";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match?.[1]) filename = match[1];
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error downloading report:", err);
      alert("Failed to download report");
    }
  };

  const filteredReports =
    activeTab === "all"
      ? reports
      : reports.filter((report) => report.type === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 🔁 Conditional Main Content */}
      <main className="flex-1 max-w-7xl mx-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center text-center">
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded relative max-w-xl w-full"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={fetchReports}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Go Back
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Your Reports
            </h2>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              {["all", "free", "paid"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-4 font-medium capitalize ${
                    activeTab === tab
                      ? "text-blue-600 border-b-2 border-blue-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "all" ? "All Reports" : tab}
                </button>
              ))}
            </div>

            {/* Report Cards */}
            {filteredReports.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">No reports found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) => (
                  <div
                    key={report._id}
                    className="bg-white rounded-lg shadow overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2 truncate">
                          {report.name}
                        </h2>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            report.type === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {report.type}
                        </span>
                      </div>
                      <p className="text-gray-500 mb-4">
                        Platform: {report.platform}
                      </p>
                      <p className="text-gray-500 mb-4">
                        Created:{" "}
                        {moment(report.createdAt).format("MMM D, YYYY")}
                      </p>
                      <button
                        onClick={() => downloadReport(report._id)}
                        className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Download PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
