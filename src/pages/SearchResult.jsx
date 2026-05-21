import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HiOutlineArrowRight, HiOutlineCheck, HiOutlineX, HiOutlinePencil } from "react-icons/hi";
import { lookupProfiles } from "../api/apiClient";
import twitterVerifiedBadge from "../assets/Twitter_Verified_Badge.svg.png";

// ─── Platform config ──────────────────────────────────────────────────────────
const PLATFORMS = [
  { id: "twitter",   label: "X / Twitter" },
  { id: "instagram", label: "Instagram" },
  { id: "tiktok",    label: "TikTok" },
  { id: "facebook",  label: "Facebook" },
  { id: "linkedin",  label: "LinkedIn" },
];

const PLATFORM_COLORS = {
  twitter:   "border-gray-900  bg-gray-900",
  instagram: "border-pink-500  bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400",
  tiktok:    "border-gray-900  bg-gray-900",
  facebook:  "border-blue-600  bg-blue-600",
  linkedin:  "border-blue-700  bg-blue-700",
};

const PLATFORM_SELECTED_RING = {
  twitter:   "ring-gray-900",
  instagram: "ring-pink-500",
  tiktok:    "ring-gray-900",
  facebook:  "ring-blue-600",
  linkedin:  "ring-blue-700",
};

// ─── SVG icons ────────────────────────────────────────────────────────────────
function PlatformIcon({ id, className = "w-5 h-5" }) {
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
  return null;
}

// ─── Avatar with initials fallback ───────────────────────────────────────────
function Avatar({ src, name, size = 48 }) {
  const [failed, setFailed] = useState(false);
  const initials = (name || "?").split(" ").filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size }} className="relative flex-shrink-0">
      <div style={{ width: size, height: size }}
        className="rounded-full bg-blue-600 flex items-center justify-center absolute inset-0 select-none">
        <span className="text-white font-bold text-sm">{initials}</span>
      </div>
      {src && !failed && (
        <img src={src} alt="" style={{ width: size, height: size }}
          className="rounded-full object-cover absolute inset-0"
          onError={() => setFailed(true)} />
      )}
    </div>
  );
}

function formatFollowers(n) {
  if (!n) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

// ─── Per-platform result card on results page ─────────────────────────────────
function ResultCard({ platformId, label, profile, selected, onToggle, onOverride }) {
  const [editing, setEditing] = useState(false);
  const [overrideVal, setOverrideVal] = useState("");
  const inputRef = useRef(null);

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const isFound    = profile?.found === true;
  const isLoading  = profile === undefined;
  const isNotFound = profile === null || profile?.found === false;
  const isOverride = profile?.overridden === true;
  const canSelect  = isFound || isOverride;

  const ring = selected ? `ring-2 ${PLATFORM_SELECTED_RING[platformId]}` : "";

  return (
    <div
      onClick={() => { if (canSelect && !editing) onToggle(); }}
      className={`relative bg-white rounded-2xl border border-gray-100 shadow-sm p-4 transition-all
        ${canSelect && !editing ? "cursor-pointer hover:shadow-md" : ""}
        ${selected ? "border-transparent shadow-md " + ring : ""}
      `}
    >
      {/* Selected tick */}
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
          <HiOutlineCheck className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Platform label row */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white flex-shrink-0 ${PLATFORM_COLORS[platformId]}`}>
          <PlatformIcon id={platformId} className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-semibold text-gray-700">{label}</span>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="flex items-center gap-3 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-100 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      )}

      {/* Found profile */}
      {(isFound || isOverride) && profile && (
        <div className="flex items-center gap-3">
          <Avatar src={profile.avatar} name={profile.name} size={48} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 flex-wrap">
              <p className="font-semibold text-gray-900 text-sm truncate">{profile.name}</p>
              {profile.verified && (
                platformId === "twitter"
                  ? <img src={twitterVerifiedBadge} alt="verified" className="w-4 h-4 flex-shrink-0" />
                  : <span className="text-blue-500 text-xs">✓</span>
              )}
              {isOverride && <span className="text-xs text-purple-500 font-medium">custom</span>}
            </div>
            <p className="text-xs text-gray-400 truncate">@{profile.username || profile.screen_name}</p>
            {profile.followers > 0 && (
              <p className="text-xs text-blue-600 font-medium mt-0.5">{formatFollowers(profile.followers)} followers</p>
            )}
          </div>
        </div>
      )}

      {/* Not found */}
      {isNotFound && !editing && (
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-400">Not found</p>
          <button
            onClick={e => { e.stopPropagation(); setEditing(true); }}
            className="text-xs text-blue-600 hover:underline text-left font-medium w-fit"
          >
            + Paste URL manually
          </button>
        </div>
      )}

      {/* Wrong result — edit link */}
      {(isFound || isOverride) && !editing && (
        <button
          onClick={e => { e.stopPropagation(); setEditing(true); }}
          className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors"
        >
          <HiOutlinePencil className="w-3 h-3" /> Wrong account? Paste correct URL
        </button>
      )}

      {/* Inline URL input */}
      {editing && (
        <div className="mt-2 space-y-2" onClick={e => e.stopPropagation()}>
          <input
            ref={inputRef}
            type="text"
            value={overrideVal}
            onChange={e => setOverrideVal(e.target.value)}
            placeholder={`https://${platformId}.com/...`}
            className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={e => {
              if (e.key === "Enter" && overrideVal.trim()) { onOverride(overrideVal.trim()); setEditing(false); }
              if (e.key === "Escape") setEditing(false);
            }}
          />
          <div className="flex gap-2">
            <button
              disabled={!overrideVal.trim()}
              onClick={() => { if (overrideVal.trim()) { onOverride(overrideVal.trim()); setEditing(false); } }}
              className="flex-1 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-40"
            >
              Use this URL
            </button>
            <button onClick={() => setEditing(false)}
              className="px-3 py-1.5 border border-gray-200 text-gray-500 text-xs rounded-lg hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step 1: The input form ───────────────────────────────────────────────────
function SearchForm({ onSubmit }) {
  const [username, setUsername]         = useState("");
  const [mode, setMode]                 = useState("company");
  const [activePlatforms, setActive]    = useState(new Set(PLATFORMS.map(p => p.id)));
  const [showPerPlatform, setShowPer]   = useState(false);
  const [perPlatform, setPerPlatform]   = useState({});
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const togglePlatform = (id) => {
    setActive(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || activePlatforms.size === 0) return;
    // Merge per-platform overrides into the submission
    const handles = {};
    for (const p of activePlatforms) {
      handles[p] = (perPlatform[p]?.trim()) || username.trim();
    }
    onSubmit({ username: username.trim(), mode, platforms: [...activePlatforms], handles });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Any Account</h1>
          <p className="text-gray-500">Enter a name or username and we'll pull their profiles from every platform instantly.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 space-y-7">

          {/* Name / username input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Name or Username
            </label>
            <input
              ref={inputRef}
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g.  Nike,  @nike,  cristiano,  Elon Musk"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-gray-900 text-base transition-colors"
            />
          </div>

          {/* Account type toggle */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Account type</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "company", label: "Business / Brand", sub: "Nike, Apple, a local shop…" },
                { id: "person",  label: "Person / Influencer", sub: "Athlete, creator, public figure…" },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMode(opt.id)}
                  className={`rounded-xl border-2 p-3 text-left transition-all ${
                    mode === opt.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className={`text-sm font-semibold ${mode === opt.id ? "text-blue-700" : "text-gray-800"}`}>{opt.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{opt.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Platform selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Platforms to check
              <span className="ml-2 font-normal text-gray-400 text-xs">(deselect any you don't need)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(p => {
                const active = activePlatforms.has(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlatform(p.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                      active
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    <PlatformIcon id={p.id} className="w-4 h-4" />
                    {p.label}
                    {active && <HiOutlineCheck className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Per-platform username override (advanced, collapsed by default) */}
          <div>
            <button
              type="button"
              onClick={() => setShowPer(v => !v)}
              className="text-xs text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              <span>{showPerPlatform ? "▾" : "▸"}</span>
              Different username on some platforms?
            </button>
            {showPerPlatform && (
              <div className="mt-3 space-y-2">
                {[...activePlatforms].map(id => {
                  const pl = PLATFORMS.find(p => p.id === id);
                  return (
                    <div key={id} className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center text-white flex-shrink-0 ${PLATFORM_COLORS[id]}`}>
                        <PlatformIcon id={id} className="w-3 h-3" />
                      </div>
                      <span className="text-xs text-gray-500 w-24 flex-shrink-0">{pl?.label}</span>
                      <input
                        type="text"
                        value={perPlatform[id] || ""}
                        onChange={e => setPerPlatform(prev => ({ ...prev, [id]: e.target.value }))}
                        placeholder={username || "username"}
                        className="flex-1 text-xs px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold rounded-xl text-base transition-colors flex items-center justify-center gap-2"
          >
            Find Accounts
            <HiOutlineArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Step 2: Results grid ─────────────────────────────────────────────────────
function ResultsPage({ submission, onBack, onGenerateReport }) {
  const { username, mode, platforms, handles } = submission;

  // profiles[platformId] = undefined (loading) | null (not found) | { found, name, ... }
  const [profiles, setProfiles] = useState(
    () => Object.fromEntries(platforms.map(p => [p, undefined]))
  );
  const [selected, setSelected] = useState(new Set());

  useEffect(() => {
    // Fire one request per platform simultaneously, using the per-platform handle
    platforms.forEach(platformId => {
      const handle = handles[platformId] || username;
      lookupProfiles(handle, [platformId], mode)
        .then(data => {
          const raw = data.profiles?.[platformId];
          const profile = normaliseProfile(platformId, raw);
          setProfiles(prev => ({ ...prev, [platformId]: profile }));
          if (profile?.found) setSelected(prev => new Set([...prev, platformId]));
        })
        .catch(() => {
          setProfiles(prev => ({ ...prev, [platformId]: null }));
        });
    });
  }, []);

  const handleOverride = (platformId, url) => {
    const name = url.split("/").filter(Boolean).pop() || url;
    setProfiles(prev => ({
      ...prev,
      [platformId]: { found: true, overridden: true, name, username: name, avatar: null, followers: 0, url },
    }));
    setSelected(prev => new Set([...prev, platformId]));
  };

  const toggleSelect = (platformId) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(platformId) ? next.delete(platformId) : next.add(platformId);
      return next;
    });
  };

  const anyLoading  = platforms.some(p => profiles[p] === undefined);
  const foundCount  = platforms.filter(p => profiles[p]?.found).length;
  const selectedArr = [...selected];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Top bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-colors"
          >
            ← Back
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{username}</p>
            <p className="text-xs text-gray-400">
              {anyLoading
                ? "Fetching profiles…"
                : `${foundCount} of ${platforms.length} platforms found`}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Instructions */}
        <p className="text-sm text-gray-500 mb-5">
          Tick the accounts to include in the report. If a result is wrong, click the edit icon to paste the correct URL.
        </p>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {platforms.map(platformId => {
            const pl = PLATFORMS.find(p => p.id === platformId);
            return (
              <ResultCard
                key={platformId}
                platformId={platformId}
                label={pl?.label || platformId}
                profile={profiles[platformId]}
                selected={selected.has(platformId)}
                onToggle={() => toggleSelect(platformId)}
                onOverride={(url) => handleOverride(platformId, url)}
              />
            );
          })}
        </div>

        {/* Generate bar */}
        {selectedArr.length > 0 && (
          <div className="sticky bottom-6 bg-white rounded-2xl border border-gray-200 shadow-lg px-6 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {selectedArr.length} platform{selectedArr.length > 1 ? "s" : ""} selected
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {selectedArr.map(id => PLATFORMS.find(p => p.id === id)?.label).join(", ")}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {selectedArr.length === 1 ? (
                <button
                  onClick={() => onGenerateReport("individual", selectedArr, profiles)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 flex items-center gap-2"
                >
                  Generate Report <HiOutlineArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onGenerateReport("individual", selectedArr, profiles)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50"
                  >
                    Individual
                  </button>
                  <button
                    onClick={() => onGenerateReport("combined", selectedArr, profiles)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 flex items-center gap-2"
                  >
                    Combined Report <HiOutlineArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Normalise raw lookup response → display profile ─────────────────────────
function normaliseProfile(platformId, raw) {
  if (!raw) return null;

  if (platformId === "twitter") {
    if (!raw.id && !raw.screen_name) return null;
    return {
      found: true,
      name: raw.name || raw.screen_name,
      username: raw.screen_name,
      avatar: raw.avatar,
      followers: raw.followers_count || 0,
      verified: raw.is_blue_verified || false,
      raw,
    };
  }

  if (platformId === "tiktok") {
    if (!raw.sec_uid && !raw.unique_id) return null;
    return {
      found: true,
      name: raw.nickname,
      username: raw.unique_id,
      avatar: raw.avatar,
      followers: raw.follower_count || 0,
      verified: raw.verified || false,
      raw,
    };
  }

  if (platformId === "instagram") {
    if (!raw.username) return null;
    return {
      found: true,
      name: raw.full_name || raw.username,
      username: raw.username,
      avatar: raw.avatar,
      followers: raw.follower_count || 0,
      verified: raw.is_verified || false,
      raw,
    };
  }

  if (platformId === "facebook") {
    if (!raw.name) return null;
    return {
      found: true,
      name: raw.name,
      username: raw.username,
      avatar: raw.avatar,
      followers: raw.followers || 0,
      verified: raw.is_verified || false,
      raw,
    };
  }

  if (platformId === "linkedin") {
    if (!raw.full_name) return null;
    return {
      found: true,
      name: raw.full_name,
      username: raw.url ? raw.url.split("/").filter(Boolean).pop() : "",
      avatar: raw.avatar,
      followers: raw.follower_count || 0,
      verified: false,
      raw,
    };
  }

  return null;
}

// ─── Build URL from profile for report navigation ─────────────────────────────
function buildUrl(platformId, profile) {
  if (profile?.url) return profile.url;
  if (profile?.overridden) return profile.username || "";
  const u = profile?.username || "";
  if (platformId === "twitter")   return u ? `https://twitter.com/${u}` : "";
  if (platformId === "instagram") return u ? `https://instagram.com/${u}` : "";
  if (platformId === "tiktok")    return u ? `https://tiktok.com/@${u}` : "";
  if (platformId === "facebook")  return u ? `https://facebook.com/${u}` : "";
  if (platformId === "linkedin")  return profile?.raw?.url || "";
  return "";
}

// ─── Root page component ──────────────────────────────────────────────────────
export default function SearchResult() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const qParam    = new URLSearchParams(location.search).get("query") || "";

  // If we arrive with a ?query= param, skip straight to results with that as username
  const [step, setStep] = useState(qParam ? "results" : "form");
  const [submission, setSubmission] = useState(
    qParam
      ? {
          username: qParam,
          mode: "company",
          platforms: PLATFORMS.map(p => p.id),
          handles: Object.fromEntries(PLATFORMS.map(p => [p.id, qParam])),
        }
      : null
  );

  const handleFormSubmit = (data) => {
    setSubmission(data);
    setStep("results");
  };

  const handleGenerateReport = (reportType, selectedPlatforms, profiles) => {
    if (reportType === "combined") {
      const toggles = {};
      const urls    = {};
      selectedPlatforms.forEach(id => {
        const key = id === "instagram" ? "InstaRab" : id.charAt(0).toUpperCase() + id.slice(1);
        toggles[key] = true;
        urls[key] = buildUrl(id, profiles[id]);
      });
      navigate("/profile", { state: { brandName: submission.username, urls, toggles } });
      return;
    }

    // Individual — navigate with first selected platform's user object
    const firstId = selectedPlatforms[0];
    const p = profiles[firstId];
    const raw = p?.raw;
    if (!raw) return;

    if (firstId === "twitter") {
      navigate("/profile", { state: { user: { ...raw, platform: "X" } } });
    } else if (firstId === "linkedin") {
      navigate("/profile", { state: { user: { name: raw.full_name, screen_name: raw.type, avatar: raw.avatar, headline: raw.headline, url: raw.url, platform: "linkedin" } } });
    } else if (firstId === "tiktok") {
      navigate("/profile", { state: { user: { name: raw.nickname, screen_name: raw.unique_id, avatar: raw.avatar, sec_uid: raw.sec_uid, follower_count: raw.follower_count, signature: raw.signature, platform: "tiktok" } } });
    } else if (firstId === "facebook") {
      navigate("/profile", { state: { user: { name: raw.name, screen_name: raw.type, avatar: raw.avatar, facebook_id: raw.facebook_id, url: raw.url, platform: "facebook" } } });
    } else if (firstId === "instagram") {
      navigate("/profile", { state: { user: { name: raw.full_name, screen_name: raw.username, avatar: raw.avatar, instagram_id: raw.id, is_verified: raw.is_verified, platform: "instagram" } } });
    }
  };

  if (step === "form" || !submission) {
    return <SearchForm onSubmit={handleFormSubmit} />;
  }

  return (
    <ResultsPage
      submission={submission}
      onBack={() => setStep("form")}
      onGenerateReport={handleGenerateReport}
    />
  );
}
