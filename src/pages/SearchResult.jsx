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
  { id: "google",    label: "Google Business", color: "bg-white border border-gray-200", textColor: "text-gray-700" },
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
        <span className="text-white font-bold" style={{ fontSize: size * 0.28 }}>{initials}</span>
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
          <svg key={i} className={`w-3.5 h-3.5 ${i <= full ? "text-yellow-400" : i === full+1 && half ? "text-yellow-300" : "text-gray-200"}`}
            fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs font-semibold text-gray-700">{rating.toFixed(1)}</span>
    </div>
  );
}

// ─── Normalise raw API response ───────────────────────────────────────────────
// Backend now returns { best, alternatives } — we normalise best into display profile
// and carry alternatives for the "wrong account?" switcher
function normaliseProfile(platformId, data) {
  if (!data) return null;
  // Support both old shape (flat object) and new shape ({ best, alternatives })
  const raw = data.best ?? data;
  const alternatives = data.alternatives ?? [];

  let profile = null;

  if (platformId === "twitter") {
    const sn = raw.screen_name || raw.screenName;
    const displayName = raw.name || sn;
    if (!displayName) return null;
    profile = { found: true, name: displayName, username: sn || displayName, avatar: raw.avatar, followers: raw.followers_count || raw.followers || 0, verified: raw.is_blue_verified || false, bio: raw.description || '', raw };
  } else if (platformId === "tiktok") {
    const displayName = raw.nickname || raw.unique_id || raw.uniqueId;
    const uid = raw.unique_id || raw.uniqueId || raw.sec_uid || raw.secUid;
    if (!displayName && !uid) return null;
    profile = { found: true, name: displayName || uid, username: raw.unique_id || raw.uniqueId || uid, avatar: raw.avatar || raw.avatarThumb || raw.avatarMedium, followers: raw.follower_count || raw.followerCount || 0, verified: raw.verified || false, bio: raw.signature || '', raw };
  } else if (platformId === "instagram") {
    const displayName = raw.full_name || raw.username;
    if (!displayName) return null;
    profile = { found: true, name: displayName, username: raw.username, avatar: raw.avatar || raw.profile_pic_url, followers: raw.follower_count || 0, verified: raw.is_verified || false, bio: raw.biography || '', raw };
  } else if (platformId === "facebook") {
    const displayName = raw.name;
    if (!displayName) return null;
    profile = { found: true, name: displayName, username: raw.username, avatar: raw.avatar, followers: raw.followers || raw.followers_count || raw.fan_count || 0, verified: raw.is_verified || false, bio: raw.category || raw.about || '', raw };
  } else if (platformId === "linkedin") {
    const displayName = raw.full_name || raw.name;
    if (!displayName) return null;
    profile = { found: true, name: displayName, username: raw.url ? raw.url.split("/").filter(Boolean).pop() : "", avatar: raw.avatar, followers: raw.follower_count || raw.followers_count || 0, verified: false, bio: raw.headline || raw.description || '', raw };
  } else if (platformId === "google") {
    if (!raw.name) return null;
    profile = { found: true, name: raw.name, username: raw.address || "", avatar: raw.avatar, rating: raw.rating, reviewCount: raw.review_count, businessId: raw.business_id, url: raw.url, type: raw.type, raw };
  }

  if (!profile) return null;

  // Normalise alternatives into same mini shape
  profile.alternatives = alternatives.map(a => {
    if (!a) return null;
    const name = a.name || a.full_name || a.nickname || '';
    const username = a.screen_name || a.unique_id || a.username || (a.url ? a.url.split('/').filter(Boolean).pop() : '') || '';
    const followers = a.followers_count || a.follower_count || a.followers || 0;
    const avatar = a.avatar || a.profile_pic_url || null;
    return name ? { name, username, followers, avatar, raw: a } : null;
  }).filter(Boolean);

  return profile;
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

// ─── Result card ──────────────────────────────────────────────────────────────
function ResultCard({ platformId, label, profile, selected, onToggle, onOverride, onRetry, onSwapAlternative }) {
  const [editing, setEditing]       = useState(false);
  const [overrideVal, setOverride]  = useState("");
  const [retryVal, setRetryVal]     = useState("");
  const [retrying, setRetrying]     = useState(false);
  const inputRef                    = useRef(null);
  const retryRef                    = useRef(null);
  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);
  useEffect(() => { if (retrying) retryRef.current?.focus(); }, [retrying]);

  const isLoading  = profile === undefined;
  const isFound    = profile?.found === true;
  const isNotFound = profile === null || profile?.found === false;
  const isOverride = profile?.overrideUrl;
  const canSelect  = isFound || isOverride;
  const isGoogle   = platformId === "google";
  const alternatives = profile?.alternatives || [];

  const pl = ALL_PLATFORMS.find(p => p.id === platformId);

  return (
    <div
      onClick={() => { if (canSelect && !editing && !retrying) onToggle(); }}
      className={`relative bg-white rounded-2xl border-2 transition-all
        ${canSelect && !editing && !retrying ? "cursor-pointer hover:shadow-md hover:border-blue-300" : ""}
        ${selected ? `border-transparent ring-2 ${RING_COLORS[platformId]} shadow-md` : "border-gray-100 shadow-sm"}
      `}
    >
      {/* Selected tick */}
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center z-10">
          <HiOutlineCheck className="w-3 h-3 text-white" />
        </div>
      )}

      {/* ── Platform header ── */}
      <div className={`flex items-center gap-2 px-4 pt-4 pb-2`}>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${pl?.color} ${pl?.textColor}`}>
          <PlatformIcon id={platformId} className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-bold text-gray-800">{label}</span>
        <div className="ml-auto flex-shrink-0">
          {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent" />}
          {isFound && <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">Found ✓</span>}
          {isNotFound && <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">Not found</span>}
        </div>
      </div>

      {/* ── Skeleton ── */}
      {isLoading && (
        <div className="px-4 pb-4 flex items-center gap-3 animate-pulse">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-100 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
            <div className="h-3 bg-gray-100 rounded w-1/3" />
          </div>
        </div>
      )}

      {/* ── Found: social profile ── */}
      {isFound && !isGoogle && (
        <div className="px-4 pb-3">
          <div className="flex items-center gap-3">
            <Avatar src={profile.avatar} name={profile.name} size={52} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 flex-wrap">
                <p className="font-bold text-gray-900 text-sm truncate">{profile.name}</p>
                {profile.verified && (
                  platformId === "twitter"
                    ? <img src={twitterVerifiedBadge} alt="verified" className="w-4 h-4 flex-shrink-0" />
                    : <span className="text-blue-500 text-xs flex-shrink-0">✓</span>
                )}
              </div>
              {profile.username && (
                <p className="text-xs text-gray-400 truncate">@{profile.username}</p>
              )}
              {profile.bio && (
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{profile.bio}</p>
              )}
              {/* Followers — prominent */}
              {profile.followers > 0 && (
                <div className="mt-1.5 inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  {formatNum(profile.followers)} followers
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Found: Google Business ── */}
      {isFound && isGoogle && (
        <div className="px-4 pb-3">
          <div className="flex items-start gap-3">
            {profile.avatar
              ? <img src={profile.avatar} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" onError={e => { e.target.style.display='none'; }} />
              : <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 border border-green-100">
                  <PlatformIcon id="google" className="w-6 h-6" />
                </div>
            }
            <div className="min-w-0 flex-1">
              <p className="font-bold text-gray-900 text-sm">{profile.name}</p>
              <StarRating rating={profile.rating} />
              {profile.reviewCount > 0 && (
                <div className="mt-1 inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {formatNum(profile.reviewCount)} reviews
                </div>
              )}
              {profile.username && <p className="text-xs text-gray-400 truncate mt-0.5">{profile.username}</p>}
              {profile.type && <p className="text-xs text-gray-400">{profile.type}</p>}
            </div>
          </div>
        </div>
      )}

      {/* ── Override display ── */}
      {isOverride && !isFound && (
        <div className="px-4 pb-3 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <span className="text-purple-600 text-lg">🔗</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-gray-900 text-sm">Custom URL</p>
            <p className="text-xs text-gray-400 truncate">{profile.overrideUrl}</p>
          </div>
        </div>
      )}

      {/* ── AI alternatives ── */}
      {isFound && alternatives.length > 0 && !editing && !retrying && (
        <div className="mx-4 mb-3 rounded-xl overflow-hidden border-2 border-orange-100 bg-orange-50/40" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-2 px-3 py-2 border-b border-orange-100">
            <span className="text-orange-500 text-sm">⚠️</span>
            <p className="text-xs font-semibold text-orange-700">Not the right account?</p>
            <p className="text-xs text-orange-500 ml-auto">Tap to swap</p>
          </div>
          {alternatives.map((alt, i) => (
            <button
              key={i}
              onClick={() => onSwapAlternative(alt.raw)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-orange-50 transition-colors border-b border-orange-100/50 last:border-0 text-left"
            >
              <Avatar src={alt.avatar} name={alt.name} size={30} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800 truncate">{alt.name}</p>
                {alt.username && <p className="text-xs text-gray-500">@{alt.username}</p>}
              </div>
              {alt.followers > 0 && (
                <span className="text-xs text-gray-500 flex-shrink-0">{formatNum(alt.followers)}</span>
              )}
              <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full flex-shrink-0 font-semibold">Use</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Not found state ── */}
      {isNotFound && !editing && !retrying && (
        <div className="px-4 pb-4 space-y-3" onClick={e => e.stopPropagation()}>
          <div className="flex items-start gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
            <span className="text-lg mt-0.5">🔍</span>
            <p className="text-xs text-gray-600 leading-relaxed">
              {isGoogle
                ? "No Google Business listing found. Try including the city (e.g. \"Nike New York\")."
                : "Couldn't find this account automatically. Enter their exact username or paste a profile URL below."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={e => { e.stopPropagation(); setRetrying(true); }}
              className="py-2 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {isGoogle ? "Add city" : "Try username"}
            </button>
            <button
              onClick={e => { e.stopPropagation(); setEditing(true); }}
              className="py-2 text-xs font-bold bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Paste URL
            </button>
          </div>
        </div>
      )}

      {/* ── Retry / username input ── */}
      {retrying && (
        <div className="px-4 pb-4 space-y-2.5 border-t-2 border-blue-100 pt-3" onClick={e => e.stopPropagation()}>
          <p className="text-xs font-bold text-gray-700">
            {isGoogle ? "Enter business name + city:" : `Enter their exact ${label} username:`}
          </p>
          <input
            ref={retryRef}
            type="text"
            value={retryVal}
            onChange={e => setRetryVal(e.target.value)}
            placeholder={isGoogle ? "e.g. Nike New York" : "e.g. @donaldtrump"}
            className="w-full text-sm px-3.5 py-2.5 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 bg-blue-50/30"
            onKeyDown={e => {
              if (e.key === "Enter" && retryVal.trim()) { onRetry(retryVal.trim()); setRetrying(false); setRetryVal(""); }
              if (e.key === "Escape") { setRetrying(false); setRetryVal(""); }
            }}
          />
          <div className="flex gap-2">
            <button
              disabled={!retryVal.trim()}
              onClick={() => { if (retryVal.trim()) { onRetry(retryVal.trim()); setRetrying(false); setRetryVal(""); } }}
              className="flex-1 py-2 bg-blue-600 text-white text-xs rounded-xl hover:bg-blue-700 disabled:opacity-40 font-bold"
            >Search</button>
            <button onClick={() => { setRetrying(false); setRetryVal(""); }}
              className="px-4 py-2 border-2 border-gray-200 text-gray-500 text-xs rounded-xl hover:bg-gray-50 font-semibold">Cancel</button>
          </div>
        </div>
      )}

      {/* ── Wrong result — visible button always shown when found ── */}
      {(isFound || isOverride) && !editing && !retrying && (
        <div className="border-t-2 border-gray-100 flex" onClick={e => e.stopPropagation()}>
          <button
            onClick={e => { e.stopPropagation(); setRetrying(true); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-bl-2xl border-r border-gray-100"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Try username
          </button>
          <button
            onClick={e => { e.stopPropagation(); setEditing(true); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-br-2xl"
          >
            <HiOutlinePencil className="w-3.5 h-3.5" />
            Paste URL
          </button>
        </div>
      )}

      {/* ── Paste URL input ── */}
      {editing && (
        <div className="px-4 pb-4 pt-3 space-y-2.5 border-t-2 border-blue-100" onClick={e => e.stopPropagation()}>
          <p className="text-xs font-bold text-gray-700">Paste the correct profile URL:</p>
          <input
            ref={inputRef}
            type="text"
            value={overrideVal}
            onChange={e => setOverride(e.target.value)}
            placeholder="https://twitter.com/username"
            className="w-full text-sm px-3.5 py-2.5 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 bg-blue-50/30"
            onKeyDown={e => {
              if (e.key === "Enter" && overrideVal.trim()) { onOverride(overrideVal.trim()); setEditing(false); }
              if (e.key === "Escape") setEditing(false);
            }}
          />
          <div className="flex gap-2">
            <button
              disabled={!overrideVal.trim()}
              onClick={() => { if (overrideVal.trim()) { onOverride(overrideVal.trim()); setEditing(false); } }}
              className="flex-1 py-2 bg-blue-600 text-white text-xs rounded-xl hover:bg-blue-700 disabled:opacity-40 font-bold"
            >Use this URL</button>
            <button onClick={() => setEditing(false)}
              className="px-4 py-2 border-2 border-gray-200 text-gray-500 text-xs rounded-xl hover:bg-gray-50 font-semibold">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main results page ────────────────────────────────────────────────────────
export default function SearchResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const state    = location.state || {};

  const qParam         = new URLSearchParams(location.search).get("query") || "";
  const username       = state.username || qParam || "";
  const mode           = state.mode || "company";
  const platforms      = state.platforms || ALL_PLATFORMS.map(p => p.id).filter(id => id !== "google");
  const handles        = state.handles || Object.fromEntries(platforms.map(p => [p, username]));
  const googleLocation = state.googleLocation || "";

  const [profiles, setProfiles] = useState(
    () => Object.fromEntries(platforms.map(p => [p, undefined]))
  );
  const [selected, setSelected] = useState(new Set());

  // Freeze the search params on mount so re-renders never re-fire lookups
  const searchRef = useRef(null);
  if (!searchRef.current && username) {
    searchRef.current = { username, platforms: [...platforms], handles: { ...handles }, mode, googleLocation };
  }

  useEffect(() => {
    const params = searchRef.current;
    if (!params) return;
    params.platforms.forEach(platformId => {
      const handle = params.handles[platformId] || params.username;
      lookupProfiles(handle, [platformId], params.mode, platformId === "google" ? params.googleLocation : "")
        .then(data => {
          const raw = data.profiles?.[platformId];
          const profile = normaliseProfile(platformId, raw);
          setProfiles(prev => ({ ...prev, [platformId]: profile }));
          if (profile?.found) setSelected(prev => new Set([...prev, platformId]));
        })
        .catch(() => setProfiles(prev => ({ ...prev, [platformId]: null })));
    });
  }, []); // empty deps — run exactly once on mount

  const handleOverride = (platformId, url) => {
    setProfiles(prev => ({
      ...prev,
      [platformId]: { found: false, overrideUrl: url, name: url, username: url, avatar: null, alternatives: [] },
    }));
    setSelected(prev => new Set([...prev, platformId]));
  };

  const handleRetry = (platformId, newHandle) => {
    setProfiles(prev => ({ ...prev, [platformId]: undefined }));
    setSelected(prev => { const next = new Set(prev); next.delete(platformId); return next; });
    lookupProfiles(newHandle, [platformId], mode, platformId === "google" ? newHandle : "")
      .then(data => {
        const raw = data.profiles?.[platformId];
        const profile = normaliseProfile(platformId, raw);
        setProfiles(prev => ({ ...prev, [platformId]: profile }));
        if (profile?.found) setSelected(prev => new Set([...prev, platformId]));
      })
      .catch(() => setProfiles(prev => ({ ...prev, [platformId]: null })));
  };

  // User taps "Use →" on an alternative — swap it in as the main result
  const handleSwapAlternative = (platformId, altRaw) => {
    const profile = normaliseProfile(platformId, { best: altRaw, alternatives: [] });
    if (!profile) return;
    setProfiles(prev => ({ ...prev, [platformId]: profile }));
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
      const toggles = {}, urls = {};
      selectedArr.forEach(id => {
        toggles[id] = true;
        urls[id] = buildUrl(id, profiles[id]);
        if (id === "google" && profiles[id]?.businessId) urls["googleBusinessId"] = profiles[id].businessId;
      });
      navigate("/profile", { state: { brandName: username, urls, toggles, mode } });
      return;
    }
    const firstId = selectedArr[0];
    const p = profiles[firstId];
    const raw = p?.raw;
    if (!raw && !p?.overrideUrl) return;

    let user = null;
    if (firstId === "twitter") {
      user = { name: raw.name, screen_name: raw.screen_name || raw.screenName, avatar: raw.avatar, followers_count: raw.followers_count || raw.followers, description: raw.description, platform: "twitter" };
    } else if (firstId === "instagram") {
      user = { name: raw.full_name || raw.username, screen_name: raw.username, avatar: raw.avatar || raw.profile_pic_url, followers_count: raw.follower_count, biography: raw.biography, is_verified: raw.is_verified, platform: "instagram" };
    } else if (firstId === "tiktok") {
      user = { name: raw.nickname, screen_name: raw.unique_id || raw.uniqueId, avatar: raw.avatar, sec_uid: raw.sec_uid || raw.secUid, follower_count: raw.follower_count || raw.followerCount, signature: raw.signature, platform: "tiktok" };
    } else if (firstId === "facebook") {
      user = { name: raw.name, username: raw.username, avatar: raw.avatar, facebook_id: raw.facebook_id, url: raw.url, followers: raw.followers, type: raw.type, platform: "facebook" };
    } else if (firstId === "linkedin") {
      user = { name: raw.full_name || raw.name, screen_name: raw.url?.split("/").filter(Boolean).pop(), avatar: raw.avatar, headline: raw.headline, url: raw.url, follower_count: raw.follower_count, platform: "linkedin" };
    } else if (firstId === "google") {
      user = { name: raw.name, screen_name: raw.address, avatar: raw.avatar, business_id: raw.business_id, url: raw.url, platform: "google" };
    }
    if (user) navigate("/profile", { state: { user, mode } });
  };

  const anyLoading  = platforms.some(p => profiles[p] === undefined);
  const foundCount  = platforms.filter(p => profiles[p]?.found).length;
  const selectedArr = [...selected];

  if (!username) { navigate("/"); return null; }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      {/* ── Sticky top bar ── */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={() => navigate("/")}
            className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 flex-shrink-0">
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
              {anyLoading ? "Searching platforms…" : `${foundCount} of ${platforms.length} found`}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Instruction banner */}
        <div className="mb-5 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3.5 flex gap-3">
          <span className="text-xl flex-shrink-0 mt-0.5">🤖</span>
          <div className="space-y-1.5">
            <p className="text-sm font-bold text-blue-900">AI picked the best match on each platform</p>
            <div className="flex flex-col gap-1 text-xs text-blue-700">
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</span>
                Review each card — check the name, photo and follower count
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</span>
                Wrong account? Use <strong>"Try username"</strong> or <strong>"Paste URL"</strong> at the bottom of each card
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</span>
                Select the platforms you want, then tap Generate Report
              </span>
            </div>
          </div>
        </div>

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
                onOverride={url => handleOverride(platformId, url)}
                onRetry={handle => handleRetry(platformId, handle)}
                onSwapAlternative={altRaw => handleSwapAlternative(platformId, altRaw)}
              />
            );
          })}
        </div>
      </div>

      {/* ── Sticky generate bar ── */}
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
                  >Individual</button>
                  <button
                    onClick={() => handleGenerateReport("combined")}
                    className="px-4 py-2.5 bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-colors"
                  >Combined <HiOutlineArrowRight className="w-4 h-4" /></button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
