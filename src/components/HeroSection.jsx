import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ─── Platform definitions ─────────────────────────────────────────────────────
const PLATFORMS = [
  { id:"twitter",   label:"X",         bg:"#000" },
  { id:"instagram", label:"Instagram",  bg:"linear-gradient(135deg,#833AB4,#C13584,#F56040)" },
  { id:"tiktok",    label:"TikTok",     bg:"#000" },
  { id:"facebook",  label:"Facebook",   bg:"#1877F2" },
  { id:"linkedin",  label:"LinkedIn",   bg:"#0A66C2" },
  { id:"google",    label:"Google",     bg:"#fff",  textDark:true },
];

function PlatformSVG({ id, size = 16 }) {
  const s = { width: size, height: size };
  if (id === "twitter") return <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
  if (id === "instagram") return <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162S8.597 18.163 12 18.163s6.162-2.759 6.162-6.162S15.403 5.838 12 5.838zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
  if (id === "tiktok") return <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>;
  if (id === "facebook") return <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
  if (id === "linkedin") return <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
  if (id === "google") return <svg style={s} viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>;
  return null;
}

// ─── The hero search form (all original logic preserved) ──────────────────────
function HeroSearchForm() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [username,        setUsername]      = useState("");
  const [mode,            setMode]          = useState("company");
  const [activePlatforms, setActive]        = useState(new Set(PLATFORMS.map(p => p.id)));
  const [location,        setLocation]      = useState("");
  const [showAdvanced,    setShowAdv]       = useState(false);
  const [perPlatform,     setPerPlatform]   = useState({});
  const [placeholderIdx,  setPlaceholderIdx] = useState(0);

  const placeholders = ["Try 'Elon Musk'", "Try 'Nike'", "Try 'your business name'", "Try 'Tesla'"];
  useEffect(() => {
    const i = setInterval(() => setPlaceholderIdx(p => (p + 1) % placeholders.length), 2400);
    return () => clearInterval(i);
  }, []);

  const googleActive = activePlatforms.has("google");

  const togglePlatform = (id) => {
    setActive(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === "person") {
      setActive(prev => { const n = new Set(prev); n.delete("google"); return n; });
    } else {
      setActive(prev => new Set([...prev, "google"]));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || activePlatforms.size === 0) return;
    const handles = {};
    for (const p of activePlatforms) {
      handles[p] = (perPlatform[p]?.trim()) || username.trim();
    }
    navigate("/search", { state: { username: username.trim(), mode, platforms: [...activePlatforms], handles, googleLocation: location.trim() } });
  };

  const pill = (active) => ({
    display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px",
    borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid",
    background: active ? "var(--accent-dim)" : "var(--bg-elevated)",
    borderColor: active ? "var(--accent-border)" : "var(--border)",
    color: active ? "var(--accent)" : "var(--text-2)",
    fontFamily: "inherit",
  });

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Name input */}
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder={placeholders[placeholderIdx]}
          style={{
            width: "100%", padding: "14px 44px", borderRadius: 14,
            background: "var(--bg-elevated)", border: "1px solid var(--border)",
            color: "var(--text-1)", fontSize: 15, outline: "none",
            boxSizing: "border-box", fontFamily: "inherit",
          }}
          onFocus={e => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "0 0 0 3px var(--accent-dim)"; }}
          onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
        />
        {username && (
          <button type="button" onClick={() => setUsername("")}
            style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        )}
      </div>

      {/* Account type toggle */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          { id: "company", emoji: "🏢", label: "Business / Brand" },
          { id: "person",  emoji: "👤", label: "Person / Influencer" },
        ].map(opt => (
          <button key={opt.id} type="button" onClick={() => handleModeChange(opt.id)}
            style={{
              padding: "10px 12px", borderRadius: 12, fontSize: 13, fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              cursor: "pointer", border: "1px solid",
              background: mode === opt.id ? "var(--accent-dim)" : "var(--bg-elevated)",
              borderColor: mode === opt.id ? "var(--accent-border)" : "var(--border)",
              color: mode === opt.id ? "var(--accent)" : "var(--text-2)",
              fontFamily: "inherit",
            }}>
            <span>{opt.emoji}</span>{opt.label}
          </button>
        ))}
      </div>

      {/* Platform chips */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8, marginTop: 0 }}>
          Platforms to scan
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {PLATFORMS.map(p => {
            const active = activePlatforms.has(p.id);
            return (
              <button key={p.id} type="button" onClick={() => togglePlatform(p.id)}
                style={{ ...pill(active), position: "relative" }}>
                <span style={{ color: active && p.id !== "google" ? "var(--accent)" : "inherit" }}>
                  <PlatformSVG id={p.id} size={13} />
                </span>
                {p.label}
                {active && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M5 12l5 5L20 7"/></svg>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Google location */}
      {googleActive && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12,
          background: "var(--green-dim)", border: "1px solid rgba(52,211,153,0.25)",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2">
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <input
            type="text" value={location} onChange={e => setLocation(e.target.value)}
            placeholder="City or location for Google Business (e.g. New York)"
            style={{ flex: 1, background: "transparent", border: "none", color: "var(--text-2)", fontSize: 13, outline: "none", fontFamily: "inherit" }}
          />
        </div>
      )}

      {/* Per-platform usernames */}
      <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
        <button type="button" onClick={() => setShowAdv(v => !v)}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 14px",
            background: "var(--bg-elevated)", cursor: "pointer", border: "none", color: "inherit", textAlign: "left", fontFamily: "inherit",
          }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", margin: 0 }}>Different username on some platforms?</p>
            <p style={{ fontSize: 11, color: "var(--text-3)", margin: 0 }}>e.g. @nike on Instagram but Nike Inc on LinkedIn</p>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2"
            style={{ transform: showAdvanced ? "rotate(180deg)" : "none" }}>
            <path d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        {showAdvanced && (
          <div style={{ padding: "12px 14px", background: "var(--bg-surface)", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ fontSize: 11, color: "var(--text-3)", margin: 0 }}>Leave blank to use the name above.</p>
            {[...activePlatforms].filter(id => id !== "google").map(id => {
              const pl = PLATFORMS.find(p => p.id === id);
              return (
                <div key={id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: pl?.bg || "#000", display: "flex", alignItems: "center", justifyContent: "center", color: pl?.textDark ? "#000" : "#fff", flexShrink: 0 }}>
                    <PlatformSVG id={id} size={12} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-3)", width: 72, flexShrink: 0 }}>{pl?.label}</span>
                  <input
                    type="text"
                    value={perPlatform[id] || ""}
                    onChange={e => setPerPlatform(prev => ({ ...prev, [id]: e.target.value }))}
                    placeholder={username || "username or @handle"}
                    style={{
                      flex: 1, padding: "7px 10px", borderRadius: 9, fontSize: 12,
                      background: "var(--bg-elevated)", border: "1px solid var(--border)",
                      color: "var(--text-1)", outline: "none", fontFamily: "inherit",
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!username.trim() || activePlatforms.size === 0}
        style={{
          width: "100%", padding: "15px 22px", borderRadius: 14, fontSize: 15, fontWeight: 700,
          background: "linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)",
          color: "#050911", border: "none",
          cursor: (!username.trim() || activePlatforms.size === 0) ? "not-allowed" : "pointer",
          opacity: (!username.trim() || activePlatforms.size === 0) ? 0.4 : 1,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
          boxShadow: "var(--shadow-btn)",
          fontFamily: "inherit",
        }}>
        Find Accounts & Check Reputation
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
      </button>
    </form>
  );
}

// ─── Section 2: Social proof strip ───────────────────────────────────────────
function StatsStrip() {
  return (
    <section style={{
      background: "var(--bg-surface)",
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)",
      padding: "28px 24px",
    }}>
      <style>{`
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
      <div
        className="stats-grid"
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24,
          textAlign: "center",
        }}
      >
        {[
          { v: "50K+",  l: "Reports Generated" },
          { v: "6",     l: "Platforms" },
          { v: "< 60s", l: "Generation Time" },
          { v: "100%",  l: "Free" },
        ].map(s => (
          <div key={s.l}>
            <p style={{ fontSize: 28, fontWeight: 800, color: "var(--accent)", margin: 0, fontFamily: "monospace" }}>{s.v}</p>
            <p style={{ fontSize: 12, color: "var(--text-3)", margin: "4px 0 0", fontWeight: 500 }}>{s.l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Section 3: How it works ─────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: "01", title: "Enter a name", body: "Type any business, brand, or person. Select the platforms you want scanned." },
    { n: "02", title: "Confirm profiles", body: "AI picks the best match on each platform — swap if wrong." },
    { n: "03", title: "Get your report", body: "AI analyses sentiment, scores competitors, builds a full PDF." },
  ];
  return (
    <section style={{ background: "var(--bg-page)", padding: "100px 24px" }}>
      <style>{`
        @media (max-width: 640px) {
          .how-grid { grid-template-columns: 1fr !important; }
          .how-card-mid { transform: none !important; }
        }
      `}</style>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 12px" }}>
            HOW IT WORKS
          </p>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.02em", margin: 0 }}>
            From name to report in 60 seconds
          </h2>
        </div>
        <div
          className="how-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}
        >
          {steps.map((s, i) => (
            <div
              key={s.n}
              className={i === 1 ? "how-card-mid" : ""}
              style={{
                padding: 28, borderRadius: 16,
                background: "var(--bg-surface)", border: "1px solid var(--border)",
                position: "relative", overflow: "hidden",
                transform: i === 1 ? "translateY(24px)" : "none",
              }}
            >
              <div style={{
                position: "absolute", top: 12, right: 16,
                fontSize: 56, fontWeight: 800, color: "var(--accent)",
                fontFamily: "monospace", opacity: 0.10, lineHeight: 1,
                userSelect: "none", pointerEvents: "none",
              }}>
                {s.n}
              </div>
              <div style={{ marginBottom: 16, position: "relative" }}>
                <span style={{
                  fontSize: 56, fontWeight: 800, fontFamily: "monospace",
                  color: "var(--accent)", opacity: 0.15, lineHeight: 1, display: "block",
                }}>
                  {s.n}
                </span>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-1)", marginBottom: 8, marginTop: 0 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.65, margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 4: What's in the report ─────────────────────────────────────────
function ReportFeatures() {
  const features = [
    { icon: "📊", title: "Reputation Score", body: "AI score 1-10 based on real social signals across every platform." },
    { icon: "🧠", title: "Sentiment Analysis", body: "Positive/neutral/negative breakdown of how people talk about you." },
    { icon: "📈", title: "12-Month Trends", body: "How your reputation moved over the past year — with charts." },
    { icon: "🏆", title: "Competitor Benchmarking", body: "How you compare to top competitors in your space." },
    { icon: "🗺️", title: "30/60/90-Day Action Plan", body: "Concrete steps to protect and grow your reputation." },
    { icon: "📄", title: "Full PDF Report", body: "Instant download, shareable, yours to keep. No account needed." },
  ];

  return (
    <section style={{
      background: "var(--bg-surface)",
      borderTop: "1px solid var(--border)",
      padding: "80px 24px",
    }}>
      <style>{`
        @media (max-width: 640px) {
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "var(--text-1)", marginBottom: 12, marginTop: 0 }}>
            Everything in your free report
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-2)", margin: 0 }}>
            No upsells. No paywalls. The full analysis, free.
          </p>
        </div>
        <div
          className="features-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                display: "flex",
                gap: 16,
                padding: "20px 22px",
                borderRadius: 16,
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "var(--accent-dim)", border: "1px solid var(--accent-border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, flexShrink: 0,
              }}>
                {f.icon}
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-1)", margin: "0 0 4px" }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "var(--text-2)", margin: 0, lineHeight: 1.55 }}>{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 5: Final CTA ─────────────────────────────────────────────────────
function FinalCTA() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <section style={{ background: "var(--bg-page)", padding: "100px 24px", textAlign: "center" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h2 style={{ fontSize: 40, fontWeight: 800, color: "var(--text-1)", marginBottom: 12, marginTop: 0, letterSpacing: "-0.03em" }}>
          Ready to see your reputation?
        </h2>
        <p style={{ fontSize: 16, color: "var(--text-2)", marginBottom: 36 }}>
          It takes 30 seconds. No account needed.
        </p>
        <button
          onClick={handleScrollToTop}
          style={{
            background: "var(--accent)",
            color: "#050911",
            padding: "18px 48px",
            borderRadius: 14,
            fontSize: 16,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            boxShadow: "var(--shadow-btn)",
            fontFamily: "inherit",
          }}
          onMouseOver={e => e.currentTarget.style.opacity = "0.9"}
          onMouseOut={e => e.currentTarget.style.opacity = "1"}
        >
          Check Your Reputation — Free →
        </button>
      </div>
    </section>
  );
}

// ─── Main Hero export ─────────────────────────────────────────────────────────
const Hero = () => {
  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-right { display: none !important; }
          .hero-section { padding: 60px 20px 48px !important; min-height: auto !important; }
          .hero-headline { font-size: clamp(36px, 10vw, 52px) !important; }
        }
      `}</style>

      {/* ── Section 1: Hero ── */}
      <section
        className="hero-section"
        style={{
          minHeight: "100vh",
          background: "var(--bg-page)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "72px 24px 60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radial glow */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(56,189,248,0.08), transparent 70%)",
        }}/>
        {/* Fine grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          opacity: 0.6,
        }}/>

        <div
          className="hero-grid"
          style={{
            position: "relative", zIndex: 2, width: "100%", maxWidth: 1100,
            display: "grid", gridTemplateColumns: "1.15fr 0.85fr",
            gap: 60, alignItems: "center",
          }}
        >
          {/* LEFT */}
          <div>
            {/* Top badge */}
            <div style={{ marginBottom: 24 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "6px 14px", borderRadius: 999,
                fontSize: 10, fontWeight: 700,
                background: "var(--accent-dim)", border: "1px solid var(--accent-border)", color: "var(--accent)",
                letterSpacing: "0.12em",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 8px var(--accent)", display: "inline-block" }}/>
                AI-POWERED · REPUTATION INTELLIGENCE
              </span>
            </div>

            {/* Headline */}
            <h1
              className="hero-headline"
              style={{
                fontSize: "clamp(44px, 5.5vw, 72px)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
                marginBottom: 20,
                marginTop: 0,
              }}
            >
              <span style={{ color: "var(--text-1)", display: "block" }}>See what the internet</span>
              <span
                style={{
                  backgroundImage: "linear-gradient(135deg, #38BDF8, #818CF8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  display: "inline-block",
                  transition: "none",
                }}
              >
                says about anyone.
              </span>
            </h1>

            {/* Subheadline */}
            <p style={{ fontSize: 17, color: "var(--text-2)", lineHeight: 1.6, marginBottom: 32, maxWidth: 480, marginTop: 0 }}>
              Scan X, Instagram, TikTok, Facebook, LinkedIn & Google in seconds. Get an AI reputation score, competitor analysis, and a full PDF report — free.
            </p>

            {/* Search card */}
            <div style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: 20,
              padding: 28,
              boxShadow: "var(--shadow-glow)",
            }}>
              <HeroSearchForm />
            </div>

            {/* Trust signals */}
            <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              {[
                "No signup required",
                "6 platforms",
                "Results in 60s",
              ].map(t => (
                <span key={t} style={{ fontSize: 12, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block", flexShrink: 0 }}/>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT — decorative visual */}
          <div
            className="hero-right"
            style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}
          >
            {/* Outer glow */}
            <div style={{
              position: "absolute", inset: -60,
              background: "radial-gradient(circle, rgba(56,189,248,0.08), transparent 70%)",
              pointerEvents: "none",
            }}/>

            {/* Radar circle */}
            <div style={{
              width: 320, height: 320, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(56,189,248,0.04) 0%, transparent 70%), var(--bg-surface)",
              border: "1px solid var(--accent-border)",
              position: "relative", overflow: "hidden", flexShrink: 0,
            }}>
              {/* Rings */}
              {[0.3, 0.55, 0.78].map((r, i) => (
                <div key={i} style={{
                  position: "absolute", borderRadius: "50%",
                  border: "1px solid var(--accent-border)",
                  width: `${r * 100}%`, height: `${r * 100}%`,
                  top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                  opacity: 0.5,
                }}/>
              ))}
              {/* Cross */}
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "var(--border)", transform: "translateX(-50%)" }}/>
                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "var(--border)", transform: "translateY(-50%)" }}/>
              </div>
              {/* Sweep */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "conic-gradient(from 0deg, transparent 0deg, transparent 280deg, rgba(56,189,248,0) 280deg, rgba(56,189,248,0.45) 355deg, rgba(56,189,248,0.9) 360deg)",
                animation: "radar-sweep 3.5s linear infinite",
              }}/>
              {/* Blips */}
              {[
                { x: 38, y: 30 }, { x: 62, y: 55 }, { x: 25, y: 65 },
                { x: 70, y: 25 }, { x: 45, y: 75 }, { x: 80, y: 60 },
              ].map((d, i) => (
                <div key={i} style={{
                  position: "absolute", left: `${d.x}%`, top: `${d.y}%`,
                  width: 5, height: 5, borderRadius: "50%",
                  background: "var(--accent)", boxShadow: "0 0 8px var(--accent)",
                  transform: "translate(-50%,-50%)", opacity: 0.85,
                }}/>
              ))}
            </div>

            {/* Live scan chip */}
            <div style={{
              position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
              padding: "5px 12px", borderRadius: 999, fontSize: 10, fontWeight: 700,
              background: "var(--bg-elevated)", border: "1px solid var(--accent-border)",
              color: "var(--accent)", display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", animation: "pulse-dot 1.2s ease-in-out infinite" }}/>
              LIVE · SCANNING
            </div>

            {/* Floating stat card */}
            <div style={{
              position: "absolute", bottom: -24, right: -24,
              padding: 14, borderRadius: 14, minWidth: 180,
              background: "var(--bg-surface)", border: "1px solid var(--border)",
              animation: "float 3s ease-in-out infinite",
              boxShadow: "var(--shadow-md)",
            }}>
              <div style={{ fontSize: 9, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 5 }}>Live signal</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: "var(--text-1)", fontFamily: "monospace" }}>+128</span>
                <span style={{ fontSize: 11, color: "var(--green)" }}>↑ 24% sentiment</span>
              </div>
              <div style={{ marginTop: 8, display: "flex", gap: 3 }}>
                {[3, 6, 4, 8, 5, 9, 7, 11, 9, 12].map((h, i) => (
                  <div key={i} style={{ width: 5, height: h * 2, background: "var(--accent)", opacity: 0.3 + i * 0.06, borderRadius: 2 }}/>
                ))}
              </div>
            </div>

            {/* Platform icons card */}
            <div style={{
              position: "absolute", top: 16, left: -40, padding: 12, borderRadius: 12,
              background: "var(--bg-surface)", border: "1px solid var(--border)",
              display: "flex", flexDirection: "column", gap: 6,
              boxShadow: "var(--shadow-md)",
            }}>
              {PLATFORMS.slice(0, 3).map(p => (
                <div key={p.id} style={{ width: 22, height: 22, borderRadius: 6, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", color: p.textDark ? "#000" : "#fff" }}>
                  <PlatformSVG id={p.id} size={11} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Social proof ── */}
      <StatsStrip />

      {/* ── Section 3: How it works ── */}
      <HowItWorks />

      {/* ── Section 4: What's in the report ── */}
      <ReportFeatures />

      {/* ── Section 5: Final CTA ── */}
      <FinalCTA />
    </>
  );
};

export default Hero;
