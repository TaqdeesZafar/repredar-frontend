import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ReportDownload() {
  const { token } = useParams();

  useEffect(() => {
    if (token) {
      window.location.href = `${import.meta.env.VITE_BACKEND_URL}/report/public/${token}`;
    }
  }, [token]);

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg-dark)", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
    }}>
      <div style={{
        width: 44, height: 44, border: "3px solid var(--border-subtle)",
        borderTopColor: "var(--accent)", borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <p style={{ color: "var(--text-muted)", fontSize: 15 }}>Preparing your report download…</p>
    </div>
  );
}
