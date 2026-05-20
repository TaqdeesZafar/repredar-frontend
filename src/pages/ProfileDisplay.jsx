import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import {
  FaFacebook, FaInstagram, FaXTwitter, FaLinkedin, FaTiktok,
} from "react-icons/fa6";
import { FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { isTokenExpired } from "../utils/token";

const getLoggedInEmail = () => {
  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.email || null;
  } catch {
    return null;
  }
};

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

const PLATFORMS = {
  x:               { label: "X / Twitter",    Icon: FaXTwitter,  bg: "#000000",  iconColor: "#fff" },
  tiktok:          { label: "TikTok",         Icon: FaTiktok,    bg: "#010101",  iconColor: "#fff" },
  instagram:       { label: "Instagram",      Icon: FaInstagram, bg: "linear-gradient(135deg,#833AB4,#C13584,#F56040)", iconColor: "#fff" },
  facebook:        { label: "Facebook",       Icon: FaFacebook,  bg: "#1877F2",  iconColor: "#fff" },
  linkedin:        { label: "LinkedIn",       Icon: FaLinkedin,  bg: "#0A66C2",  iconColor: "#fff" },
  "google-business": { label: "Google",       Icon: FaGoogle,    bg: "#fff",     iconColor: "#4285F4", border: "1px solid #e2e8f0" },
  crossplateform:  { label: "Multi-Platform", Icon: null,        bg: "#6366f1",  iconColor: "#fff" },
};

const getPlatformCfg = (key = "x") => PLATFORMS[key.toLowerCase()] || PLATFORMS.x;

const SENTIMENT_COLORS = {
  positive: { bg: "#F0FDF4", text: "#16A34A", dot: "#22C55E" },
  neutral:  { bg: "#FEFCE8", text: "#CA8A04", dot: "#EAB308" },
  negative: { bg: "#FEF2F2", text: "#DC2626", dot: "#EF4444" },
};

const scoreColor = (s) => s >= 7 ? "#16A34A" : s >= 5 ? "#CA8A04" : "#DC2626";
const scoreBg    = (s) => s >= 7 ? "#F0FDF4" : s >= 5 ? "#FEFCE8" : "#FEF2F2";

export default function ProfileDisplay() {
  const location = useLocation();

  const [showBanner,        setShowBanner]        = useState(true);
  const [userData,          setUserData]          = useState(null);
  const [errorMessage,      setErrorMessage]      = useState("");

  // phase: idle | analyzing | preview | downloading | done
  const [phase,             setPhase]             = useState("idle");
  const [progress,          setProgress]          = useState(0);
  const [activeStep,        setActiveStep]        = useState(0);
  const [reportData,        setReportData]        = useState(null);
  const [showEmailModal,    setShowEmailModal]    = useState(false);
  const [email,             setEmail]             = useState("");
  const [capturedEmail,     setCapturedEmail]     = useState(() => localStorage.getItem("capturedEmail") || "");
  const [isGuestUser,       setIsGuestUser]       = useState(false);
  const [upsellDismissed,   setUpsellDismissed]   = useState(false);
  const [modalError,        setModalError]        = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const pending = localStorage.getItem("pendingReportData");
    if (pending) {
      const d = JSON.parse(pending);
      if (d.user) { setUserData(d.user); localStorage.setItem("profileData", JSON.stringify(d.user)); }
      localStorage.removeItem("pendingReportData");
    } else if (location?.state?.user) {
      localStorage.setItem("profileData", JSON.stringify(location.state.user));
      setUserData(location.state.user);
    } else {
      const stored = localStorage.getItem("profileData");
      if (stored) {
        setUserData(JSON.parse(stored));
      } else if (location?.state?.brandName) {
        const u = { name: location.state.brandName, platform: "crossplateform" };
        localStorage.setItem("profileData", JSON.stringify(u));
        setUserData(u);
      } else {
        const u = { name: "Demo Brand", screen_name: "DemoBrand", platform: "X" };
        localStorage.setItem("profileData", JSON.stringify(u));
        setUserData(u);
      }
    }
  }, [location.state]);

  const buildAnalyzeUrl = (plt) => {
    const base = import.meta.env.VITE_BACKEND_URL;
    if (plt === "google-business") {
      const bId = location?.state?.business_id || userData?.business_id || "";
      return `${base}/google/fetch-analyze-businesses?query=${encodeURIComponent(userData?.name || "")}&business_id=${encodeURIComponent(bId)}`;
    }
    if (plt === "linkedin") {
      return `${base}/linkedin/fetch-analyze-posts?url=${encodeURIComponent(userData?.url || "")}&query=${encodeURIComponent(userData?.name || userData?.full_name || "")}`;
    }
    if (plt === "tiktok") {
      return `${base}/tiktok/fetch-analyze-posts?secUid=${encodeURIComponent(userData?.sec_uid || "")}&query=${encodeURIComponent(userData?.name || "")}`;
    }
    if (plt === "facebook") {
      const param = location?.state?.subtab === "Profiles" ? "profile_id" : "page_id";
      return `${base}/facebook/fetch-analyze-posts?${param}=${encodeURIComponent(userData?.facebook_id || "")}&query=${encodeURIComponent(userData?.name || "")}`;
    }
    if (plt === "instagram") {
      return `${base}/instagram/fetch-analyze-posts?query=@${encodeURIComponent(userData?.screen_name || "")}`;
    }
    if (plt === "x") {
      return `${base}/twitter/fetch-analyze-tweets?query=@${encodeURIComponent(userData?.screen_name || "")}`;
    }
    const urls = location?.state?.urls || {};
    const nonEmpty = Object.entries(urls)
      .filter(([, v]) => String(v).trim() !== "")
      .map(([k, v]) => `${encodeURIComponent(k === "X" ? "twitter" : k.toLowerCase())}=${encodeURIComponent(String(v).trim())}`)
      .join("&");
    if (!nonEmpty) return null;
    let params = nonEmpty;
    if (urls.Facebook && location?.state?.facebookType) params += `&facebookType=${encodeURIComponent(location.state.facebookType)}`;
    return `${base}/crossplatform/fetch-analyze-posts?${params}&query=${encodeURIComponent(location.state?.brandName || "")}`;
  };

  const buildPdfUrl = (plt) => {
    const base = import.meta.env.VITE_BACKEND_URL;
    if (plt === "google-business") {
      const bId = location?.state?.business_id || userData?.business_id || "";
      return `${base}/google/generate-pdf-report?query=${encodeURIComponent(userData?.name || "")}&business_id=${encodeURIComponent(bId)}`;
    }
    if (plt === "linkedin") {
      return `${base}/linkedin/generate-pdf-report?url=${encodeURIComponent(userData?.url || "")}&query=${encodeURIComponent(userData?.name || userData?.full_name || "")}`;
    }
    if (plt === "tiktok") {
      return `${base}/tiktok/generate-pdf-report?secUid=${encodeURIComponent(userData?.sec_uid || "")}&query=${encodeURIComponent(userData?.name || "")}`;
    }
    if (plt === "facebook") {
      const param = location?.state?.subtab === "Profiles" ? "profile_id" : "page_id";
      return `${base}/facebook/generate-pdf-report?${param}=${encodeURIComponent(userData?.facebook_id || "")}&query=${encodeURIComponent(userData?.name || "")}`;
    }
    if (plt === "instagram") {
      return `${base}/instagram/generate-pdf-report?query=@${encodeURIComponent(userData?.screen_name || "")}`;
    }
    if (plt === "x") {
      return `${base}/twitter/generate-pdf-report?query=@${encodeURIComponent(userData?.screen_name || "")}`;
    }
    const urls = location?.state?.urls || {};
    const nonEmpty = Object.entries(urls)
      .filter(([, v]) => String(v).trim() !== "")
      .map(([k, v]) => `${encodeURIComponent(k === "X" ? "twitter" : k.toLowerCase())}=${encodeURIComponent(String(v).trim())}`)
      .join("&");
    if (!nonEmpty) return null;
    let params = nonEmpty;
    if (urls.Facebook && location?.state?.facebookType) params += `&facebookType=${encodeURIComponent(location.state.facebookType)}`;
    return `${base}/crossplatform/generate-pdf-report?${params}&query=${encodeURIComponent(location.state?.brandName || "")}`;
  };

  const handleGenerateReport = async () => {
    if (phase === "analyzing" || phase === "downloading") return;
    setPhase("analyzing");
    setProgress(0);
    setActiveStep(0);
    setErrorMessage("");

    const plt = (location?.state?.platform || userData?.platform || "X").toLowerCase();
    const analyzeUrl = buildAnalyzeUrl(plt);
    if (!analyzeUrl) { setErrorMessage("No URLs provided for cross-platform report"); setPhase("idle"); return; }

    const startTime = Date.now();
    const totalMs = 170000;
    const ticker = setInterval(() => {
      const pct = Math.min(90 * (1 - Math.pow(1 - Math.min((Date.now() - startTime) / totalMs, 1), 2.2)), 90);
      setProgress(pct);
      setActiveStep(Math.max(0, STEPS.filter(s => s.threshold <= pct).length - 1));
    }, 400);

    try {
      const res = await fetch(analyzeUrl);
      clearInterval(ticker);
      if (res.ok) {
        const data = await res.json();
        setProgress(100);
        setActiveStep(STEPS.length - 1);
        setReportData(data);
        setTimeout(() => setPhase("preview"), 600);
      } else {
        let msg = "";
        try { const d = await res.json(); msg = d.message || d.error || ""; } catch { msg = res.statusText; }
        setErrorMessage(`Failed to generate report: ${msg}`);
        setPhase("idle");
      }
    } catch (err) {
      clearInterval(ticker);
      setErrorMessage(`Failed to generate report: ${err.message || "Network error"}`);
      setPhase("idle");
    }
  };

  const handleUnlock = () => {
    const loggedInEmail = getLoggedInEmail();
    if (loggedInEmail) {
      // Logged-in user — skip modal entirely
      setCapturedEmail(loggedInEmail);
      setIsGuestUser(false);
      downloadPdf(loggedInEmail);
      return;
    }
    // Guest — always show email modal
    setModalError("");
    setEmail(localStorage.getItem("capturedEmail") || "");
    setShowEmailModal(true);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    localStorage.setItem("capturedEmail", email);
    setCapturedEmail(email);
    setIsGuestUser(true);
    setShowEmailModal(false);
    downloadPdf(email);
  };

  const downloadPdf = async (email) => {
    const plt = (location?.state?.platform || userData?.platform || "X").toLowerCase();
    const basePdfUrl = buildPdfUrl(plt);
    if (!basePdfUrl) { setErrorMessage("No URLs provided"); return; }
    const pdfUrl = `${basePdfUrl}&email=${encodeURIComponent(email)}`;

    setPhase("downloading");
    setProgress(0);
    setErrorMessage("");

    const startTime = Date.now();
    const totalMs = 170000;
    const ticker = setInterval(() => {
      const pct = Math.min(90 * (1 - Math.pow(1 - Math.min((Date.now() - startTime) / totalMs, 1), 2.2)), 90);
      setProgress(pct);
    }, 400);

    try {
      const res = await fetch(pdfUrl);
      clearInterval(ticker);
      if (res.ok) {
        const blob = await res.blob();
        setProgress(100);
        const identifier = plt === "crossplateform" ? "crossplatform" : userData?.screen_name || userData?.name || "report";
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none"; a.href = url;
        a.download = `${identifier}_reputation_report.pdf`;
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
      clearInterval(ticker);
      setErrorMessage(`Download failed: ${err.message}`);
      setPhase("preview");
    }
  };

  const getDisplayName = () => {
    if (!userData) return "";
    if (userData.platform === "crossplateform") return location?.state?.brandName || "Cross Platform";
    return userData.name || userData.screen_name || "User";
  };
  const getHandle = () => {
    if (!userData) return "";
    if (userData.platform === "linkedin")       return userData.headline || "";
    if (userData.platform === "crossplateform") return "Cross-Platform Analysis";
    return userData.screen_name ? `@${userData.screen_name}` : "";
  };

  const platformKey = (location?.state?.platform || userData?.platform || "x").toLowerCase();
  const cfg         = getPlatformCfg(platformKey);
  const overall     = reportData?.sentimentAnalysis?.overall;
  const sentiment   = overall?.sentiment || "neutral";
  const sentColor   = SENTIMENT_COLORS[sentiment] || SENTIMENT_COLORS.neutral;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="min-h-screen bg-[#F4F6FB] flex flex-col">

      {/* Banner */}
      {showBanner && (
        <div className="text-white py-2.5 px-4 flex justify-between items-center" style={{ background: "linear-gradient(90deg,#4F46E5,#7C3AED)" }}>
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
            <p className="font-semibold text-gray-800 text-sm">Report Error</p>
            <p className="text-xs text-red-600 mt-0.5 break-words">{errorMessage}</p>
          </div>
          <button onClick={() => setErrorMessage("")} className="text-gray-400 hover:text-gray-600 shrink-0 self-start">
            <IoMdClose size={16} />
          </button>
        </div>
      )}

      <div className="max-w-lg mx-auto w-full px-4 py-10 space-y-5 pb-32">

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-md">
          <div className="h-28 relative rounded-t-3xl overflow-hidden" style={{ background: "linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4338ca 100%)" }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%,#fff 1px,transparent 1px),radial-gradient(circle at 80% 50%,#fff 1px,transparent 1px)", backgroundSize: "30px 30px" }} />
          </div>
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-10 mb-4 relative z-10">
              {userData?.avatar ? (
                <img
                  src={userData.avatar}
                  alt={getDisplayName()}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-xl object-cover"
                  onError={e => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }}
                />
              ) : null}
              <div
                className="w-20 h-20 rounded-full border-4 border-white shadow-xl items-center justify-center text-3xl font-bold text-white"
                style={{ background: cfg.bg, display: userData?.avatar ? 'none' : 'flex' }}
              >
                {cfg.Icon ? <cfg.Icon style={{ color: cfg.iconColor, fontSize: 30 }} /> : getDisplayName().charAt(0).toUpperCase()}
              </div>
              <div className="mb-2 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: cfg.bg, border: cfg.border || "none", color: cfg.iconColor }}>
                {cfg.Icon && <cfg.Icon style={{ color: cfg.iconColor, fontSize: 12 }} />}
                <span style={{ color: cfg.iconColor }}>{cfg.label}</span>
              </div>
            </div>
            <h1 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-2xl font-bold text-gray-900">{getDisplayName()}</h1>
            {getHandle() && <p className="text-sm text-gray-400 mt-0.5">{getHandle()}</p>}
            {userData?.follower_count > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex gap-6">
                <div>
                  <p className="text-lg font-bold text-gray-800">{Number(userData.follower_count).toLocaleString()}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Followers</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── IDLE ── */}
        {phase === "idle" && (
          <div className="bg-white rounded-3xl shadow-md p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0" style={{ background: "linear-gradient(135deg,#EEF2FF,#E0E7FF)" }}>📋</div>
              <div>
                <h2 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-xl font-bold text-gray-900 leading-tight">AI Reputation Report</h2>
                <p className="text-sm text-gray-500 mt-1">Full social media scan — free for everyone.</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { emoji: "🔍", title: "Deep Scan",  sub: "100+ signals",     bg: "#FFF7ED", accent: "#EA580C" },
                { emoji: "🧠", title: "GPT‑4 AI",   sub: "Smart insights",   bg: "#F0FDF4", accent: "#16A34A" },
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
              className="w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-base hover:opacity-90 active:scale-[0.98]"
              style={{ fontFamily: "'Poppins', sans-serif", background: "linear-gradient(135deg,#4F46E5,#7C3AED)" }}
            >
              🔍 Generate Free Report
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">⏱ Takes 2–3 minutes · No credit card required</p>
          </div>
        )}

        {/* ── ANALYZING ── */}
        {phase === "analyzing" && (
          <div className="bg-white rounded-3xl shadow-md p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                <div className="absolute inset-0 rounded-full" style={{ border: "4px solid #EEF2FF" }} />
                <div className="absolute inset-0 rounded-full" style={{ border: "4px solid transparent", borderTopColor: "#6366F1", borderRightColor: "#6366F1", animation: "spin 1s linear infinite" }} />
                <div className="absolute rounded-full" style={{ inset: 8, border: "3px solid transparent", borderTopColor: "#A78BFA", animation: "spin 1.8s linear infinite reverse" }} />
                <span className="text-3xl">{STEPS[activeStep]?.emoji || "🔗"}</span>
              </div>
              <h3 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-xl font-bold text-gray-900">Analyzing reputation...</h3>
              <p className="text-sm text-gray-400 mt-1 text-center">{STEPS[activeStep]?.label || "Starting up..."}</p>
            </div>
            <div className="mb-5">
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span className="font-medium">Progress</span>
                <span className="font-bold" style={{ color: "#6366F1" }}>{Math.round(progress)}%</span>
              </div>
              <div className="w-full rounded-full h-3 overflow-hidden" style={{ background: "#EEF2FF" }}>
                <div className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                  style={{ width: `${progress}%`, background: "linear-gradient(90deg,#6366F1,#8B5CF6,#A78BFA)" }}>
                  <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)", animation: "shimmer 1.5s infinite" }} />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              {STEPS.map((step, i) => {
                const done   = i < activeStep;
                const active = i === activeStep;
                return (
                  <div key={step.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300"
                    style={{ background: active ? "#EEF2FF" : "transparent", border: active ? "1px solid #C7D2FE" : "1px solid transparent", opacity: !done && !active ? 0.3 : 1 }}>
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
                          <span key={d} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#6366F1", animationDelay: `${d}ms` }} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-center text-xs text-gray-400 mt-5">Please keep this tab open — usually 2–3 minutes</p>
          </div>
        )}

        {/* ── PREVIEW ── */}
        {(phase === "preview" || phase === "done") && reportData && (
          <>
            {/* Score — FREE */}
            <div className="bg-white rounded-3xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-lg font-bold text-gray-900">Reputation Score</h2>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5" style={{ background: sentColor.bg, color: sentColor.text }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: sentColor.dot }} />
                  {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-28 h-28 rounded-full flex flex-col items-center justify-center shrink-0"
                  style={{ background: scoreBg(overall?.score), border: `4px solid ${scoreColor(overall?.score)}` }}>
                  <span className="text-4xl font-black" style={{ color: scoreColor(overall?.score), fontFamily: "'Poppins', sans-serif" }}>
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

            {/* Unlock CTA — visible immediately after score */}
            <div className="bg-white rounded-3xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg,#4F46E5,#7C3AED)" }}>
                  <FaLock style={{ color: "#fff", fontSize: 14 }} />
                </div>
                <div>
                  <p style={{ fontFamily: "'Poppins', sans-serif" }} className="font-bold text-gray-900 text-base leading-tight">Full report is ready</p>
                  <p className="text-xs text-gray-400 mt-0.5">Competitor analysis · Action plan · 12-month trends · PDF</p>
                </div>
              </div>
              <button
                onClick={handleUnlock}
                className="w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2 text-base"
                style={{ fontFamily: "'Poppins', sans-serif", background: "linear-gradient(135deg,#4F46E5,#7C3AED)" }}
              >
                <FaEnvelope style={{ fontSize: 14 }} />
                Get Full Report — Free →
              </button>
              <div className="flex items-center justify-center gap-5 mt-3">
                {["🔒 Private", "✅ No spam", "📄 Free PDF"].map(t => (
                  <span key={t} className="text-xs text-gray-400">{t}</span>
                ))}
              </div>
            </div>

            {/* Blurred preview of locked content */}
            <div className="relative overflow-hidden rounded-3xl" style={{ maxHeight: 220 }}>
              <div className="space-y-5" style={{ filter: "blur(5px)", pointerEvents: "none", userSelect: "none" }}>
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
                        <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-sm font-bold text-indigo-600">{c.name?.[0]?.toUpperCase()}</div>
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
              {/* Fade to white at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-24" style={{ background: "linear-gradient(to bottom, rgba(244,246,251,0), rgba(244,246,251,1))" }} />
            </div>
          </>
        )}

        {/* ── DOWNLOADING ── */}
        {phase === "downloading" && (
          <>
            <div className="bg-white rounded-3xl shadow-md p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                  <div className="absolute inset-0 rounded-full" style={{ border: "4px solid #EEF2FF" }} />
                  <div className="absolute inset-0 rounded-full" style={{ border: "4px solid transparent", borderTopColor: "#6366F1", borderRightColor: "#6366F1", animation: "spin 1s linear infinite" }} />
                  <span className="text-3xl">📄</span>
                </div>
                <h3 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-xl font-bold text-gray-900">Building your PDF...</h3>
                <p className="text-sm text-gray-400 mt-1">Compiling all insights into your report</p>
              </div>
              <div className="w-full rounded-full h-3 overflow-hidden mb-2" style={{ background: "#EEF2FF" }}>
                <div className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress}%`, background: "linear-gradient(90deg,#6366F1,#8B5CF6,#A78BFA)" }} />
              </div>
              <p className="text-center text-xs text-gray-400">{Math.round(progress)}% · Please keep this tab open</p>
            </div>

            {/* Upsell shown while user waits for PDF — only for guests */}
            {isGuestUser && !upsellDismissed && !getLoggedInEmail() && (
              <div className="rounded-3xl shadow-md overflow-hidden" style={{ background: "linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4338ca 100%)" }}>
                <div className="p-6 relative">
                  <button onClick={() => setUpsellDismissed(true)} className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors">
                    <IoMdClose size={18} />
                  </button>
                  <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2">While you wait</p>
                  <h3 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-xl font-bold text-white mb-1 pr-6">
                    Track {getDisplayName()}'s reputation over time
                  </h3>
                  <p className="text-sm text-indigo-200 mb-5 leading-relaxed">
                    This report is a one-time snapshot. Create a free account to save it, re-run reports anytime, and watch how reputation changes.
                  </p>
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      { emoji: "📂", label: "Saved Reports", sub: "All in one place" },
                      { emoji: "🔄", label: "Re-run Anytime", sub: "Fresh data always" },
                      { emoji: "📈", label: "Track Trends",   sub: "See changes over time" },
                    ].map(item => (
                      <div key={item.label} className="rounded-2xl p-3 text-center" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div className="text-xl mb-1">{item.emoji}</div>
                        <p className="text-xs font-bold text-white">{item.label}</p>
                        <p className="text-[10px] text-indigo-300 mt-0.5">{item.sub}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate("/signup", { state: { prefillEmail: capturedEmail } })}
                    className="w-full font-bold py-3.5 rounded-2xl transition-all hover:opacity-90 active:scale-[0.98] text-indigo-700 text-sm"
                    style={{ fontFamily: "'Poppins', sans-serif", background: "#fff" }}
                  >
                    Create Free Account →
                  </button>
                  <p className="text-center text-xs text-indigo-300 mt-3">
                    Already have an account?{" "}
                    <button onClick={() => navigate("/login")} className="text-white font-semibold hover:underline">Sign in</button>
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── DONE ── */}
        {phase === "done" && (
          <>
            {/* Success card */}
            <div className="bg-white rounded-3xl shadow-md p-6 text-center">
              <div className="text-5xl mb-3">✅</div>
              <h3 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-xl font-bold text-gray-900 mb-1">PDF Downloaded!</h3>
              <p className="text-sm text-gray-500">Your download started automatically.</p>
              {capturedEmail && (
                <p className="text-xs text-green-600 font-medium mt-2">✉️ Report also sent to {capturedEmail}</p>
              )}
              <button onClick={() => setPhase("preview")} className="mt-4 text-indigo-600 text-sm font-semibold hover:underline">
                ← Back to report preview
              </button>
            </div>

            {/* Compact repeat CTA if upsell wasn't dismissed — only for guests */}
            {isGuestUser && !upsellDismissed && !getLoggedInEmail() && (
              <div className="bg-white rounded-3xl shadow-md p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-2xl" style={{ background: "linear-gradient(135deg,#EEF2FF,#E0E7FF)" }}>📂</div>
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

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
            <button onClick={() => setShowEmailModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <IoMdClose size={20} />
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg,#EEF2FF,#E0E7FF)" }}>
                <FaEnvelope style={{ color: "#6366F1", fontSize: 28 }} />
              </div>
              <h3 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-xl font-bold text-gray-900">
                Where should we send your report?
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Enter your email to unlock competitor analysis, action plan + get the full PDF — 100% free.
              </p>
            </div>
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <input
                type="email" required placeholder="name@company.com" value={email}
                onChange={e => { setEmail(e.target.value); setModalError(""); }}
                className="w-full px-4 py-3.5 rounded-xl border text-sm outline-none transition-all"
                style={{ borderColor: modalError ? "#EF4444" : "#E0E7FF" }}
                onFocus={e => { e.target.style.borderColor = "#6366F1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)"; }}
                onBlur={e => { e.target.style.borderColor = modalError ? "#EF4444" : "#E0E7FF"; e.target.style.boxShadow = "none"; }}
              />
              {modalError && (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1.5">
                  <span>⚠️</span> {modalError}
                </p>
              )}
              <button
                type="submit"
                className="w-full text-white font-bold py-3.5 rounded-xl transition-all hover:opacity-90"
                style={{ fontFamily: "'Poppins', sans-serif", background: "linear-gradient(135deg,#4F46E5,#7C3AED)" }}
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
