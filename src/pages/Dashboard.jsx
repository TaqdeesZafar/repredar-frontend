"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";

export default function ReportsDashboard() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate]);

  useEffect(() => {
    if (isLoggedIn) fetchReports();
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

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }

      const data = await response.json();
      setReports(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

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
    }
  };

  const s = {
    page: { minHeight: "100vh", background: "var(--bg-dark)", padding: "40px 24px" },
    inner: { maxWidth: 1100, margin: "0 auto" },
    heading: { fontSize: 28, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8, letterSpacing: "-0.03em" },
    sub: { fontSize: 14, color: "var(--text-muted)", marginBottom: 36 },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 },
    card: {
      background: "var(--card-bg)", border: "1px solid var(--card-border)",
      borderRadius: 16, padding: "22px 24px",
      boxShadow: "var(--shadow-card)",
    },
    cardName: { fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
    cardMeta: { fontSize: 13, color: "var(--text-muted)", marginBottom: 4 },
    dlBtn: {
      marginTop: 18, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      padding: "10px 0", background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
      color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
    },
    empty: { textAlign: "center", padding: "64px 24px", color: "var(--text-muted)", fontSize: 15 },
    spinWrap: { display: "flex", justifyContent: "center", paddingTop: 80 },
    spin: { width: 40, height: 40, border: "3px solid var(--border-subtle)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
    errBox: { background: "rgba(255,71,87,0.08)", border: "1px solid rgba(255,71,87,0.25)", color: "#FF4757", borderRadius: 12, padding: "16px 20px", fontSize: 14 },
    retryBtn: { marginTop: 16, padding: "9px 20px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" },
  };

  return (
    <div style={s.page}>
      <div style={s.inner}>
        <h1 style={s.heading}>Your Reports</h1>
        <p style={s.sub}>{reports.length} report{reports.length !== 1 ? "s" : ""} generated</p>

        {isLoading ? (
          <div style={s.spinWrap}>
            <div style={s.spin} />
          </div>
        ) : error ? (
          <div style={s.errBox}>
            {error}
            <br />
            <button style={s.retryBtn} onClick={fetchReports}>Try Again</button>
          </div>
        ) : reports.length === 0 ? (
          <div style={s.empty}>
            No reports yet. Generate your first reputation report from the home page.
          </div>
        ) : (
          <div style={s.grid}>
            {reports.map((report) => (
              <div key={report._id} style={s.card}>
                <div style={s.cardName} title={report.name}>{report.name}</div>
                <div style={s.cardMeta}>{report.platform}</div>
                <div style={s.cardMeta}>{moment(report.createdAt).format("MMM D, YYYY · h:mm A")}</div>
                <button style={s.dlBtn} onClick={() => downloadReport(report._id)}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Download PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
