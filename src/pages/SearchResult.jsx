import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HiOutlineArrowRight, HiOutlineCheck, HiOutlinePencil } from "react-icons/hi";
import { lookupProfiles } from "../api/apiClient";
import twitterVerifiedBadge from "../assets/Twitter_Verified_Badge.svg.png";

// ─── Platform config ──────────────────────────────────────────────────────────
const ALL_PLATFORMS = [
  { id: "twitter",   label: "X / Twitter",   color: "bg-black",         textColor: "text-white" },
  { id: "instagram", label: "Instagram",      color: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400", textColor: "text-white" },
  { id: "tiktok",    label: "TikTok",         color: "bg-black",         textColor: "text-white" },
  { id: "facebook",  label: "Facebook",       color: "bg-blue-600",      textColor: "text-white" },
  { id: "linkedin",  label: "LinkedIn",       color: "bg-blue-700",      textColor: "text-white" },
  { id: "google",    label: "Google",         color: "bg-white border border-gray-200", textColor: "text-gray-700" },
];

const RING_COLORS = {
  twitter:   "ring-gray-900",
  instagram: "ring-pink-500",
  tiktok:    "ring-gray-900",
  facebook:  "ring-blue-600",
  linkedin:  "ring-blue-700",
  google:    "ring-green-500",
};

// ─── Icons ────────────────────────────────────────────────────────────────────
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

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ src, name, size = 52 }) {
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

function formatNum(n) {
  if (!n) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function StarRating({ rating }) {
  if (!rating) return null;
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-1 mt-0.5">
      <div className="flex">
        {[1,2,3,4,5].map(i => (
          <svg key={i} className={`w-3.5 h-3.5 ${i <= full ? "text-yellow-400" : i === full + 1 && half ? "text-yellow-300" : "text-gray-200"}`}
            fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs font-semibold text-gray-700">{rating.toFixed(1)}</span>
    </div>
  );
}

// ─── Normalise raw API response to display profile ────────────────────────────
function normaliseProfile(platformId, raw) {
  if (!raw) return null;
  if (platformId === "twitter") {
    if (!raw.id && !raw.screen_name) return null;
    return { found: true, name: raw.name || raw.screen_name, username: raw.screen_name, avatar: raw.avatar, followers: raw.followers_count || 0, verified: raw.is_blue_verified || false, raw };
  }
  if (platformId === "tiktok") {
    if (!raw.sec_uid && !raw.unique_id) return null;
    return { found: true, name: raw.nickname, username: raw.unique_id, avatar: raw.avatar, followers: raw.follower_count || 0, verified: raw.verified || false, raw };
  }
  if (platformId === "instagram") {
    if (!raw.username) return null;
    return { found: true, name: raw.full_name || raw.username, username: raw.username, avatar: raw.avatar, followers: raw.follower_count || 0, verified: raw.is_verified || false, raw };
  }
  if (platformId === "facebook") {
    if (!raw.name) return null;
    return { found: true, name: raw.name, username: raw.username, avatar: raw.avatar, followers: raw.followers || 0, verified: raw.is_verified || false, raw };
  }
  if (platformId === "linkedin") {
    if (!raw.full_name) return null;
    return { found: true, name: raw.full_name, username: raw.url ? raw.url.split("/").filter(Boolean).pop() : "", avatar: raw.avatar, followers: raw.follower_count || 0, verified: false, raw };
  }
  if (platformId === "google") {
    if (!raw.name) return null;
    return { found: true, name: raw.name, username: raw.address || "", avatar: raw.avatar, rating: raw.rating, reviewCount: raw.review_count, businessId: raw.business_id, url: raw.url, type: raw.type, raw };
  }
  return null;
}

function buildUrl(platformId, profile) {
  if (profile?.overrideUrl) return profile.overrideUrl;
  const u = profile?.username || "";
  if (platformId === "twitter")   return u ? `https://twitter.com/${u}` : "";
  if (platformId === "instagram") return u ? `https://instagram.com/${u}` : "";
  if (platformId === "tiktok")    return u ? `https://tiktok.com/@${u}` : "";
  if (platformId === "facebook")  return profile?.raw?.url || (u ? `https://facebook.com/${u}` : "");
  if (platformId === "linkedin")  return profile?.raw?.url || "";
  if (platformId === "google")    return profile?.url || "";
  return "";
}

// ─── Single result card ───────────────────────────────────────────────────────
function ResultCard({ platformId, label, profile, selected, onToggle, onOverride }) {
  const [editing, setEditing]       = useState(false);
  const [overrideVal, setOverride]  = useState("");
  const inputRef                    = useRef(null);
  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const isLoading  = profile === undefined;
  const isFound    = profile?.found === true;
  const isNotFound = profile === null || profile?.found === false;
  const isOverride = profile?.overrideUrl;
  const canSelect  = isFound || isOverride;
  const isGoogle   = platformId === "google";

  const pl = ALL_PLATFORMS.find(p => p.id === platformId);

  return (
    <div
      onClick={() => { if (canSelect && !editing) onToggle(); }}
      className={`relative bg-white rounded-2xl border-2 p-4 transition-all
        ${canSelect && !editing ? "cursor-pointer hover:shadow-md hover:border-blue-300" : ""}
        ${selected ? `border-transparent ring-2 ${RING_COLORS[platformId]} shadow-md bg-blue-50/30` : "border-gray-100 shadow-sm"}
      `}
    >
      {/* Selected tick */}
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center z-10">
          <HiOutlineCheck className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Platform header */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${pl?.color} ${pl?.textColor}`}>
          <PlatformIcon id={platformId} className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-bold text-gray-800">{label}</span>
        <div className="ml-auto">
          {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent" />}
          {isFound && !isLoading && <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">Found ✓</span>}
          {isNotFound && !isLoading && <span className="text-xs text-gray-400">Not found</span>}
        </div>
      </div>

      {/* Skeleton */}
      {isLoading && (
        <div className="flex items-center gap-3 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-100 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      )}

      {/* Found: social profile */}
      {isFound && !isGoogle && (
        <div className="flex items-center gap-3">
          <Avatar src={profile.avatar} name={profile.name} size={48} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 flex-wrap">
              <p className="font-bold text-gray-900 text-sm truncate">{profile.name}</p>
              {profile.verified && (
                platformId === "twitter"
                  ? <img src={twitterVerifiedBadge} alt="verified" className="w-4 h-4 flex-shrink-0" />
                  : <span className="text-blue-500 text-xs">✓</span>
              )}
            </div>
            <p className="text-xs text-gray-400 truncate">@{profile.username}</p>
            {profile.followers > 0 && (
              <p className="text-xs text-blue-600 font-semibold mt-0.5">{formatNum(profile.followers)} followers</p>
            )}
          </div>
        </div>
      )}

      {/* Found: Google Business */}
      {isFound && isGoogle && (
        <div className="flex items-start gap-3">
          {profile.avatar
            ? <img src={profile.avatar} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" onError={e => { e.target.style.display='none'; }} />
            : <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <PlatformIcon id="google" className="w-6 h-6" />
              </div>
          }
          <div className="min-w-0 flex-1">
            <p className="font-bold text-gray-900 text-sm truncate">{profile.name}</p>
            <StarRating rating={profile.rating} />
            {profile.reviewCount > 0 && <p className="text-xs text-gray-400">{formatNum(profile.reviewCount)} reviews</p>}
            {profile.username && <p className="text-xs text-gray-400 truncate mt-0.5">{profile.username}</p>}
          </div>
        </div>
      )}

      {/* Override display */}
      {isOverride && !isFound && (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <span className="text-purple-600 text-lg">🔗</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-gray-900 text-sm truncate">Custom URL</p>
            <p className="text-xs text-gray-400 truncate">{profile.overrideUrl}</p>
          </div>
        </div>
      )}

      {/* Not found state */}
      {isNotFound && !editing && (
        <div className="mt-1 space-y-2">
          <p className="text-xs text-gray-400">
            {isGoogle
              ? "No Google Business found. Try adding a city in the search."
              : "No account found with this username."}
          </p>
          <button
            onClick={e => { e.stopPropagation(); setEditing(true); }}
            className="text-xs text-blue-600 hover:underline font-semibold"
          >
            + Paste URL manually
          </button>
        </div>
      )}

      {/* Wrong result edit link */}
      {(isFound || isOverride) && !editing && (
        <button
          onClick={e => { e.stopPropagation(); setEditing(true); }}
          className="mt-2.5 flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors"
        >
          <HiOutlinePencil className="w-3 h-3" />
          {isGoogle ? "Wrong business? Paste correct URL" : "Wrong account? Paste correct URL"}
        </button>
      )}

      {/* Inline URL paste */}
      {editing && (
        <div className="mt-3 space-y-2" onClick={e => e.stopPropagation()}>
          <p className="text-xs text-gray-500 font-medium">Paste the correct URL:</p>
          <input
            ref={inputRef}
            type="text"
            value={overrideVal}
            onChange={e => setOverride(e.target.value)}
            placeholder="https://..."
            className="w-full text-xs px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            onKeyDown={e => {
              if (e.key === "Enter" && overrideVal.trim()) { onOverride(overrideVal.trim()); setEditing(false); }
              if (e.key === "Escape") setEditing(false);
            }}
          />
          <div className="flex gap-2">
            <button
              disabled={!overrideVal.trim()}
              onClick={() => { if (overrideVal.trim()) { onOverride(overrideVal.trim()); setEditing(false); } }}
              className="flex-1 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-40 font-semibold"
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

// ─── Main results page ────────────────────────────────────────────────────────
export default function SearchResult() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const state     = location.state || {};

  // Accept state from HeroSection form OR from a legacy ?query= param
  const qParam    = new URLSearchParams(location.search).get("query") || "";
  const username  = state.username || qParam || "";
  const mode      = state.mode || "company";
  const platforms = state.platforms || ALL_PLATFORMS.map(p => p.id).filter(id => id !== "google");
  const handles   = state.handles   || Object.fromEntries(platforms.map(p => [p, username]));
  const googleLocation = state.googleLocation || "";

  const [profiles, setProfiles]   = useState(
    () => Object.fromEntries(platforms.map(p => [p, undefined]))
  );
  const [selected, setSelected]   = useState(new Set());

  // Fire each platform lookup independently
  useEffect(() => {
    if (!username) return;
    platforms.forEach(platformId => {
      const handle = handles[platformId] || username;
      lookupProfiles(handle, [platformId], mode, platformId === "google" ? googleLocation : "")
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
  }, [username]);

  const handleOverride = (platformId, url) => {
    setProfiles(prev => ({
      ...prev,
      [platformId]: { found: false, overrideUrl: url, name: url, username: url, avatar: null },
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

  const handleGenerateReport = (reportType) => {
    const selectedArr = [...selected];

    if (reportType === "combined") {
      const toggles = {};
      const urls    = {};
      selectedArr.forEach(id => {
        const key = id === "instagram" ? "InstaRab" : id.charAt(0).toUpperCase() + id.slice(1);
        toggles[key] = true;
        urls[key] = buildUrl(id, profiles[id]);
        if (id === "google" && profiles[id]?.businessId) urls["googleBusinessId"] = profiles[id].businessId;
      });
      navigate("/profile", { state: { brandName: username, urls, toggles } });
      return;
    }

    // Individual
    const firstId = selectedArr[0];
    const p = profiles[firstId];
    const raw = p?.raw;
    if (!raw && !p?.overrideUrl) return;

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
    } else if (firstId === "google") {
      navigate("/profile", { state: { user: { name: raw.name, screen_name: raw.address, avatar: raw.avatar, business_id: raw.business_id, url: raw.url, platform: "google" } } });
    }
  };

  const anyLoading   = platforms.some(p => profiles[p] === undefined);
  const foundCount   = platforms.filter(p => profiles[p]?.found).length;
  const selectedArr  = [...selected];

  if (!username) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Top bar */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={() => navigate("/")}
            className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-colors flex-shrink-0">
            ← Back
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-bold text-gray-900 truncate">{username}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                mode === "company" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
              }`}>
                {mode === "company" ? "🏢 Business" : "👤 Person"}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              {anyLoading
                ? "Fetching profiles…"
                : `${foundCount} of ${platforms.length} platforms found`}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Instruction */}
        <p className="text-sm text-gray-500 mb-5">
          Select the accounts to include in your report. Can't find the right one? Click the pencil icon to paste a direct URL.
        </p>

        {/* Results grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-28">
          {platforms.map(platformId => {
            const pl = ALL_PLATFORMS.find(p => p.id === platformId);
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
      </div>

      {/* Sticky generate bar */}
      {selectedArr.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-6 pt-2">
          <div className="max-w-2xl mx-auto bg-gray-900 rounded-2xl shadow-2xl px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-white text-sm">
                {selectedArr.length} platform{selectedArr.length > 1 ? "s" : ""} selected
              </p>
              <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[180px]">
                {selectedArr.map(id => ALL_PLATFORMS.find(p => p.id === id)?.label).join(", ")}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {selectedArr.length === 1 ? (
                <button
                  onClick={() => handleGenerateReport("individual")}
                  className="px-4 py-2.5 bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-colors"
                >
                  Generate Report <HiOutlineArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleGenerateReport("individual")}
                    className="px-4 py-2.5 border border-gray-600 text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    Individual
                  </button>
                  <button
                    onClick={() => handleGenerateReport("combined")}
                    className="px-4 py-2.5 bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-colors"
                  >
                    Combined <HiOutlineArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
