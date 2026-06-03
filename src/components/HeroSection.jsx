import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PLATFORMS = [
  { id:"twitter",   label:"X",         bg:"#000",                                             tc:"#fff" },
  { id:"instagram", label:"Instagram",  bg:"linear-gradient(135deg,#833AB4,#C13584,#F56040)", tc:"#fff" },
  { id:"tiktok",    label:"TikTok",     bg:"#010101",                                          tc:"#fff" },
  { id:"facebook",  label:"Facebook",   bg:"#1877F2",                                          tc:"#fff" },
  { id:"linkedin",  label:"LinkedIn",   bg:"#0A66C2",                                          tc:"#fff" },
  { id:"google",    label:"Google",     bg:"#fff",                                             tc:"#444", border:"rgba(15,23,42,0.15)" },
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

// ─── Hero Search Form ─────────────────────────────────────────────────────────
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

  const [blockedError, setBlockedError] = useState("");

  const BLOCKED_TERMS = [
    "john ellis", "john s ellis", "john spencer ellis",
    "dr john spencer ellis", "dr john ellis",
    "johnellis", "johnspencerellis", "drjohnspencerellis",
    "jspencerellis", "johnsellis",
    "reputation return", "reputationreturn", "reputation-return",
  ];

  function isBlocked(q) {
    const norm = q.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
    return BLOCKED_TERMS.some(t => {
      const tn = t.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
      return norm === tn || norm.includes(tn);
    });
  }

  const placeholders = ["Try 'Elon Musk'", "Try 'Nike'", "Try 'your business name'", "Try 'Tesla'"];
  useEffect(() => {
    const i = setInterval(() => setPlaceholderIdx(p => (p + 1) % placeholders.length), 2600);
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
    if (isBlocked(username.trim())) {
      setBlockedError("This query cannot be processed.");
      return;
    }
    setBlockedError("");
    const handles = {};
    for (const p of activePlatforms) {
      handles[p] = (perPlatform[p]?.trim()) || username.trim();
    }
    navigate("/search", { state: { username: username.trim(), mode, platforms: [...activePlatforms], handles, googleLocation: location.trim() } });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* Name input */}
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={username}
          onChange={e => { setUsername(e.target.value); setBlockedError(""); }}
          placeholder={placeholders[placeholderIdx]}
          style={{
            width: "100%", padding: "13px 40px 13px 40px", borderRadius: 10,
            background: "var(--bg-page)", border: "1.5px solid var(--border)",
            color: "var(--text-1)", fontSize: 15, outline: "none",
            boxSizing: "border-box", fontFamily: "inherit",
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}
          onFocus={e => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
          onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
        />
        {username && (
          <button type="button" onClick={() => setUsername("")}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        )}
      </div>

      {/* Blocked search error */}
      {blockedError && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 14px", borderRadius: 10,
          background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span style={{ fontSize: 13, color: "#DC2626", fontWeight: 500 }}>{blockedError}</span>
        </div>
      )}

      {/* Account type */}
      <div className="acc-type-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          { id: "company", icon: "🏢", label: "Business / Brand" },
          { id: "person",  icon: "👤", label: "Person / Influencer" },
        ].map(opt => (
          <button key={opt.id} type="button" onClick={() => handleModeChange(opt.id)}
            style={{
              padding: "9px 10px", borderRadius: 9, fontSize: 13, fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              cursor: "pointer", border: "1.5px solid",
              background: mode === opt.id ? "var(--accent-dim)" : "var(--bg-surface)",
              borderColor: mode === opt.id ? "var(--accent)" : "var(--border)",
              color: mode === opt.id ? "var(--accent)" : "var(--text-2)",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}>
            <span>{opt.icon}</span>{opt.label}
          </button>
        ))}
      </div>

      {/* Platform chips */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8, marginTop: 0 }}>
          Platforms to scan
        </p>
        <div className="platform-chips" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {PLATFORMS.map(p => {
            const active = activePlatforms.has(p.id);
            return (
              <button key={p.id} type="button" onClick={() => togglePlatform(p.id)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "5px 11px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                  cursor: "pointer", border: "1.5px solid",
                  background: active ? "var(--accent-dim)" : "var(--bg-surface)",
                  borderColor: active ? "var(--accent)" : "var(--border)",
                  color: active ? "var(--accent)" : "var(--text-2)",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                }}>
                <PlatformSVG id={p.id} size={12} />
                {p.label}
                {active && (
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M5 12l5 5L20 7"/></svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Google location */}
      {googleActive && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 9,
          background: "rgba(5,150,105,0.06)", border: "1.5px solid rgba(5,150,105,0.2)",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2">
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

      {/* Per-platform usernames accordion */}
      <div style={{ border: "1.5px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
        <button type="button" onClick={() => setShowAdv(v => !v)}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
            background: "var(--bg-elevated)", cursor: "pointer", border: "none", color: "inherit", textAlign: "left", fontFamily: "inherit",
            transition: "background 0.12s",
          }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", margin: 0 }}>Different username on some platforms?</p>
            <p style={{ fontSize: 11, color: "var(--text-3)", margin: 0 }}>e.g. @nike on Instagram but Nike Inc on LinkedIn</p>
          </div>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2.5"
            style={{ transition: "transform 0.2s", transform: showAdvanced ? "rotate(180deg)" : "none" }}>
            <path d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        {showAdvanced && (
          <div style={{ padding: "12px", background: "var(--bg-surface)", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ fontSize: 11, color: "var(--text-3)", margin: 0 }}>Leave blank to use the name above.</p>
            {[...activePlatforms].filter(id => id !== "google").map(id => {
              const pl = PLATFORMS.find(p => p.id === id);
              return (
                <div key={id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: pl?.bg || "#000", display: "flex", alignItems: "center", justifyContent: "center", color: pl?.tc || "#fff", flexShrink: 0, border: pl?.border || "none" }}>
                    <PlatformSVG id={id} size={12} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-3)", width: 72, flexShrink: 0 }}>{pl?.label}</span>
                  <input
                    type="text"
                    value={perPlatform[id] || ""}
                    onChange={e => setPerPlatform(prev => ({ ...prev, [id]: e.target.value }))}
                    placeholder={username || "username or @handle"}
                    style={{
                      flex: 1, padding: "7px 10px", borderRadius: 8, fontSize: 12,
                      background: "var(--bg-elevated)", border: "1.5px solid var(--border)",
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
          width: "100%", padding: "14px 22px", borderRadius: 10, fontSize: 15, fontWeight: 700,
          background: (!username.trim() || activePlatforms.size === 0) ? "#94A3B8" : "var(--accent)",
          color: "#fff", border: "none",
          cursor: (!username.trim() || activePlatforms.size === 0) ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
          boxShadow: (!username.trim() || activePlatforms.size === 0) ? "none" : "var(--shadow-btn)",
          fontFamily: "inherit",
          transition: "background 0.15s, box-shadow 0.15s, transform 0.1s",
        }}
        onMouseOver={e => { if (username.trim() && activePlatforms.size > 0) e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseOut={e => { e.currentTarget.style.transform = "none"; }}
      >
        Find Accounts & Check Reputation
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
      </button>
    </form>
  );
}

// ─── Stats strip ──────────────────────────────────────────────────────────────
function StatsStrip() {
  return (
    <section className="stats-section" style={{
      background: "var(--bg-surface)",
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)",
      padding: "32px 24px",
    }}>
      <div className="stats-grid" style={{ maxWidth: 860, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, textAlign: "center" }}>
        {[
          { v: "50K+",  l: "Reports Generated" },
          { v: "6",     l: "Platforms Scanned" },
          { v: "< 60s", l: "Generation Time" },
          { v: "100%",  l: "Free Forever" },
        ].map(s => (
          <div key={s.l}>
            <p style={{ fontSize: 26, fontWeight: 800, color: "var(--accent)", margin: 0, letterSpacing: "-0.03em" }}>{s.v}</p>
            <p style={{ fontSize: 12, color: "var(--text-3)", margin: "5px 0 0", fontWeight: 500 }}>{s.l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      n: "01",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
        </svg>
      ),
      title: "Enter a name",
      body: "Type any business, brand, or public figure. Select the platforms you want scanned.",
    },
    {
      n: "02",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
        </svg>
      ),
      title: "Confirm profiles",
      body: "AI picks the best match on each platform — swap it if wrong in one click.",
    },
    {
      n: "03",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ),
      title: "Get your report",
      body: "AI analyses sentiment, scores reputation, benchmarks competitors, builds a full PDF.",
    },
  ];
  return (
    <section className="how-section" style={{ background: "var(--bg-page)", padding: "96px 24px" }}>
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{
            display: "inline-block", padding: "4px 14px", borderRadius: 999,
            background: "var(--accent-dim)", border: "1px solid var(--accent-border)",
            color: "var(--accent)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", marginBottom: 16,
          }}>
            How it works
          </span>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.025em", margin: 0 }}>
            From name to report in 60 seconds
          </h2>
        </div>
        <div className="how-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {steps.map((s, i) => (
            <div
              key={s.n}
              className={i === 1 ? "how-card-mid" : ""}
              style={{
                padding: "28px 24px", borderRadius: 16,
                background: "var(--bg-surface)",
                border: i === 1 ? "2px solid var(--accent-border)" : "1px solid var(--border)",
                boxShadow: i === 1 ? "var(--shadow-glow)" : "var(--shadow-sm)",
                transform: i === 1 ? "translateY(-8px)" : "none",
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: i === 1 ? "var(--accent)" : "var(--accent-dim)",
                border: i === 1 ? "none" : "1px solid var(--accent-border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: i === 1 ? "#fff" : "var(--accent)",
                marginBottom: 20,
              }}>
                {s.icon}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", marginBottom: 8 }}>STEP {s.n}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-1)", marginBottom: 8, marginTop: 0 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.65, margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── What's in the report ─────────────────────────────────────────────────────
function ReportFeatures() {
  const features = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      ),
      title: "Reputation Score",
      body: "AI score 1–10 based on real social signals across every platform, updated live.",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
      ),
      title: "Sentiment Analysis",
      body: "Positive/neutral/negative breakdown of how the internet talks about you.",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
        </svg>
      ),
      title: "12-Month Trends",
      body: "How your reputation moved over the past year — peaks, dips, and inflection points.",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
        </svg>
      ),
      title: "Competitor Benchmarking",
      body: "See how you compare to your top competitors side-by-side.",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      title: "30/60/90-Day Action Plan",
      body: "Concrete steps to protect and improve your reputation, prioritised by impact.",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/>
        </svg>
      ),
      title: "Full PDF Report",
      body: "Instant download, shareable with your team or clients. No account needed.",
    },
  ];

  return (
    <section className="features-section" style={{
      background: "var(--bg-surface)",
      borderTop: "1px solid var(--border)",
      padding: "88px 24px",
    }}>
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "var(--text-1)", marginBottom: 12, marginTop: 0, letterSpacing: "-0.025em" }}>
            Everything in your free report
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-2)", margin: 0, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
            No upsells. No paywalls. Full AI analysis — completely free.
          </p>
        </div>
        <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                display: "flex", gap: 16, padding: "20px",
                borderRadius: 14, background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                transition: "box-shadow 0.15s, transform 0.15s",
              }}
              onMouseOver={e => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseOut={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: "var(--accent-dim)", border: "1px solid var(--accent-border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--accent)", flexShrink: 0,
              }}>
                {f.icon}
              </div>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", margin: "0 0 4px" }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "var(--text-2)", margin: 0, lineHeight: 1.55 }}>{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Social proof / trust bar ─────────────────────────────────────────────────
function TrustBar() {
  return (
    <section style={{ background: "var(--bg-page)", borderTop: "1px solid var(--border)", padding: "36px 24px" }}>
      <div className="trust-bar" style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 32 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Trusted by businesses across
        </span>
        {["Restaurants", "Real Estate", "E-Commerce", "Healthcare", "Hospitality", "Personal Brands"].map(label => (
          <span key={label} style={{
            fontSize: 13, fontWeight: 600, color: "var(--text-2)",
            padding: "4px 14px", borderRadius: 999,
            background: "var(--bg-surface)", border: "1px solid var(--border)",
          }}>
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}

// ─── Report preview — pixel-perfect CSS mockup of the actual PDF ──────────────
function ReportPreview() {
  return (
    <section className="preview-section" style={{ background: "var(--bg-page)", borderTop: "1px solid var(--border)", padding: "96px 24px", overflow: "hidden" }}>
      <div className="preview-grid" style={{
        maxWidth: 1000, margin: "0 auto",
        display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 56, alignItems: "center",
      }}>
        {/* LEFT — copy */}
        <div className="preview-copy">
          <span style={{
            display: "inline-block", padding: "4px 14px", borderRadius: 999,
            background: "var(--accent-dim)", border: "1px solid var(--accent-border)",
            color: "var(--accent)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", marginBottom: 16,
          }}>
            The Report
          </span>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.025em", margin: "0 0 16px", lineHeight: 1.15 }}>
            A boardroom-ready PDF, generated in seconds
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-2)", lineHeight: 1.65, margin: "0 0 24px" }}>
            Every report is a polished, multi-page PDF you can download, share with your team, or send to a client — no design work needed.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "Reputation score & letter grade on the cover",
              "Sentiment breakdown with live charts",
              "Web & search intelligence + competitor benchmarks",
              "30/60/90-day action plan",
            ].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{
                  width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                  background: "var(--accent-dim)", border: "1px solid var(--accent-border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3"><path d="M5 12l5 5L20 7"/></svg>
                </span>
                <span style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.5 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — fanned report pages mockup */}
        <div className="preview-visual" style={{ position: "relative", height: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* glow */}
          <div style={{ position: "absolute", inset: -40, background: "radial-gradient(circle, rgba(37,99,235,0.10), transparent 70%)", pointerEvents: "none" }}/>

          {/* Back page (peeking) */}
          <div style={{
            position: "absolute", width: 260, height: 360, borderRadius: 12,
            background: "var(--bg-surface)", border: "1px solid var(--border)",
            boxShadow: "0 12px 40px rgba(15,23,42,0.10)",
            transform: "rotate(-7deg) translateX(-44px)",
          }}>
            <div style={{ height: 90, borderRadius: "12px 12px 0 0", background: "linear-gradient(135deg, #0F1F3D, #1a3a6e)" }}/>
            <div style={{ padding: 18 }}>
              {[80, 60, 70, 50].map((w, i) => (
                <div key={i} style={{ height: 7, width: `${w}%`, borderRadius: 4, background: "var(--bg-elevated)", marginBottom: 10 }}/>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <div style={{ flex: 1, height: 48, borderRadius: 8, background: "var(--bg-elevated)" }}/>
                <div style={{ flex: 1, height: 48, borderRadius: 8, background: "var(--bg-elevated)" }}/>
              </div>
            </div>
          </div>

          {/* Front page — the cover */}
          <div style={{
            position: "absolute", width: 270, height: 374, borderRadius: 14, overflow: "hidden",
            background: "var(--bg-surface)", border: "1px solid var(--border)",
            boxShadow: "0 24px 70px rgba(15,23,42,0.20)",
            transform: "rotate(4deg) translateX(34px)",
          }}>
            {/* Cover header */}
            <div style={{ background: "linear-gradient(135deg, #0F1F3D 0%, #1a3a6e 100%)", padding: "20px 18px 24px", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 18 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#38BDF8" }}/>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: "-0.3px" }}>RepRadar</span>
              </div>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#38BDF8", letterSpacing: "1.5px", marginBottom: 6 }}>REPUTATION REPORT</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>Your Online<br/><span style={{ color: "#38BDF8" }}>Reputation</span><br/>Decoded.</div>
              {/* gauge */}
              <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ position: "relative", width: 70, height: 40 }}>
                  <svg width="70" height="40" viewBox="0 0 70 40">
                    <path d="M 8 38 A 27 27 0 0 1 62 38" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="6" strokeLinecap="round"/>
                    <path d="M 8 38 A 27 27 0 0 1 52 14" fill="none" stroke="#10B981" strokeWidth="6" strokeLinecap="round"/>
                  </svg>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, textAlign: "center", fontSize: 13, fontWeight: 900, color: "#10B981" }}>8.4</div>
                </div>
                <div>
                  <div style={{ fontSize: 8, color: "#94A3B8", letterSpacing: "1px" }}>GRADE</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#10B981" }}>A</div>
                </div>
              </div>
            </div>
            {/* Cover body */}
            <div style={{ padding: 16 }}>
              <div style={{ display: "flex", gap: 7, marginBottom: 14 }}>
                <span style={{ fontSize: 8, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: "var(--accent-dim)", color: "var(--accent)" }}>INSTAGRAM</span>
                <span style={{ fontSize: 8, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: "rgba(124,58,237,0.1)", color: "#7C3AED" }}>BUSINESS</span>
              </div>
              {[90, 75, 82].map((w, i) => (
                <div key={i} style={{ height: 6, width: `${w}%`, borderRadius: 4, background: "var(--bg-elevated)", marginBottom: 8 }}/>
              ))}
              <div style={{ marginTop: 14, padding: 10, borderRadius: 8, background: "var(--bg-elevated)", display: "flex", gap: 8 }}>
                {["#10B981", "#F59E0B", "#EF4444"].map(c => (
                  <div key={c} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: c, margin: "0 auto 5px", opacity: 0.85 }}/>
                    <div style={{ height: 5, width: "70%", borderRadius: 3, background: "var(--border)", margin: "0 auto" }}/>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating "PDF" pill */}
          <div style={{
            position: "absolute", top: 24, right: 0, zIndex: 5,
            padding: "8px 14px", borderRadius: 10, background: "var(--accent)",
            boxShadow: "0 6px 20px rgba(37,99,235,0.35)",
            display: "flex", alignItems: "center", gap: 7,
            animation: "float 3.5s ease-in-out infinite",
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>Instant PDF</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ accordion ────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState(0);
  const faqs = [
    { q: "Is it really free?", a: "Yes — completely free, no credit card, no trial that expires. Enter a name, pick your platforms, and get a full PDF report. We built this as a free tool because we believe everyone should be able to see their online reputation." },
    { q: "How accurate is the reputation score?", a: "The score is generated by AI analysing real social media posts, comments, reviews, news coverage and web search results. It blends social sentiment (70%) with web & search presence (30%), then adjusts for any crisis signals — so it reflects how the internet actually sees you, not a guess." },
    { q: "Do I need to create an account?", a: "No. You can generate and download a full report without signing up. We only ask for an email so we can send you a copy of the PDF — and you can create a free account later if you want to save and track reports over time." },
    { q: "Which platforms do you scan?", a: "X (Twitter), Instagram, TikTok, Facebook, LinkedIn and Google Business — plus a web & search intelligence layer that pulls in news, reviews and press mentions from across the internet." },
    { q: "How long does it take?", a: "Most reports are ready in under 60 seconds for the on-screen preview, and the full PDF is generated moments after. Larger cross-platform scans can take 2–3 minutes." },
    { q: "Is my data safe?", a: "We only analyse publicly available information — the same posts, reviews and search results anyone could find. We never post, never access private accounts, and never share your email." },
  ];
  return (
    <section className="faq-section" style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)", padding: "88px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{
            display: "inline-block", padding: "4px 14px", borderRadius: 999,
            background: "var(--accent-dim)", border: "1px solid var(--accent-border)",
            color: "var(--accent)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", marginBottom: 16,
          }}>
            FAQ
          </span>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.025em", margin: 0 }}>
            Questions, answered
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{
                background: "var(--bg-page)", border: `1px solid ${isOpen ? "var(--accent-border)" : "var(--border)"}`,
                borderRadius: 14, overflow: "hidden", transition: "border-color 0.2s",
              }}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                    padding: "18px 20px", background: "transparent", border: "none", cursor: "pointer",
                    textAlign: "left", fontFamily: "inherit",
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-1)" }}>{f.q}</span>
                  <span style={{
                    width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                    background: isOpen ? "var(--accent)" : "var(--accent-dim)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.2s, transform 0.2s",
                    transform: isOpen ? "rotate(180deg)" : "none",
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={isOpen ? "#fff" : "var(--accent)"} strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                  </span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 20px 20px" }}>
                    <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.65, margin: 0 }}>{f.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="cta-section" style={{
      background: "var(--accent)",
      padding: "96px 24px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* subtle pattern overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.06,
        backgroundImage: "radial-gradient(circle at 25% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 75% 50%, #fff 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}/>
      <div style={{ position: "relative", maxWidth: 560, margin: "0 auto" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20,
          padding: "5px 14px", borderRadius: 999, background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block" }}/>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "0.1em" }}>FREE · NO ACCOUNT REQUIRED</span>
        </div>
        <h2 className="cta-headline" style={{ fontSize: 38, fontWeight: 800, color: "#fff", marginBottom: 14, marginTop: 0, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
          Ready to see your reputation?
        </h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.82)", marginBottom: 36, lineHeight: 1.6 }}>
          Takes 30 seconds. Get an AI reputation score, competitor benchmarks, and a full PDF — free.
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="cta-btn"
          style={{
            background: "#fff",
            color: "var(--accent)",
            padding: "16px 40px",
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            fontFamily: "inherit",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.22)"; }}
          onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.18)"; }}
        >
          Check Your Reputation — Free
          <span style={{ marginLeft: 8 }}>→</span>
        </button>
      </div>
    </section>
  );
}

// ─── Main Hero ────────────────────────────────────────────────────────────────
const Hero = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
          .hero-right { display: none !important; }
        }
        @media (max-width: 640px) {
          .hero-section { padding: 40px 16px 36px !important; }
          .hero-headline { font-size: clamp(30px, 9vw, 48px) !important; line-height: 1.1 !important; }
          .hero-sub { font-size: 15px !important; }
          .hero-search-card { padding: 18px !important; border-radius: 14px !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 16px !important; }
          .how-grid { grid-template-columns: 1fr !important; }
          .how-card-mid { transform: none !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .trust-bar { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .cta-section { padding: 60px 16px !important; }
          .cta-headline { font-size: 28px !important; }
          .cta-btn { padding: 14px 28px !important; font-size: 14px !important; }
          .how-section { padding: 60px 16px !important; }
          .features-section { padding: 60px 16px !important; }
          .stats-section { padding: 24px 16px !important; }
          .preview-section { padding: 60px 16px !important; }
          .preview-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .preview-visual { height: 380px !important; margin-top: 8px; }
          .faq-section { padding: 60px 16px !important; }
          .platform-chips { gap: 5px !important; }
          .platform-chips button { font-size: 11px !important; padding: 4px 9px !important; }
          .acc-type-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 400px) {
          .acc-type-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section
        className="hero-section"
        style={{
          background: "var(--bg-page)",
          padding: "72px 24px 56px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top blue accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--accent)", opacity: 0.9 }}/>

        {/* Very subtle dot grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, rgba(37,99,235,0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.7,
        }}/>

        {/* Soft blue bloom top-right */}
        <div style={{
          position: "absolute", top: -80, right: -80, width: 500, height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}/>

        <div
          className="hero-grid"
          style={{
            position: "relative", zIndex: 2,
            maxWidth: 1080, margin: "0 auto",
            display: "grid", gridTemplateColumns: "1.1fr 0.9fr",
            gap: 64, alignItems: "center",
          }}
        >
          {/* LEFT */}
          <div>
            {/* Badge */}
            <div style={{ marginBottom: 22 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "5px 14px", borderRadius: 999,
                fontSize: 11, fontWeight: 700,
                background: "var(--accent-dim)", border: "1px solid var(--accent-border)",
                color: "var(--accent)", letterSpacing: "0.1em",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block", animation: "pulse-dot 2s ease-in-out infinite" }}/>
                AI-POWERED REPUTATION INTELLIGENCE
              </span>
            </div>

            {/* Headline */}
            <h1
              className="hero-headline"
              style={{
                fontSize: "clamp(40px, 5vw, 66px)",
                fontWeight: 800,
                lineHeight: 1.06,
                letterSpacing: "-0.04em",
                marginBottom: 18,
                marginTop: 0,
                color: "var(--text-1)",
              }}
            >
              See what the internet<br/>
              <span style={{
                backgroundImage: "linear-gradient(135deg, #2563EB, #7C3AED)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
                transition: "none",
              }}>
                says about anyone.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="hero-sub" style={{ fontSize: 17, color: "var(--text-2)", lineHeight: 1.65, marginBottom: 28, maxWidth: 460, marginTop: 0 }}>
              Scan X, Instagram, TikTok, Facebook, LinkedIn and Google in under 60 seconds. Get an AI reputation score, competitor analysis, and a full PDF — completely free.
            </p>

            {/* Search card */}
            <div className="hero-search-card" style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: 24,
              boxShadow: "var(--shadow-md)",
            }}>
              <HeroSearchForm />
            </div>

            {/* Trust signals */}
            <div style={{ marginTop: 20, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
              {[
                { icon: "✓", text: "No signup required" },
                { icon: "✓", text: "6 platforms" },
                { icon: "✓", text: "Results in 60s" },
              ].map(t => (
                <span key={t.text} style={{ fontSize: 12, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
                  <span style={{ color: "var(--green)", fontWeight: 700 }}>{t.icon}</span>
                  {t.text}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT — decorative card stack */}
          <div
            className="hero-right"
            style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative", height: 440 }}
          >
            {/* Main report preview card */}
            <div style={{
              position: "absolute",
              width: 300,
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: 20,
              padding: 24,
              boxShadow: "0 20px 60px rgba(15,23,42,0.14)",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 3,
            }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #2563EB, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)" }}>Reputation Report</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)" }}>Generated just now</div>
                </div>
              </div>
              {/* Score */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Reputation Score</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: "var(--green)", letterSpacing: "-0.04em" }}>8.4<span style={{ fontSize: 16, color: "var(--text-3)", fontWeight: 500 }}>/10</span></div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ padding: "4px 10px", borderRadius: 999, background: "var(--green-dim)", border: "1px solid rgba(5,150,105,0.2)", fontSize: 11, fontWeight: 700, color: "var(--green)" }}>Excellent</div>
                  <div style={{ fontSize: 11, color: "var(--green)", marginTop: 4, fontWeight: 500 }}>↑ +0.6 this month</div>
                </div>
              </div>
              {/* Bar */}
              <div style={{ height: 6, borderRadius: 999, background: "var(--bg-elevated)", overflow: "hidden", marginBottom: 16 }}>
                <div style={{ height: "100%", width: "84%", borderRadius: 999, background: "linear-gradient(90deg, #059669, #2563EB)" }}/>
              </div>
              {/* Mini stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[
                  { l: "Positive", v: "74%", c: "var(--green)" },
                  { l: "Neutral",  v: "18%", c: "var(--amber)" },
                  { l: "Negative", v: "8%",  c: "var(--red)" },
                ].map(s => (
                  <div key={s.l} style={{ textAlign: "center", padding: "8px 6px", background: "var(--bg-elevated)", borderRadius: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: s.c }}>{s.v}</div>
                    <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating platform badges */}
            <div style={{
              position: "absolute", top: 30, left: 0,
              padding: "10px 14px", borderRadius: 12,
              background: "var(--bg-surface)", border: "1px solid var(--border)",
              boxShadow: "var(--shadow-md)", display: "flex", gap: 6, zIndex: 4,
              animation: "float 4s ease-in-out infinite",
            }}>
              {PLATFORMS.slice(0, 4).map(p => (
                <div key={p.id} style={{ width: 24, height: 24, borderRadius: 6, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", color: p.tc || "#fff", border: p.border || "none", flexShrink: 0 }}>
                  <PlatformSVG id={p.id} size={12} />
                </div>
              ))}
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)", alignSelf: "center", marginLeft: 4 }}>+2 more</span>
            </div>

            {/* Scanning badge */}
            <div style={{
              position: "absolute", bottom: 40, right: 0,
              padding: "10px 14px", borderRadius: 12,
              background: "var(--accent)", border: "none",
              boxShadow: "0 4px 16px rgba(37,99,235,0.35)",
              display: "flex", alignItems: "center", gap: 8, zIndex: 4,
              animation: "float 3s ease-in-out infinite 1.5s",
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", display: "inline-block", animation: "pulse-dot 1.4s ease-in-out infinite" }}/>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>Scanning 6 platforms…</span>
            </div>
          </div>
        </div>
      </section>

      <StatsStrip />
      <HowItWorks />
      <ReportPreview />
      <ReportFeatures />
      <TrustBar />
      <FAQ />
      <FinalCTA />
    </>
  );
};

export default Hero;
