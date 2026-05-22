import { useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import {
  FaFacebook, FaInstagram, FaXTwitter, FaLinkedin, FaTiktok,
} from "react-icons/fa6";
import { FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

// ─── Platform config ──────────────────────────────────────────────────────────
const PLATFORM_CFG = {
  twitter:   { label: "X / Twitter",     Icon: FaXTwitter,  bg: "#000",     iconColor: "#fff" },
  x:         { label: "X / Twitter",     Icon: FaXTwitter,  bg: "#000",     iconColor: "#fff" },
  instagram: { label: "Instagram",        Icon: FaInstagram, bg: "linear-gradient(135deg,#833AB4,#C13584,#F56040)", iconColor: "#fff" },
  tiktok:    { label: "TikTok",           Icon: FaTiktok,    bg: "#010101",  iconColor: "#fff" },
  facebook:  { label: "Facebook",         Icon: FaFacebook,  bg: "#1877F2",  iconColor: "#fff" },
  linkedin:  { label: "LinkedIn",         Icon: FaLinkedin,  bg: "#0A66C2",  iconColor: "#fff" },
  google:    { label: "Google Business",  Icon: FaGoogle,    bg: "#fff",     iconColor: "#4285F4", border: "1px solid #e2e8f0" },
};

const getPlatformCfg = (key) => PLATFORM_CFG[key?.toLowerCase()] || PLATFORM_CFG.twitter;

// Steps shown during scan
const STEPS = [
  { id: 1, label: "Connecting to networks",       emoji: "🔗", threshold: 0  },
  { id: 2, label: "Scanning posts & mentions",    emoji: "🔍", threshold: 12 },
  { id: 3, label: "Reading audience sentiment",   emoji: "🧠", threshold: 25 },
  { id: 4, label: "Calculating reputation score", emoji: "⭐", threshold: 40 },
  { id: 5, label: "Identifying key trends",       emoji: "📊", threshold: 55 },
  { id: 6, label: "Benchmarking competitors",     emoji: "🏆", threshold: 68 },
  { id: 7, label: "Composing AI insights",        emoji: "✨", threshold: 80 },
  { id: 8, label: "Building your PDF report",     emoji: "📄", threshold: 91 },
];

const SENTIMENT_COLORS = {
  positive: { bg: "#F0FDF4", text: "#16A34A", dot: "#22C55E" },
  neutral:  { bg: "#FEFCE8", text: "#CA8A04", dot: "#EAB308" },
  negative: { bg: "#FEF2F2", text: "#DC2626", dot: "#EF4444" },
};

const scoreColor = (s) => s >= 7 ? "#16A34A" : s >= 5 ? "#CA8A04" : "#DC2626";
const scoreBg    = (s) => s >= 7 ? "#F0FDF4" : s >= 5 ? "#FEFCE8" : "#FEF2F2";

// ─── Build backend URLs ───────────────────────────────────────────────────────
// state shape from SearchResult:
//   single:   { user: { name, screen_name, avatar, platform, ...platformFields }, mode }
//   combined: { brandName, urls, toggles, mode }
//     urls keys: Twitter, Instagram, TikTok, Facebook, Linkedin, InstaRab, Google
//     + googleBusinessId if google selected

function buildUrls(state) {
  const base = import.meta.env.VITE_BACKEND_URL;
  // mode "company" → profile_type=business, "person" → profile_type=influencer
  const profileType = state?.mode === "person" ? "influencer" : "business";
  const ptParam = `&profile_type=${profileType}`;

  // ── Combined / multi-platform ─────────────────────────────────────────────
  if (state?.brandName && state?.urls) {
    const urls = state.urls || {};
    // crossplatform controller expects: twitter, instagram, tiktok, facebook, linkedin, google
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

  // ── Single platform ───────────────────────────────────────────────────────
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
  // twitter / x
  const handle = encodeURIComponent(u.screen_name || u.username || "");
  return {
    analyzeUrl: `${base}/twitter/fetch-analyze-tweets?query=@${handle}${ptParam}`,
    pdfUrl:     `${base}/twitter/generate-pdf-report?query=@${handle}${ptParam}`,
  };
}

function fmtNum(n) {
  if (!n) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function PlatformBadge({ platformId }) {
  const cfg = getPlatformCfg(platformId);
  return (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ background: cfg.bg, border: cfg.border || "none", color: cfg.iconColor }}>
      {cfg.Icon && <cfg.Icon style={{ color: cfg.iconColor, fontSize: 10 }} />}
      <span style={{ color: cfg.iconColor }}>{cfg.label}</span>
    </div>
  );
}

// ─── Profile header — single platform ────────────────────────────────────────
function SingleProfileHeader({ user }) {
  const plt      = (user?.platform || "x").toLowerCase();
  const cfg      = getPlatformCfg(plt);
  const name     = user?.name || user?.screen_name || "Unknown";
  const handle   = user?.screen_name ? `@${user.screen_name}` : user?.username ? `@${user.username}` : "";
  const bio      = user?.description || user?.headline || user?.signature || user?.biography || "";
  const followers = user?.followers_count || user?.follower_count || user?.followers || 0;
  const avatar   = user?.avatar;
  const solidBg  = typeof cfg.bg === "string" && !cfg.bg.includes("gradient") ? cfg.bg : "#312e81";

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
      {/* Cover — blurred avatar if available, else platform colour */}
      <div className="relative h-36 overflow-hidden">
        {avatar ? (
          <>
            <img src={avatar} alt="" className="absolute inset-0 w-full h-full object-cover scale-110"
              style={{ filter: "blur(18px) brightness(0.5)" }} />
            <div className="absolute inset-0 opacity-50" style={{ background: solidBg }} />
          </>
        ) : (
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg,${solidBg}dd,${solidBg}88)` }} />
        )}
        {/* Dot grid overlay */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
        {/* Watermark platform icon */}
        <div className="absolute top-3 right-5 opacity-[0.15]">
          {cfg.Icon && <cfg.Icon style={{ color: "#fff", fontSize: 56 }} />}
        </div>
        {/* Name + handle overlaid bottom-left, offset for avatar */}
        <div className="absolute bottom-4 left-[108px] right-4">
          <h1 className="text-white font-black text-xl leading-tight truncate"
            style={{ fontFamily: "'Poppins',sans-serif", textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>
            {name}
          </h1>
          {handle && <p className="text-white/65 text-xs font-medium mt-0.5">{handle}</p>}
        </div>
      </div>

      {/* Card body */}
      <div className="px-5 pb-5">
        {/* Avatar floats up over the cover */}
        <div className="flex items-end justify-between -mt-11 mb-3 relative z-10">
          <div className="w-20 h-20 rounded-full border-[3px] border-white shadow-xl overflow-hidden flex-shrink-0"
            style={{ background: solidBg }}>
            {avatar
              ? <img src={avatar} alt={name} className="w-full h-full object-cover"
                  onError={e => { e.target.style.display = "none"; }} />
              : <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white font-black text-2xl" style={{ fontFamily: "'Poppins',sans-serif" }}>
                    {name[0]?.toUpperCase()}
                  </span>
                </div>
            }
          </div>
          <div className="mb-1"><PlatformBadge platformId={plt} /></div>
        </div>

        {bio && <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{bio}</p>}

        {followers > 0 && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className="text-xs font-bold">{fmtNum(followers)} followers</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Profile header — combined / multi-platform ───────────────────────────────
function CombinedProfileHeader({ brandName, selectedPlatforms, mode, avatar }) {
  const initial = (brandName || "?")[0].toUpperCase();
  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
      {/* Cover — blurred avatar if available, else gradient */}
      <div className="relative h-36 overflow-hidden"
        style={{ background: "linear-gradient(135deg,#1e1b4b 0%,#3730a3 40%,#6d28d9 70%,#0e7490 100%)" }}>
        {avatar && (
          <>
            <img src={avatar} alt="" className="absolute inset-0 w-full h-full object-cover scale-110"
              style={{ filter: "blur(18px) brightness(0.45)" }} />
            <div className="absolute inset-0 opacity-60"
              style={{ background: "linear-gradient(135deg,#1e1b4b,#3730a3,#6d28d9)" }} />
          </>
        )}
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
        {/* Floating platform icons */}
        <div className="absolute top-4 right-5 flex gap-2.5 opacity-25">
          {selectedPlatforms.slice(0, 5).map(id => {
            const cfg = getPlatformCfg(id);
            return cfg.Icon ? <cfg.Icon key={id} style={{ color: "#fff", fontSize: 18 }} /> : null;
          })}
        </div>
        {/* Name bottom-left */}
        <div className="absolute bottom-4 left-[108px] right-4">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold mb-1 inline-block ${mode === "company" ? "bg-blue-400/25 text-blue-100" : "bg-purple-400/25 text-purple-100"}`}>
            {mode === "company" ? "🏢 Business" : "👤 Person"}
          </span>
          <h1 className="text-white font-black text-xl leading-tight truncate"
            style={{ fontFamily: "'Poppins',sans-serif", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
            {brandName}
          </h1>
          <p className="text-white/55 text-xs mt-0.5">Multi-platform analysis</p>
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="flex items-end justify-between -mt-11 mb-4 relative z-10">
          {/* Avatar — real photo if available, else monogram */}
          <div className="w-20 h-20 rounded-full border-[3px] border-white shadow-xl overflow-hidden flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#4F46E5,#7C3AED)" }}>
            {avatar
              ? <img src={avatar} alt={brandName} className="w-full h-full object-cover"
                  onError={e => { e.target.style.display = "none"; }} />
              : <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white font-black text-2xl" style={{ fontFamily: "'Poppins',sans-serif" }}>{initial}</span>
                </div>
            }
          </div>
          <div className="mb-1 text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
            {selectedPlatforms.length} platforms
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {selectedPlatforms.map(id => <PlatformBadge key={id} platformId={id} />)}
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

  // Detect mode: combined if brandName+urls present, single if user present
  const isCombined = !!(state.brandName && state.urls);
  const selectedPlatforms = isCombined
    ? Object.keys(state.urls || {}).filter(k => k !== "googleBusinessId").map(k => k.toLowerCase() === "x" || k.toLowerCase() === "twitter" ? "twitter" : k.toLowerCase())
    : [];

  const { analyzeUrl, pdfUrl } = buildUrls(state);
  const displayName = isCombined
    ? (state.brandName || "Report")
    : (state.user?.name || state.user?.screen_name || "Report");

  // phase: idle | analyzing | preview | downloading | done
  const [phase,          setPhase]          = useState("idle");
  const [progress,       setProgress]       = useState(0);
  const [activeStep,     setActiveStep]     = useState(0);
  const [reportData,     setReportData]     = useState(null);
  const [errorMessage,   setErrorMessage]   = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email,          setEmail]          = useState("");
  const [capturedEmail,  setCapturedEmail]  = useState(() => localStorage.getItem("capturedEmail") || "");
  const [modalError,     setModalError]     = useState("");
  const [upsellDismissed, setUpsellDismissed] = useState(false);
  const [showBanner,     setShowBanner]     = useState(true);

  const tickerRef = useRef(null);

  const startTicker = (totalMs = 170000) => {
    const startTime = Date.now();
    tickerRef.current = setInterval(() => {
      const pct = Math.min(90 * (1 - Math.pow(1 - Math.min((Date.now() - startTime) / totalMs, 1), 2.2)), 90);
      setProgress(pct);
      setActiveStep(Math.max(0, STEPS.filter(s => s.threshold <= pct).length - 1));
    }, 400);
  };

  const stopTicker = () => {
    if (tickerRef.current) { clearInterval(tickerRef.current); tickerRef.current = null; }
  };

  // Redirect home if no state
  useEffect(() => {
    if (!analyzeUrl) { navigate("/"); }
  }, []);

  const handleGenerateReport = async () => {
    if (phase === "analyzing" || phase === "downloading") return;
    if (!analyzeUrl) { setErrorMessage("Missing profile data. Please search again."); return; }

    setPhase("analyzing");
    setProgress(0);
    setActiveStep(0);
    setErrorMessage("");
    startTicker(170000);

    try {
      const res = await fetch(analyzeUrl);
      stopTicker();
      if (res.ok) {
        const data = await res.json();
        setProgress(100);
        setActiveStep(STEPS.length - 1);
        setReportData(data);
        setTimeout(() => setPhase("preview"), 600);
      } else {
        let msg = "";
        try { const d = await res.json(); msg = d.message || d.error || ""; } catch { msg = res.statusText; }
        // Treat "private" / "no posts" as a soft warning — still let user download
        if (msg.toLowerCase().includes("private") || msg.toLowerCase().includes("no accessible")) {
          setReportData(null);
          setPhase("preview");
        } else {
          setErrorMessage(`Unable to complete scan. Please try a different platform or search again. (${msg})`);
          setPhase("idle");
        }
      }
    } catch (err) {
      stopTicker();
      setErrorMessage(`Network error — please check your connection and try again.`);
      setPhase("idle");
    }
  };

  const handleUnlock = () => {
    const stored = localStorage.getItem("capturedEmail");
    if (stored) {
      // Already have email — go straight to download
      setCapturedEmail(stored);
      downloadPdf(stored);
      return;
    }
    setModalError("");
    setEmail("");
    setShowEmailModal(true);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) { setModalError("Please enter a valid email."); return; }
    localStorage.setItem("capturedEmail", email);
    setCapturedEmail(email);
    setShowEmailModal(false);
    downloadPdf(email);
  };

  const downloadPdf = async (userEmail) => {
    if (!pdfUrl) { setErrorMessage("No PDF URL available."); return; }
    const fullPdfUrl = `${pdfUrl}&email=${encodeURIComponent(userEmail)}`;

    setPhase("downloading");
    setProgress(0);
    setErrorMessage("");
    startTicker(170000);

    try {
      const res = await fetch(fullPdfUrl);
      stopTicker();
      if (res.ok) {
        const blob = await res.blob();
        setProgress(100);
        const filename = `${displayName.replace(/\s+/g, "_")}_reputation_report.pdf`;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none"; a.href = url; a.download = filename;
        document.body.appendChild(a); a.click();
        window.URL.revokeObjectURL(url); document.body.removeChild(a);
        setPhase("done");
      } else {
        let msg = "";
        try { const d = await res.json(); msg = d.message || ""; } catch {}
        setErrorMessage(`Download failed: ${msg}`);
        setPhase("preview");
      }
    } catch (err) {
      stopTicker();
      setErrorMessage(`Download failed: ${err.message}`);
      setPhase("preview");
    }
  };

  const overall   = reportData?.sentimentAnalysis?.overall;
  const sentiment = overall?.sentiment || "neutral";
  const sentColor = SENTIMENT_COLORS[sentiment] || SENTIMENT_COLORS.neutral;

  return (
    <div style={{ fontFamily: "'Inter',sans-serif" }} className="min-h-screen bg-[#F4F6FB] flex flex-col">

      {/* Top banner */}
      {showBanner && (
        <div className="text-white py-2.5 px-4 flex justify-between items-center"
          style={{ background: "linear-gradient(90deg,#4F46E5,#7C3AED)" }}>
          <p className="flex-1 text-center text-sm font-medium">
            Want a report for your own business?{" "}
            <a href="/" className="font-bold underline underline-offset-2 ml-1">Get Started →</a>
          </p>
          <button onClick={() => setShowBanner(false)} className="text-white/70 hover:text-white ml-3">
            <IoMdClose size={18} />
          </button>
        </div>
      )}

      {/* Error toast */}
      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-red-100 shadow-2xl rounded-2xl p-4 max-w-sm flex gap-3">
          <span className="text-red-500 text-xl shrink-0">⚠️</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 text-sm">Error</p>
            <p className="text-xs text-red-600 mt-0.5 break-words">{errorMessage}</p>
          </div>
          <button onClick={() => setErrorMessage("")} className="text-gray-400 hover:text-gray-600 shrink-0">
            <IoMdClose size={16} />
          </button>
        </div>
      )}

      <div className="max-w-lg mx-auto w-full px-4 py-8 space-y-4 pb-28">

        {/* Profile header */}
        {isCombined
          ? <CombinedProfileHeader brandName={state.brandName} selectedPlatforms={selectedPlatforms} mode={state.mode} avatar={state.avatar} />
          : state.user && <SingleProfileHeader user={state.user} />
        }

        {/* ── IDLE ── */}
        {phase === "idle" && (
          <div className="bg-white rounded-3xl shadow-md p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                style={{ background: "linear-gradient(135deg,#EEF2FF,#E0E7FF)" }}>📋</div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "'Poppins',sans-serif" }}>
                  AI Reputation Report
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {isCombined
                    ? `Full scan across ${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? "s" : ""} — free for everyone.`
                    : "Full social media scan — free for everyone."}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { emoji: "🔍", title: "Deep Scan",  sub: "100+ signals",     bg: "#FFF7ED", accent: "#EA580C" },
                { emoji: "🧠", title: "GPT-4 AI",   sub: "Smart insights",   bg: "#F0FDF4", accent: "#16A34A" },
                { emoji: "📊", title: "Full PDF",   sub: "Instant download", bg: "#EFF6FF", accent: "#2563EB" },
              ].map(item => (
                <div key={item.title} className="rounded-2xl p-3 text-center" style={{ background: item.bg }}>
                  <div className="text-2xl mb-1">{item.emoji}</div>
                  <p className="text-xs font-bold" style={{ color: item.accent }}>{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>
            <button
              onClick={handleGenerateReport}
              className="w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2 text-base"
              style={{ fontFamily: "'Poppins',sans-serif", background: "linear-gradient(135deg,#4F46E5,#7C3AED)" }}
            >
              🔍 Generate Free Report
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">⏱ Takes 2–3 minutes · No credit card required</p>
          </div>
        )}

        {/* ── ANALYZING ── */}
        {phase === "analyzing" && (
          <div className="bg-white rounded-3xl shadow-md p-6">
            <div className="flex flex-col items-center mb-5">
              <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                <div className="absolute inset-0 rounded-full" style={{ border: "4px solid #EEF2FF" }} />
                <div className="absolute inset-0 rounded-full"
                  style={{ border: "4px solid transparent", borderTopColor: "#6366F1", borderRightColor: "#6366F1", animation: "spin 1s linear infinite" }} />
                <div className="absolute rounded-full"
                  style={{ inset: 8, border: "3px solid transparent", borderTopColor: "#A78BFA", animation: "spin 1.8s linear infinite reverse" }} />
                <span className="text-3xl">{STEPS[activeStep]?.emoji || "🔗"}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Poppins',sans-serif" }}>
                Analyzing reputation...
              </h3>
              <p className="text-sm text-gray-400 mt-1 text-center">{STEPS[activeStep]?.label}</p>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span className="font-medium">Progress</span>
                <span className="font-bold" style={{ color: "#6366F1" }}>{Math.round(progress)}%</span>
              </div>
              <div className="w-full rounded-full h-3 overflow-hidden" style={{ background: "#EEF2FF" }}>
                <div className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                  style={{ width: `${progress}%`, background: "linear-gradient(90deg,#6366F1,#8B5CF6,#A78BFA)" }}>
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)", animation: "shimmer 1.5s infinite" }} />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              {STEPS.map((step, i) => {
                const done   = i < activeStep;
                const active = i === activeStep;
                return (
                  <div key={step.id}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300"
                    style={{
                      background: active ? "#EEF2FF" : "transparent",
                      border: active ? "1px solid #C7D2FE" : "1px solid transparent",
                      opacity: !done && !active ? 0.3 : 1,
                    }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold"
                      style={{ background: done ? "#DCFCE7" : active ? "#EEF2FF" : "#F3F4F6", color: done ? "#16A34A" : active ? "#6366F1" : "#9CA3AF" }}>
                      {done ? "✓" : step.emoji}
                    </div>
                    <span className="text-sm flex-1"
                      style={{ fontWeight: active ? 600 : 400, color: done ? "#9CA3AF" : active ? "#4338CA" : "#6B7280", textDecoration: done ? "line-through" : "none" }}>
                      {step.label}
                    </span>
                    {active && (
                      <div className="flex gap-1">
                        {[0, 150, 300].map(d => (
                          <span key={d} className="w-1.5 h-1.5 rounded-full animate-bounce"
                            style={{ background: "#6366F1", animationDelay: `${d}ms` }} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">Please keep this tab open — usually 2–3 minutes</p>
          </div>
        )}

        {/* ── PREVIEW ── */}
        {(phase === "preview" || phase === "done") && reportData && (
          <>
            {/* Reputation score — visible free */}
            <div className="bg-white rounded-3xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Poppins',sans-serif" }}>
                  Reputation Score
                </h2>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5"
                  style={{ background: sentColor.bg, color: sentColor.text }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: sentColor.dot }} />
                  {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-28 h-28 rounded-full flex flex-col items-center justify-center shrink-0"
                  style={{ background: scoreBg(overall?.score), border: `4px solid ${scoreColor(overall?.score)}` }}>
                  <span className="text-4xl font-black" style={{ color: scoreColor(overall?.score), fontFamily: "'Poppins',sans-serif" }}>
                    {overall?.score ?? "—"}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">/10</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">Top Strengths</p>
                  <ul className="space-y-1.5">
                    {(overall?.key_positives || []).slice(0, 3).map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Unlock CTA */}
            <div className="bg-white rounded-3xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg,#4F46E5,#7C3AED)" }}>
                  <FaLock style={{ color: "#fff", fontSize: 14 }} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base leading-tight" style={{ fontFamily: "'Poppins',sans-serif" }}>
                    Full report is ready
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Competitor analysis · Action plan · 12-month trends · PDF
                  </p>
                </div>
              </div>
              <button
                onClick={handleUnlock}
                className="w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2 text-base"
                style={{ fontFamily: "'Poppins',sans-serif", background: "linear-gradient(135deg,#4F46E5,#7C3AED)" }}
              >
                <FaEnvelope style={{ fontSize: 14 }} />
                {capturedEmail ? "Download Full Report →" : "Get Full Report — Free →"}
              </button>
              <div className="flex items-center justify-center gap-5 mt-3">
                {["🔒 Private", "✅ No spam", "📄 Free PDF"].map(t => (
                  <span key={t} className="text-xs text-gray-400">{t}</span>
                ))}
              </div>
            </div>

            {/* Blurred locked content preview */}
            <div className="relative overflow-hidden rounded-3xl" style={{ maxHeight: 220 }}>
              <div className="space-y-4" style={{ filter: "blur(5px)", pointerEvents: "none", userSelect: "none" }}>
                <div className="bg-white rounded-3xl shadow-md p-6">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Key Weaknesses & More Strengths</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-green-600 mb-2">More Strengths</p>
                      <ul className="space-y-1.5">
                        {(overall?.key_positives || []).slice(3).map((p, i) => (
                          <li key={i} className="text-xs text-gray-600 flex gap-1.5"><span className="text-green-500">✓</span>{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-red-500 mb-2">Areas to Improve</p>
                      <ul className="space-y-1.5">
                        {(overall?.key_negatives || []).map((n, i) => (
                          <li key={i} className="text-xs text-gray-600 flex gap-1.5"><span className="text-red-400">✗</span>{n}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-3xl shadow-md p-6">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Competitor Benchmarking</h3>
                  <div className="space-y-3">
                    {(reportData?.competitorsSentimentAnalysis || []).map((c, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-sm font-bold text-indigo-600">
                          {c.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                          <p className="text-xs text-gray-400 capitalize">{c.sentiment}</p>
                        </div>
                        <span className="text-sm font-bold" style={{ color: scoreColor(c.rating) }}>{c.rating}/10</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-24"
                style={{ background: "linear-gradient(to bottom, rgba(244,246,251,0), rgba(244,246,251,1))" }} />
            </div>
          </>
        )}

        {/* ── DOWNLOADING ── */}
        {phase === "downloading" && (
          <>
            <div className="bg-white rounded-3xl shadow-md p-6">
              <div className="flex flex-col items-center mb-5">
                <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                  <div className="absolute inset-0 rounded-full" style={{ border: "4px solid #EEF2FF" }} />
                  <div className="absolute inset-0 rounded-full"
                    style={{ border: "4px solid transparent", borderTopColor: "#6366F1", borderRightColor: "#6366F1", animation: "spin 1s linear infinite" }} />
                  <span className="text-3xl">📄</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Poppins',sans-serif" }}>
                  Building your PDF...
                </h3>
                <p className="text-sm text-gray-400 mt-1">Compiling all insights into your report</p>
              </div>
              <div className="w-full rounded-full h-3 overflow-hidden mb-2" style={{ background: "#EEF2FF" }}>
                <div className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress}%`, background: "linear-gradient(90deg,#6366F1,#8B5CF6,#A78BFA)" }} />
              </div>
              <p className="text-center text-xs text-gray-400">{Math.round(progress)}% · Please keep this tab open</p>
            </div>

            {/* Upsell while waiting */}
            {!upsellDismissed && (
              <div className="rounded-3xl shadow-md overflow-hidden"
                style={{ background: "linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4338ca 100%)" }}>
                <div className="p-6 relative">
                  <button onClick={() => setUpsellDismissed(true)}
                    className="absolute top-4 right-4 text-white/40 hover:text-white/80">
                    <IoMdClose size={18} />
                  </button>
                  <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2">While you wait</p>
                  <h3 className="text-xl font-bold text-white mb-1 pr-6" style={{ fontFamily: "'Poppins',sans-serif" }}>
                    Track {displayName}'s reputation over time
                  </h3>
                  <p className="text-sm text-indigo-200 mb-4 leading-relaxed">
                    This is a one-time snapshot. Save it and re-run anytime to watch how reputation changes.
                  </p>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { emoji: "📂", label: "Saved Reports",  sub: "All in one place" },
                      { emoji: "🔄", label: "Re-run Anytime", sub: "Fresh data always" },
                      { emoji: "📈", label: "Track Trends",   sub: "See changes over time" },
                    ].map(item => (
                      <div key={item.label} className="rounded-2xl p-3 text-center"
                        style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div className="text-xl mb-1">{item.emoji}</div>
                        <p className="text-xs font-bold text-white">{item.label}</p>
                        <p className="text-[10px] text-indigo-300 mt-0.5">{item.sub}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate("/signup", { state: { prefillEmail: capturedEmail } })}
                    className="w-full font-bold py-3.5 rounded-2xl text-indigo-700 text-sm hover:opacity-90"
                    style={{ fontFamily: "'Poppins',sans-serif", background: "#fff" }}
                  >
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
            <div className="bg-white rounded-3xl shadow-md p-6 text-center">
              <div className="text-5xl mb-3">✅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Poppins',sans-serif" }}>
                PDF Downloaded!
              </h3>
              <p className="text-sm text-gray-500">Your download started automatically.</p>
              {capturedEmail && (
                <p className="text-xs text-green-600 font-medium mt-2">✉️ Report also sent to {capturedEmail}</p>
              )}
              <button onClick={() => setPhase("preview")}
                className="mt-4 text-indigo-600 text-sm font-semibold hover:underline">
                ← Back to preview
              </button>
            </div>

            {!upsellDismissed && (
              <div className="bg-white rounded-3xl shadow-md p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-2xl"
                  style={{ background: "linear-gradient(135deg,#EEF2FF,#E0E7FF)" }}>📂</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">Save this report to your account</p>
                  <p className="text-xs text-gray-400 mt-0.5">Free · Takes 30 seconds</p>
                </div>
                <button
                  onClick={() => navigate("/signup", { state: { prefillEmail: capturedEmail } })}
                  className="text-white text-xs font-bold px-4 py-2 rounded-xl shrink-0 hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#4F46E5,#7C3AED)" }}
                >
                  Sign Up →
                </button>
              </div>
            )}
          </>
        )}

      </div>

      {/* Email modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
            <button onClick={() => setShowEmailModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <IoMdClose size={20} />
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "linear-gradient(135deg,#EEF2FF,#E0E7FF)" }}>
                <FaEnvelope style={{ color: "#6366F1", fontSize: 28 }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Poppins',sans-serif" }}>
                Where should we send your report?
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Enter your email to unlock the full PDF — competitor analysis, action plan + trends. 100% free.
              </p>
            </div>
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <input
                type="email" required autoFocus
                placeholder="name@company.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setModalError(""); }}
                className="w-full px-4 py-3.5 rounded-xl border text-sm outline-none transition-all"
                style={{ borderColor: modalError ? "#EF4444" : "#E0E7FF" }}
                onFocus={e => { e.target.style.borderColor = "#6366F1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)"; }}
                onBlur={e => { e.target.style.borderColor = modalError ? "#EF4444" : "#E0E7FF"; e.target.style.boxShadow = "none"; }}
              />
              {modalError && (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1.5">⚠️ {modalError}</p>
              )}
              <button
                type="submit"
                className="w-full text-white font-bold py-3.5 rounded-xl transition-all hover:opacity-90"
                style={{ fontFamily: "'Poppins',sans-serif", background: "linear-gradient(135deg,#4F46E5,#7C3AED)" }}
              >
                Unlock Full Report →
              </button>
            </form>
            <div className="flex items-center justify-center gap-4 mt-4">
              {["🔒 Private", "✅ No spam", "📄 Free PDF"].map(t => (
                <span key={t} className="text-xs text-gray-400">{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
      `}</style>
    </div>
  );
}
