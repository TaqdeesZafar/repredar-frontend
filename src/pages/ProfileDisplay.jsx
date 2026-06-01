import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ─── Platform config ──────────────────────────────────────────────────────────
const PLATFORM_CFG = {
  twitter:   { label:"X / Twitter",     bg:"#000",     icon:"twitter" },
  x:         { label:"X / Twitter",     bg:"#000",     icon:"twitter" },
  instagram: { label:"Instagram",        bg:"linear-gradient(135deg,#833AB4,#C13584,#F56040)", icon:"instagram" },
  tiktok:    { label:"TikTok",           bg:"#010101",  icon:"tiktok" },
  facebook:  { label:"Facebook",         bg:"#1877F2",  icon:"facebook" },
  linkedin:  { label:"LinkedIn",         bg:"#0A66C2",  icon:"linkedin" },
  google:    { label:"Google Business",  bg:"#fff",     icon:"google", textDark:true },
};
const getPlatformCfg = (k) => PLATFORM_CFG[k?.toLowerCase()] || PLATFORM_CFG.twitter;

// Steps
const STEPS = [
  { id:1, label:"Connecting to networks",       emoji:"🔗", threshold:0  },
  { id:2, label:"Scanning posts & mentions",    emoji:"🔍", threshold:12 },
  { id:3, label:"Reading audience sentiment",   emoji:"🧠", threshold:25 },
  { id:4, label:"Calculating reputation score", emoji:"⭐", threshold:40 },
  { id:5, label:"Identifying key trends",       emoji:"📊", threshold:55 },
  { id:6, label:"Benchmarking competitors",     emoji:"🏆", threshold:68 },
  { id:7, label:"Composing AI insights",        emoji:"✨", threshold:80 },
  { id:8, label:"Building your PDF report",     emoji:"📄", threshold:91 },
];

const scoreColor = (s) => s >= 7 ? "var(--green)" : s >= 5 ? "var(--amber)" : "var(--red)";
const scoreBg    = (s) => s >= 7 ? "var(--green-dim)" : s >= 5 ? "var(--amber-dim)" : "var(--red-dim)";
const scoreBorder = (s) => s >= 7 ? "var(--green)" : s >= 5 ? "var(--amber)" : "var(--red)";

function fmtNum(n) {
  if (!n) return null;
  if (n >= 1_000_000) return `${(n/1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n/1_000).toFixed(1)}K`;
  return String(n);
}

// ─── Platform SVG icons ───────────────────────────────────────────────────────
function PlatformSVG({ id, size = 14 }) {
  const s = { width:size, height:size };
  if (id==="twitter") return <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
  if (id==="instagram") return <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162S8.597 18.163 12 18.163s6.162-2.759 6.162-6.162S15.403 5.838 12 5.838zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
  if (id==="tiktok") return <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>;
  if (id==="facebook") return <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
  if (id==="linkedin") return <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
  if (id==="google") return <svg style={s} viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>;
  return null;
}

// ─── Build backend URLs (UNCHANGED) ──────────────────────────────────────────
function buildUrls(state) {
  const base = import.meta.env.VITE_BACKEND_URL;
  const profileType = state?.mode === "person" ? "influencer" : "business";
  const ptParam = `&profile_type=${profileType}`;

  if (state?.brandName && state?.urls) {
    const urls = state.urls || {};
    const nonEmpty = Object.entries(urls)
      .filter(([k, v]) => k !== "googleBusinessId" && String(v).trim() !== "")
      .map(([k, v]) => `${encodeURIComponent(k.toLowerCase())}=${encodeURIComponent(String(v).trim())}`)
      .join("&");
    if (!nonEmpty) return { analyzeUrl: null, pdfUrl: null };
    const q = encodeURIComponent(state.brandName);
    const analyzeUrl = `${base}/crossplatform/fetch-analyze-posts?${nonEmpty}&query=${q}${ptParam}`;
    const pdfUrl     = `${base}/crossplatform/generate-pdf-report?${nonEmpty}&query=${q}${ptParam}`;
    return { analyzeUrl, pdfUrl };
  }

  const u   = state?.user || {};
  const plt = (u.platform || "x").toLowerCase();

  if (plt === "google-business" || plt === "google") {
    const bId = u.business_id || "";
    const q   = encodeURIComponent(u.name || "");
    return {
      analyzeUrl: `${base}/google/fetch-analyze-businesses?query=${q}&business_id=${encodeURIComponent(bId)}${ptParam}`,
      pdfUrl:     `${base}/google/generate-pdf-report?query=${q}&business_id=${encodeURIComponent(bId)}${ptParam}`,
    };
  }
  if (plt === "linkedin") {
    const url = encodeURIComponent(u.url || "");
    const q   = encodeURIComponent(u.name || u.full_name || "");
    return {
      analyzeUrl: `${base}/linkedin/fetch-analyze-posts?url=${url}&query=${q}${ptParam}`,
      pdfUrl:     `${base}/linkedin/generate-pdf-report?url=${url}&query=${q}${ptParam}`,
    };
  }
  if (plt === "tiktok") {
    const uid = encodeURIComponent(u.sec_uid || "");
    const q   = encodeURIComponent(u.name || "");
    return {
      analyzeUrl: `${base}/tiktok/fetch-analyze-posts?secUid=${uid}&query=${q}${ptParam}`,
      pdfUrl:     `${base}/tiktok/generate-pdf-report?secUid=${uid}&query=${q}${ptParam}`,
    };
  }
  if (plt === "facebook") {
    const isProfile = u.type === "Profile";
    const param = isProfile ? "profile_id" : "page_id";
    const id  = encodeURIComponent(u.facebook_id || "");
    const q   = encodeURIComponent(u.name || "");
    return {
      analyzeUrl: `${base}/facebook/fetch-analyze-posts?${param}=${id}&query=${q}${ptParam}`,
      pdfUrl:     `${base}/facebook/generate-pdf-report?${param}=${id}&query=${q}${ptParam}`,
    };
  }
  if (plt === "instagram") {
    const handle = encodeURIComponent(u.screen_name || u.username || "");
    return {
      analyzeUrl: `${base}/instagram/fetch-analyze-posts?query=@${handle}${ptParam}`,
      pdfUrl:     `${base}/instagram/generate-pdf-report?query=@${handle}${ptParam}`,
    };
  }
  const handle = encodeURIComponent(u.screen_name || u.username || "");
  return {
    analyzeUrl: `${base}/twitter/fetch-analyze-tweets?query=@${handle}${ptParam}`,
    pdfUrl:     `${base}/twitter/generate-pdf-report?query=@${handle}${ptParam}`,
  };
}

// ─── Shared card style ────────────────────────────────────────────────────────
const card = {
  background: "var(--bg-surface)",
  border: "1px solid var(--border)",
  borderRadius: 20,
  padding: 24,
  boxShadow: "var(--shadow-md)",
};

// ─── Profile header — single ──────────────────────────────────────────────────
function SingleProfileHeader({ user }) {
  const plt    = (user?.platform || "x").toLowerCase();
  const cfg    = getPlatformCfg(plt);
  const name   = user?.name || user?.screen_name || "Unknown";
  const handle = user?.screen_name ? `@${user.screen_name}` : user?.username ? `@${user.username}` : "";
  const bio    = user?.description || user?.headline || user?.signature || user?.biography || "";
  const followers = user?.followers_count || user?.follower_count || user?.followers || 0;
  const avatar = user?.avatar;

  return (
    <div style={{ ...card, overflow:"hidden", padding:0 }}>
      {/* Cover */}
      <div style={{ height:100, position:"relative", overflow:"hidden", background:"linear-gradient(135deg, #0C1322, #111827)" }}>
        {avatar && <img src={avatar} alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", filter:"blur(16px) brightness(0.3)", transform:"scale(1.1)" }}/>}
        {/* Grid overlay */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle, rgba(56,189,248,0.025) 1px, transparent 1px)", backgroundSize:"20px 20px" }}/>
        {/* Platform watermark */}
        <div style={{ position:"absolute", top:10, right:16, opacity:0.1, color:"#fff" }}>
          <PlatformSVG id={cfg.icon} size={48} />
        </div>
        <div style={{ position:"absolute", bottom:12, left:90, right:12 }}>
          <h1 style={{ color:"var(--text-1)", fontWeight:800, fontSize:18, margin:0, lineHeight:1.2 }}>{name}</h1>
          {handle && <p style={{ color:"var(--text-3)", fontSize:12, margin:"2px 0 0" }}>{handle}</p>}
        </div>
      </div>
      {/* Body */}
      <div style={{ padding:"0 20px 20px" }}>
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginTop:-28, marginBottom:14, position:"relative", zIndex:2 }}>
          <div style={{ width:56, height:56, borderRadius:"50%", border:"3px solid var(--bg-page)", overflow:"hidden", background:typeof cfg.bg==="string"&&!cfg.bg.includes("gradient")?cfg.bg:"#312e81" }}>
            {avatar
              ? <img src={avatar} alt={name} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>{e.target.style.display="none";}}/>
              : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ color:"#fff", fontWeight:800, fontSize:20 }}>{name[0]?.toUpperCase()}</span>
                </div>
            }
          </div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"3px 9px", borderRadius:999, fontSize:10, fontWeight:700, background:cfg.textDark?"#fff":"rgba(255,255,255,0.08)", color:cfg.textDark?"#000":"#fff" }}>
            <PlatformSVG id={cfg.icon} size={10} />{cfg.label}
          </div>
        </div>
        {bio && <p style={{ fontSize:12, color:"var(--text-2)", lineHeight:1.5, margin:"0 0 12px", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{bio}</p>}
        {followers > 0 && (
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 10px", borderRadius:999, background:"var(--accent-dim)", border:"1px solid var(--accent-border)", fontSize:11, color:"var(--accent)", fontWeight:600 }}>
            <svg width="11" height="11" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>
            {fmtNum(followers)} followers
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Profile header — combined ────────────────────────────────────────────────
function CombinedProfileHeader({ brandName, selectedPlatforms, mode, avatar }) {
  const initial = (brandName || "?")[0].toUpperCase();
  return (
    <div style={{ ...card, overflow:"hidden", padding:0 }}>
      <div style={{ height:100, position:"relative", overflow:"hidden", background:"linear-gradient(135deg, #0C1322, #111827)" }}>
        {avatar && <img src={avatar} alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", filter:"blur(16px) brightness(0.25)", transform:"scale(1.1)" }}/>}
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle, rgba(56,189,248,0.025) 1px, transparent 1px)", backgroundSize:"20px 20px" }}/>
        <div style={{ position:"absolute", top:10, right:14, display:"flex", gap:8, opacity:0.15 }}>
          {selectedPlatforms.slice(0,4).map(id => <PlatformSVG key={id} id={id==="x"?"twitter":id} size={18} />)}
        </div>
        <div style={{ position:"absolute", bottom:12, left:90, right:12 }}>
          <span style={{ fontSize:10, padding:"2px 8px", borderRadius:999, fontWeight:700, background:"var(--accent-dim)", color:"var(--accent)", border:"1px solid var(--accent-border)" }}>
            {mode==="company"?"🏢 Business":"👤 Person"}
          </span>
          <h1 style={{ color:"var(--text-1)", fontWeight:800, fontSize:18, margin:"4px 0 0", lineHeight:1.2 }}>{brandName}</h1>
          <p style={{ color:"var(--text-3)", fontSize:11, margin:"2px 0 0" }}>Multi-platform analysis</p>
        </div>
      </div>
      <div style={{ padding:"0 20px 20px" }}>
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginTop:-28, marginBottom:14, position:"relative", zIndex:2 }}>
          <div style={{ width:56, height:56, borderRadius:"50%", border:"3px solid var(--bg-page)", overflow:"hidden", background:"linear-gradient(135deg, #38BDF8, #818CF8)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {avatar
              ? <img src={avatar} alt={brandName} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>{e.target.style.display="none";}}/>
              : <span style={{ color:"#050911", fontWeight:800, fontSize:22 }}>{initial}</span>
            }
          </div>
          <span style={{ fontSize:11, color:"var(--text-3)", background:"var(--bg-elevated)", border:"1px solid var(--border)", padding:"3px 10px", borderRadius:999 }}>
            {selectedPlatforms.length} platforms
          </span>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {selectedPlatforms.map(id => {
            const cfg = getPlatformCfg(id);
            return (
              <div key={id} style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 9px", borderRadius:999, fontSize:10, fontWeight:700, background:"rgba(255,255,255,0.05)", color:"var(--text-2)", border:"1px solid var(--border)" }}>
                <PlatformSVG id={cfg.icon} size={10} />{cfg.label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ProfileDisplay() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const isCombined = !!(state.brandName && state.urls);
  const selectedPlatforms = isCombined
    ? Object.keys(state.urls || {}).filter(k => k !== "googleBusinessId").map(k => k.toLowerCase() === "x" || k.toLowerCase() === "twitter" ? "twitter" : k.toLowerCase())
    : [];

  const { analyzeUrl, pdfUrl } = buildUrls(state);
  const displayName = isCombined
    ? (state.brandName || "Report")
    : (state.user?.name || state.user?.screen_name || "Report");

  const [phase,           setPhase]          = useState("idle");
  const [progress,        setProgress]       = useState(0);
  const [activeStep,      setActiveStep]     = useState(0);
  const [reportData,      setReportData]     = useState(null);
  const [errorMessage,    setErrorMessage]   = useState("");
  const [showEmailModal,  setShowEmailModal] = useState(false);
  const [email,           setEmail]          = useState("");
  const [capturedEmail,   setCapturedEmail]  = useState(() => localStorage.getItem("capturedEmail") || "");
  const [modalError,      setModalError]     = useState("");
  const [upsellDismissed, setUpsellDismissed] = useState(false);

  const tickerRef = useRef(null);

  const startTicker = (totalMs = 170000) => {
    const startTime = Date.now();
    tickerRef.current = setInterval(() => {
      const pct = Math.min(90 * (1 - Math.pow(1 - Math.min((Date.now() - startTime) / totalMs, 1), 2.2)), 90);
      setProgress(pct);
      setActiveStep(Math.max(0, STEPS.filter(s => s.threshold <= pct).length - 1));
    }, 400);
  };
  const stopTicker = () => { if (tickerRef.current) { clearInterval(tickerRef.current); tickerRef.current = null; } };

  useEffect(() => { if (!analyzeUrl) { navigate("/"); } }, []);

  const handleGenerateReport = async () => {
    if (phase === "analyzing" || phase === "downloading") return;
    if (!analyzeUrl) { setErrorMessage("Missing profile data. Please search again."); return; }
    setPhase("analyzing"); setProgress(0); setActiveStep(0); setErrorMessage(""); startTicker(170000);
    try {
      const res = await fetch(analyzeUrl);
      stopTicker();
      if (res.ok) {
        const data = await res.json();
        setProgress(100); setActiveStep(STEPS.length - 1); setReportData(data);
        setTimeout(() => setPhase("preview"), 600);
      } else {
        let msg = "";
        try { const d = await res.json(); msg = d.message || d.error || ""; } catch { msg = res.statusText; }
        if (msg.toLowerCase().includes("private") || msg.toLowerCase().includes("no accessible")) {
          setReportData(null); setPhase("preview");
        } else {
          setErrorMessage(`Unable to complete scan. Please try a different platform or search again. (${msg})`);
          setPhase("idle");
        }
      }
    } catch (err) { stopTicker(); setErrorMessage("Network error — please check your connection and try again."); setPhase("idle"); }
  };

  const handleUnlock = () => {
    const stored = localStorage.getItem("capturedEmail");
    if (stored) { setCapturedEmail(stored); downloadPdf(stored); return; }
    setModalError(""); setEmail(""); setShowEmailModal(true);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) { setModalError("Please enter a valid email."); return; }
    localStorage.setItem("capturedEmail", email);
    setCapturedEmail(email); setShowEmailModal(false); downloadPdf(email);
  };

  const downloadPdf = async (userEmail) => {
    if (!pdfUrl) { setErrorMessage("No PDF URL available."); return; }
    const fullPdfUrl = `${pdfUrl}&email=${encodeURIComponent(userEmail)}`;
    setPhase("downloading"); setProgress(0); setErrorMessage(""); startTicker(170000);
    try {
      const res = await fetch(fullPdfUrl);
      stopTicker();
      if (res.ok) {
        const blob = await res.blob(); setProgress(100);
        const filename = `${displayName.replace(/\s+/g, "_")}_reputation_report.pdf`;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a"); a.style.display="none"; a.href=url; a.download=filename;
        document.body.appendChild(a); a.click(); window.URL.revokeObjectURL(url); document.body.removeChild(a);
        setPhase("done");
      } else {
        let msg = ""; try { const d = await res.json(); msg = d.message || ""; } catch {}
        setErrorMessage(`Download failed: ${msg}`); setPhase("preview");
      }
    } catch (err) { stopTicker(); setErrorMessage(`Download failed: ${err.message}`); setPhase("preview"); }
  };

  const overall   = reportData?.sentimentAnalysis?.overall;
  const sentiment = overall?.sentiment || "neutral";
  const sentColors = {
    positive: { bg:"var(--green-dim)", text:"var(--green)", dot:"var(--green)" },
    neutral:  { bg:"var(--amber-dim)", text:"var(--amber)", dot:"var(--amber)" },
    negative: { bg:"var(--red-dim)",   text:"var(--red)",   dot:"var(--red)"   },
  };
  const sentColor = sentColors[sentiment] || sentColors.neutral;

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-page)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: "var(--text-1)",
    }}>
      {/* Grid background */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "linear-gradient(rgba(56,189,248,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.025) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}/>

      {/* Error toast */}
      {errorMessage && (
        <div style={{
          position: "fixed", top: 16, right: 16, zIndex: 100,
          background: "var(--bg-surface)", border: "1px solid rgba(248,113,113,0.3)",
          borderRadius: 14, padding: 16, maxWidth: 340, display: "flex", gap: 12,
          boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 13, margin: "0 0 3px", color: "var(--red)" }}>Error</p>
            <p style={{ fontSize: 12, color: "var(--text-2)", margin: 0, wordBreak: "break-word" }}>{errorMessage}</p>
          </div>
          <button onClick={() => setErrorMessage("")} style={{ background: "none", border: "none", color: "var(--text-3)", cursor: "pointer", padding: 2, flexShrink: 0, fontFamily: "inherit" }}>✕</button>
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1, maxWidth: 520, margin: "0 auto", padding: "32px 16px 80px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Profile header */}
        {isCombined
          ? <CombinedProfileHeader brandName={state.brandName} selectedPlatforms={selectedPlatforms} mode={state.mode} avatar={state.avatar}/>
          : state.user && <SingleProfileHeader user={state.user}/>
        }

        {/* ── IDLE ── */}
        {phase === "idle" && (
          <div style={card}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--accent-dim)", border: "1px solid var(--accent-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>📋</div>
              <div>
                <h2 style={{ fontSize: 19, fontWeight: 800, margin: "0 0 4px", color: "var(--text-1)" }}>AI Reputation Report</h2>
                <p style={{ fontSize: 13, color: "var(--text-2)", margin: 0 }}>
                  {isCombined ? `Full scan across ${selectedPlatforms.length} platform${selectedPlatforms.length>1?"s":""} — free for everyone.` : "Full social media scan — free for everyone."}
                </p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
              {[
                { emoji:"🔍", title:"Deep Scan",  sub:"100+ signals",     bg:"var(--amber-dim)", border:"rgba(251,191,36,0.2)", accent:"var(--amber)" },
                { emoji:"🧠", title:"GPT-4 AI",   sub:"Smart insights",   bg:"var(--green-dim)", border:"rgba(52,211,153,0.2)", accent:"var(--green)" },
                { emoji:"📊", title:"Full PDF",   sub:"Instant download", bg:"var(--accent-dim)", border:"var(--accent-border)", accent:"var(--accent)" },
              ].map(item => (
                <div key={item.title} style={{ borderRadius: 12, padding: "12px 10px", textAlign: "center", background: item.bg, border: `1px solid ${item.border}` }}>
                  <div style={{ fontSize: 22, marginBottom: 5 }}>{item.emoji}</div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: item.accent, margin: "0 0 2px" }}>{item.title}</p>
                  <p style={{ fontSize: 10, color: "var(--text-3)", margin: 0 }}>{item.sub}</p>
                </div>
              ))}
            </div>
            <button onClick={handleGenerateReport} style={{
              width: "100%", padding: "15px 22px", borderRadius: 14, fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #38BDF8, #818CF8)", color: "#050911",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
              boxShadow: "var(--shadow-btn)", fontFamily: "inherit",
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
              Generate Free Report
            </button>
            <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-3)", marginTop: 10 }}>Takes 2–3 minutes · No credit card required</p>
          </div>
        )}

        {/* ── ANALYZING ── */}
        {phase === "analyzing" && (
          <div style={card}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
              {/* Spinner */}
              <div style={{ position: "relative", width: 88, height: 88, marginBottom: 14 }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "var(--accent-dim)", border: "2px solid var(--accent-border)" }}/>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "var(--accent)", borderRightColor: "var(--accent)", animation: "spin 1s linear infinite" }}/>
                <div style={{ position: "absolute", inset: 8, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "var(--accent-border)", animation: "spin 1.8s linear infinite reverse" }}/>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                  {STEPS[activeStep]?.emoji || "🔗"}
                </div>
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 800, margin: "0 0 4px", color: "var(--text-1)" }}>Analyzing reputation...</h3>
              <p style={{ fontSize: 13, color: "var(--text-2)", margin: 0 }}>{STEPS[activeStep]?.label}</p>
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 6 }}>
                <span style={{ color: "var(--text-3)", fontWeight: 600 }}>Progress</span>
                <span style={{ color: "var(--accent)", fontWeight: 700 }}>{Math.round(progress)}%</span>
              </div>
              <div style={{ height: 6, background: "var(--bg-elevated)", borderRadius: 999, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 999, width: `${progress}%`,
                  background: "linear-gradient(90deg, #38BDF8, #818CF8)",
                  boxShadow: "0 0 12px rgba(56,189,248,0.4)",
                  transition: "width .7s ease-out",
                }}/>
              </div>
            </div>

            {/* Steps list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {STEPS.map((step, i) => {
                const done   = i < activeStep;
                const active = i === activeStep;
                return (
                  <div key={step.id} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "8px 10px", borderRadius: 10,
                    background: active ? "var(--accent-dim)" : "transparent",
                    border: active ? "1px solid var(--accent-border)" : "1px solid transparent",
                    opacity: !done && !active ? 0.3 : 1,
                  }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11,
                      background: done ? "var(--green-dim)" : active ? "var(--accent-dim)" : "rgba(255,255,255,0.03)",
                      border: `1.5px solid ${done ? "var(--green)" : active ? "var(--accent)" : "var(--border)"}`,
                    }}>
                      {done ? <span style={{ color: "var(--green)", fontSize: 10 }}>✓</span> : step.emoji}
                    </div>
                    <span style={{
                      fontSize: 13, flex: 1, fontWeight: active ? 600 : 400,
                      color: done ? "var(--text-3)" : active ? "var(--accent)" : "var(--text-2)",
                      textDecoration: done ? "line-through" : "none",
                    }}>
                      {step.label}
                    </span>
                    {active && (
                      <div style={{ display: "flex", gap: 3 }}>
                        {[0, 150, 300].map(d => <span key={d} style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", display: "inline-block", animation: "bounce 1s infinite", animationDelay: `${d}ms` }}/>)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-3)", marginTop: 14 }}>Please keep this tab open — usually 2–3 minutes</p>
          </div>
        )}

        {/* ── PREVIEW ── */}
        {(phase === "preview" || phase === "done") && reportData && (
          <>
            {/* Score card */}
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: "var(--text-1)" }}>Reputation Score</h2>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: sentColor.bg, color: sentColor.text }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: sentColor.dot, display: "inline-block" }}/>
                  {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ width: 100, height: 100, borderRadius: "50%", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: scoreBg(overall?.score), border: `3px solid ${scoreBorder(overall?.score)}` }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: scoreColor(overall?.score), lineHeight: 1 }}>{overall?.score ?? "—"}</span>
                  <span style={{ fontSize: 10, color: "var(--text-3)", fontWeight: 500 }}>/10</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, marginBottom: 10, marginTop: 0 }}>Top Strengths</p>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                    {(overall?.key_positives||[]).slice(0, 3).map((p, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "var(--text-2)" }}>
                        <span style={{ color: "var(--green)", flexShrink: 0, marginTop: 1 }}>✓</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Unlock CTA */}
            <div style={{ ...card, background: "linear-gradient(135deg, rgba(56,189,248,0.08), rgba(129,140,248,0.06))", border: "1px solid var(--accent-border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: "var(--accent-dim)", border: "1px solid var(--accent-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  🔒
                </div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 15, margin: "0 0 2px", color: "var(--text-1)" }}>Full report is ready</p>
                  <p style={{ fontSize: 12, color: "var(--text-2)", margin: 0 }}>Competitor analysis · Action plan · 12-month trends · PDF</p>
                </div>
              </div>
              <button onClick={handleUnlock} style={{
                width: "100%", padding: "15px 22px", borderRadius: 14, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #38BDF8, #818CF8)", color: "#050911",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
                boxShadow: "var(--shadow-btn)", fontFamily: "inherit",
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                {capturedEmail ? "Download Full Report →" : "Get Full Report — Free →"}
              </button>
              <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 10 }}>
                {["🔒 Private", "✅ No spam", "📄 Free PDF"].map(t => (
                  <span key={t} style={{ fontSize: 11, color: "var(--text-3)" }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Blurred preview */}
            <div style={{ position: "relative", overflow: "hidden", borderRadius: 20, maxHeight: 200 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, filter: "blur(5px)", pointerEvents: "none", userSelect: "none" }}>
                <div style={card}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "var(--text-2)" }}>Key Weaknesses & More Strengths</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: "var(--green)", marginBottom: 8, marginTop: 0 }}>More Strengths</p>
                      {(overall?.key_positives||[]).slice(3).map((p, i) => <p key={i} style={{ fontSize: 11, color: "var(--text-2)", margin: "0 0 4px" }}>✓ {p}</p>)}
                    </div>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: "var(--red)", marginBottom: 8, marginTop: 0 }}>Areas to Improve</p>
                      {(overall?.key_negatives||[]).map((n, i) => <p key={i} style={{ fontSize: 11, color: "var(--text-2)", margin: "0 0 4px" }}>✗ {n}</p>)}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(to bottom, transparent, var(--bg-page))", pointerEvents: "none" }}/>
            </div>
          </>
        )}

        {/* ── DOWNLOADING ── */}
        {phase === "downloading" && (
          <>
            <div style={card}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
                <div style={{ position: "relative", width: 88, height: 88, marginBottom: 14 }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid var(--accent-border)" }}/>
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "var(--accent)", borderRightColor: "var(--accent)", animation: "spin 1s linear infinite" }}/>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>📄</div>
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 800, margin: "0 0 4px", color: "var(--text-1)" }}>Building your PDF...</h3>
                <p style={{ fontSize: 13, color: "var(--text-2)", margin: 0 }}>Compiling all insights into your report</p>
              </div>
              <div style={{ height: 6, background: "var(--bg-elevated)", borderRadius: 999, overflow: "hidden", marginBottom: 8 }}>
                <div style={{ height: "100%", borderRadius: 999, width: `${progress}%`, background: "linear-gradient(90deg, #38BDF8, #818CF8)", boxShadow: "0 0 12px rgba(56,189,248,0.4)", transition: "width .7s ease-out" }}/>
              </div>
              <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-3)" }}>{Math.round(progress)}% · Please keep this tab open</p>
            </div>

            {!upsellDismissed && (
              <div style={{ borderRadius: 20, overflow: "hidden", background: "linear-gradient(135deg, rgba(56,189,248,0.08), rgba(129,140,248,0.06))", border: "1px solid var(--accent-border)" }}>
                <div style={{ padding: 24, position: "relative" }}>
                  <button onClick={() => setUpsellDismissed(true)} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "var(--text-3)", cursor: "pointer", fontSize: 16, fontFamily: "inherit" }}>✕</button>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 8, marginTop: 0 }}>While you wait</p>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-1)", margin: "0 0 8px", paddingRight: 24 }}>Track {displayName}'s reputation over time</h3>
                  <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 18, lineHeight: 1.5, marginTop: 0 }}>This is a one-time snapshot. Save it and re-run anytime to watch how reputation changes.</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
                    {[
                      { emoji:"📂", label:"Saved Reports", sub:"All in one place" },
                      { emoji:"🔄", label:"Re-run Anytime", sub:"Fresh data always" },
                      { emoji:"📈", label:"Track Trends",   sub:"See changes" },
                    ].map(item => (
                      <div key={item.label} style={{ borderRadius: 12, padding: "10px 8px", textAlign: "center", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)" }}>
                        <div style={{ fontSize: 18, marginBottom: 4 }}>{item.emoji}</div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-1)", margin: "0 0 2px" }}>{item.label}</p>
                        <p style={{ fontSize: 10, color: "var(--text-3)", margin: 0 }}>{item.sub}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => navigate("/signup", { state: { prefillEmail: capturedEmail } })}
                    style={{ width: "100%", padding: "12px", borderRadius: 12, fontWeight: 700, fontSize: 13, background: "var(--accent)", color: "#050911", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                    Create Free Account →
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── DONE ── */}
        {phase === "done" && (
          <>
            <div style={{ ...card, textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--green-dim)", border: "1px solid var(--green)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28 }}>✅</div>
              <h3 style={{ fontSize: 19, fontWeight: 800, margin: "0 0 6px", color: "var(--text-1)" }}>PDF Downloaded!</h3>
              <p style={{ fontSize: 13, color: "var(--text-2)", margin: 0 }}>Your download started automatically.</p>
              {capturedEmail && <p style={{ fontSize: 12, color: "var(--green)", fontWeight: 600, marginTop: 8 }}>Report also sent to {capturedEmail}</p>}
              <button onClick={() => setPhase("preview")} style={{ marginTop: 14, background: "none", border: "none", color: "var(--accent)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Back to preview
              </button>
            </div>

            {!upsellDismissed && (
              <div style={{ ...card, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--accent-dim)", border: "1px solid var(--accent-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📂</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 2px", color: "var(--text-1)" }}>Save this report to your account</p>
                  <p style={{ fontSize: 11, color: "var(--text-3)", margin: 0 }}>Free · Takes 30 seconds</p>
                </div>
                <button onClick={() => navigate("/signup", { state: { prefillEmail: capturedEmail } })}
                  style={{ padding: "9px 16px", borderRadius: 10, fontWeight: 700, fontSize: 12, background: "linear-gradient(135deg, #38BDF8, #818CF8)", color: "#050911", border: "none", cursor: "pointer", flexShrink: 0, fontFamily: "inherit" }}>
                  Sign Up →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Email modal ── */}
      {showEmailModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
          <div style={{
            background: "var(--bg-surface)", border: "1px solid var(--border)",
            borderRadius: 22, padding: 32, maxWidth: 360, width: "100%",
            boxShadow: "0 40px 80px rgba(0,0,0,0.8)", position: "relative",
          }}>
            <button onClick={() => setShowEmailModal(false)} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "var(--text-3)", cursor: "pointer", fontSize: 18, fontFamily: "inherit" }}>✕</button>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--accent-dim)", border: "1px solid var(--accent-border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 26 }}>📧</div>
              <h3 style={{ fontSize: 19, fontWeight: 800, margin: "0 0 8px", color: "var(--text-1)" }}>Where should we send your report?</h3>
              <p style={{ fontSize: 13, color: "var(--text-2)", margin: 0, lineHeight: 1.5 }}>
                Enter your email to unlock the full PDF — competitor analysis, action plan & trends. 100% free.
              </p>
            </div>
            <form onSubmit={handleEmailSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                type="email" required autoFocus
                placeholder="name@company.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setModalError(""); }}
                style={{
                  padding: "13px 16px", borderRadius: 12, fontSize: 14,
                  background: "var(--bg-elevated)",
                  border: `1px solid ${modalError ? "var(--red)" : "var(--accent-border)"}`,
                  color: "var(--text-1)", outline: "none", fontFamily: "inherit",
                }}
                onFocus={e => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "0 0 0 3px var(--accent-dim)"; }}
                onBlur={e => { e.target.style.borderColor = modalError ? "var(--red)" : "var(--accent-border)"; e.target.style.boxShadow = "none"; }}
              />
              {modalError && <p style={{ fontSize: 12, color: "var(--red)", margin: 0, display: "flex", gap: 5 }}>⚠️ {modalError}</p>}
              <button type="submit" style={{
                padding: "14px", borderRadius: 12, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #38BDF8, #818CF8)", color: "#050911",
                boxShadow: "var(--shadow-btn)", fontFamily: "inherit",
              }}>
                Unlock Full Report →
              </button>
            </form>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 14 }}>
              {["🔒 Private", "✅ No spam", "📄 Free PDF"].map(t => (
                <span key={t} style={{ fontSize: 11, color: "var(--text-3)" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);} }
        @keyframes radar-sweep { to { transform: rotate(360deg); } }
        @keyframes pulse-glow { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:.6;transform:scale(.9);} }
        @keyframes float { 0%,100%{transform:translateY(0);}50%{transform:translateY(-6px);} }
      `}</style>
    </div>
  );
}
