import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ReportDownload() {
  const { token } = useParams();
  const [failed, setFailed] = useState(false);

  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}/report/public/${token}`;

  useEffect(() => {
    if (token) {
      // Redirect to the backend, which serves the PDF inline so mobile
      // browsers open it in their built-in PDF viewer.
      window.location.href = backendUrl;
      // If nothing happened after a few seconds, show a manual fallback link.
      const t = setTimeout(() => setFailed(true), 6000);
      return () => clearTimeout(t);
    }
    setFailed(true);
  }, [token]);

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg-page)", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 18, padding: "24px", textAlign: "center",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {!failed ? (
        <>
          <div style={{
            width: 44, height: 44, border: "3px solid var(--border)",
            borderTopColor: "var(--accent)", borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }} />
          <p style={{ color: "var(--text-2)", fontSize: 15, margin: 0 }}>Opening your report…</p>
        </>
      ) : (
        <>
          <div style={{
            width: 52, height: 52, borderRadius: 14, background: "var(--accent-dim)",
            border: "1px solid var(--accent-border)", display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 26,
          }}>📄</div>
          <p style={{ color: "var(--text-1)", fontSize: 16, fontWeight: 700, margin: 0 }}>
            Your report is ready
          </p>
          <p style={{ color: "var(--text-2)", fontSize: 14, margin: 0, maxWidth: 320, lineHeight: 1.5 }}>
            If your report didn't open automatically, tap the button below.
          </p>
          <a
            href={backendUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginTop: 4, padding: "14px 28px", borderRadius: 12,
              background: "var(--accent)", color: "#fff", fontWeight: 700,
              fontSize: 15, textDecoration: "none", display: "inline-flex",
              alignItems: "center", gap: 9, boxShadow: "var(--shadow-btn)",
            }}
          >
            Open Report
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
          </a>
        </>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
