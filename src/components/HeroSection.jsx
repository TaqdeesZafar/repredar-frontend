import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ─── Platform definitions ─────────────────────────────────────────────────────
const PLATFORMS = [
  { id: "twitter",   label: "X",         color: "bg-black" },
  { id: "instagram", label: "Instagram",  color: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400" },
  { id: "tiktok",    label: "TikTok",     color: "bg-black" },
  { id: "facebook",  label: "Facebook",   color: "bg-blue-600" },
  { id: "linkedin",  label: "LinkedIn",   color: "bg-blue-700" },
  { id: "google",    label: "Google",     color: "bg-white border border-gray-200" },
];

function PlatformIcon({ id, className = "w-4 h-4" }) {
  if (id === "twitter") return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
  if (id === "linkedin") return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
  if (id === "tiktok") return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  );
  if (id === "facebook") return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
  if (id === "instagram") return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162S8.597 18.163 12 18.163s6.162-2.759 6.162-6.162S15.403 5.838 12 5.838zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
  if (id === "google") return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
  return null;
}

// ─── Animated platform badge strip ───────────────────────────────────────────
function PlatformStrip() {
  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      {PLATFORMS.filter(p => p.id !== "google").map(p => (
        <div key={p.id}
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm ${p.color}`}>
          <PlatformIcon id={p.id} className="w-4 h-4" />
        </div>
      ))}
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm bg-white border border-gray-200">
        <PlatformIcon id="google" className="w-4 h-4" />
      </div>
    </div>
  );
}

// ─── The hero search form ─────────────────────────────────────────────────────
function HeroSearchForm() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [username, setUsername]       = useState("");
  const [mode, setMode]               = useState("company");
  const [activePlatforms, setActive]  = useState(new Set(PLATFORMS.map(p => p.id)));
  const [location, setLocation]       = useState("");
  const [showAdvanced, setShowAdv]    = useState(false);
  const [perPlatform, setPerPlatform] = useState({});

  const googleActive = activePlatforms.has("google");

  const togglePlatform = (id) => {
    setActive(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Google Business is only relevant for companies — auto-toggle when mode changes
  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === "person") {
      setActive(prev => {
        const next = new Set(prev);
        next.delete("google");
        return next;
      });
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
    navigate("/search", {
      state: {
        username: username.trim(),
        mode,
        platforms: [...activePlatforms],
        handles,
        googleLocation: location.trim(),
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Enter name or username…"
          className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-gray-900 text-lg transition-colors bg-white shadow-sm"
        />
        {username && (
          <button type="button" onClick={() => setUsername("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Account type toggle */}
      <div className="flex gap-2">
        {[
          { id: "company", emoji: "🏢", label: "Business / Brand" },
          { id: "person",  emoji: "👤", label: "Person / Influencer" },
        ].map(opt => (
          <button
            key={opt.id}
            type="button"
            onClick={() => handleModeChange(opt.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
              mode === opt.id
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 text-gray-500 hover:border-gray-300 bg-white"
            }`}
          >
            <span>{opt.emoji}</span> {opt.label}
          </button>
        ))}
      </div>

      {/* Platform chips */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Platforms to check</p>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map(p => {
            const active = activePlatforms.has(p.id);
            const isGoogle = p.id === "google";
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => togglePlatform(p.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                  active
                    ? isGoogle
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-400 bg-white hover:border-gray-300"
                }`}
              >
                <PlatformIcon id={p.id} className="w-3 h-3" />
                {p.label}
                {active && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Google location field — shown only when Google is active */}
      {googleActive && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="City or location for Google Business (e.g. New York)"
            className="flex-1 bg-transparent text-sm text-gray-700 focus:outline-none placeholder-gray-400"
          />
        </div>
      )}

      {/* Per-platform usernames */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdv(v => !v)}
          className="w-full flex items-center gap-2.5 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
        >
          <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800">Different username on some platforms?</p>
            <p className="text-xs text-gray-500 mt-0.5">e.g. @nike on Instagram but Nike Inc on LinkedIn</p>
          </div>
          <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showAdvanced && (
          <div className="px-4 py-3 space-y-2 bg-white border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Leave blank to use the name above. Only fill in if different.</p>
            {[...activePlatforms].filter(id => id !== "google").map(id => {
              const pl = PLATFORMS.find(p => p.id === id);
              return (
                <div key={id} className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white flex-shrink-0 ${
                    id === "google" ? "bg-white border border-gray-200" : pl.color
                  }`}>
                    <PlatformIcon id={id} className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-medium text-gray-600 w-20 flex-shrink-0">{pl?.label}</span>
                  <input
                    type="text"
                    value={perPlatform[id] || ""}
                    onChange={e => setPerPlatform(prev => ({ ...prev, [id]: e.target.value }))}
                    placeholder={username || "username or @handle"}
                    className="flex-1 text-sm px-3 py-2 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50 placeholder-gray-300"
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
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-40 text-white font-bold rounded-2xl text-base transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
      >
        Find Accounts & Check Reputation
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>
    </form>
  );
}

// ─── Stats bar ────────────────────────────────────────────────────────────────
function StatBar() {
  const stats = [
    { value: "50K+",  label: "Reports generated" },
    { value: "6",     label: "Platforms scanned" },
    { value: "60s",   label: "Average report time" },
    { value: "Free",  label: "Always free" },
  ];
  return (
    <div className="grid grid-cols-4 gap-4 py-6 border-t border-gray-100 mt-8">
      {stats.map(s => (
        <div key={s.label} className="text-center">
          <p className="text-xl font-bold text-gray-900">{s.value}</p>
          <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── How it works section ─────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      n: "1",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: "Enter a name or username",
      desc: "Type any business, brand, influencer, or public figure. Choose the platforms you care about.",
    },
    {
      n: "2",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Confirm the right accounts",
      desc: "We find the exact profiles across every platform. Confirm or swap any wrong result in one click.",
    },
    {
      n: "3",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Get your free AI report",
      desc: "Our AI analyses posts, sentiment, and engagement. Download a full PDF reputation report instantly.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900">How it works</h2>
          <p className="text-gray-500 mt-2">Three steps. Under 60 seconds. Completely free.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="relative text-center">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-200 to-transparent" />
              )}
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10">
                {s.icon}
              </div>
              <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Step {s.n}</p>
              <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Trust logos ──────────────────────────────────────────────────────────────
function TrustLogos() {
  return (
    <div className="flex items-center justify-center gap-8 mt-6 opacity-40 grayscale flex-wrap">
      <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Forbes_logo.svg" alt="Forbes" className="h-5" />
      <img src="https://upload.wikimedia.org/wikipedia/commons/0/02/The_New_York_Times_Logo.svg" alt="NYT" className="h-4" />
      <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/BBC_News_2019.svg" alt="BBC" className="h-4" />
    </div>
  );
}

// ─── Main Hero export ─────────────────────────────────────────────────────────
const Hero = () => {
  return (
    <>
      {/* ── Hero section ── */}
      <section className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/30 to-white flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg">

          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Free AI Reputation Report
            </span>
          </div>

          {/* Headline */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
              What's your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                online reputation
              </span>
              ?
            </h1>
            <p className="text-gray-500 mt-3 text-lg">
              Find out in 60 seconds — across every major platform, completely free.
            </p>
            <div className="mt-4">
              <PlatformStrip />
            </div>
          </div>

          {/* The form card */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-blue-100/50 border border-gray-100 p-6 sm:p-8">
            <HeroSearchForm />
          </div>

          {/* Trust */}
          <TrustLogos />
        </div>
      </section>

      {/* ── How it works (below fold) ── */}
      <HowItWorks />

      {/* ── Stats strip ── */}
      <section className="bg-blue-600 py-12">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {[
            { v: "50K+",  l: "Reports generated" },
            { v: "6",     l: "Platforms covered" },
            { v: "< 60s", l: "Report generation" },
            { v: "100%",  l: "Free forever" },
          ].map(s => (
            <div key={s.l}>
              <p className="text-3xl font-extrabold">{s.v}</p>
              <p className="text-blue-200 text-sm mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Hero;
