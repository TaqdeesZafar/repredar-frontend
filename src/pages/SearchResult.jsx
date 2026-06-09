import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { lookupProfiles } from "../api/apiClient";
import twitterVerifiedBadge from "../assets/Twitter_Verified_Badge.svg.png";

// CSS vars and animations come from theme.css (imported in main.jsx)
const GLOBAL_CSS = `
  .sr-card-hover:hover {
    border-color: var(--accent-border) !important;
    background: rgba(37,99,235,0.04) !important;
  }
  .sr-btn-ghost:hover {
    border-color: var(--accent) !important;
    color: var(--accent) !important;
  }
  .sr-alt-row:hover { background: rgba(37,99,235,0.05) !important; }
  .sr-retry-row:hover { background: rgba(37,99,235,0.04) !important; }
  .sr-footer-btn:hover { color: var(--accent) !important; background: rgba(37,99,235,0.05) !important; }
  .sr-scroll::-webkit-scrollbar { width: 4px; }
  .sr-scroll::-webkit-scrollbar-track { background: transparent; }
  .sr-scroll::-webkit-scrollbar-thumb { background: rgba(15,23,42,0.12); border-radius: 2px; }

  @media (max-width: 600px) {
    .sr-generate-bar {
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 12px !important;
      padding: 14px !important;
    }
    .sr-generate-info { text-align: center; }
    .sr-generate-btns { width: 100% !important; }
    .sr-btn-primary { flex: 1 !important; }
  }
`;

// ─── Platform config ──────────────────────────────────────────────────────────
const ALL_PLATFORMS = [
  { id: "twitter",   label: "X / Twitter",    bg: "#000",                                         tc: "#fff" },
  { id: "instagram", label: "Instagram",       bg: "linear-gradient(135deg,#833AB4,#C13584,#F56040)", tc: "#fff" },
  { id: "tiktok",    label: "TikTok",          bg: "#000",                                         tc: "#fff" },
  { id: "facebook",  label: "Facebook",        bg: "#1877F2",                                      tc: "#fff" },
  { id: "linkedin",  label: "LinkedIn",        bg: "#0A66C2",                                      tc: "#fff" },
  { id: "google",    label: "Google Business", bg: "#fff",                                         tc: "#444" },
];

// Per-platform example URLs for the "Paste URL" placeholder
const URL_PLACEHOLDERS = {
  twitter:   "https://twitter.com/username",
  instagram: "https://instagram.com/username",
  tiktok:    "https://tiktok.com/@username",
  facebook:  "https://facebook.com/pagename",
  linkedin:  "https://linkedin.com/in/username",
  google:    "https://maps.google.com/?cid=...",
};

// ─── Icons ────────────────────────────────────────────────────────────────────
function PlatformIcon({ id, size = 14 }) {
  const s = { width: size, height: size, flexShrink: 0 };
  if (id === "twitter") return (
    <svg style={s} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
  if (id === "linkedin") return (
    <svg style={s} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
  if (id === "tiktok") return (
    <svg style={s} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  );
  if (id === "facebook") return (
    <svg style={s} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
  if (id === "instagram") return (
    <svg style={s} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162S8.597 18.163 12 18.163s6.162-2.759 6.162-6.162S15.403 5.838 12 5.838zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
  if (id === "google") return (
    <svg style={s} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
  return null;
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ src, name, size = 46 }) {
  const [failed, setFailed] = useState(false);
  const initials = (name || "?").split(" ").filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, position: "relative", flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: "linear-gradient(135deg, #2563EB, #7C3AED)",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "absolute", inset: 0,
        fontWeight: 700, color: "#fff", fontSize: size * 0.3,
        userSelect: "none",
      }}>{initials}</div>
      {src && !failed && (
        <img src={src} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", position: "absolute", inset: 0 }}
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
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <div style={{ display: "flex" }}>
        {[1,2,3,4,5].map(i => (
          <svg key={i} style={{ width: 12, height: 12, color: i <= full ? "var(--amber)" : i === full+1 && half ? "var(--amber)" : "var(--text-faint)" }}
            fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: "var(--amber)" }}>{rating.toFixed(1)}</span>
    </div>
  );
}

// ─── Normalise raw API response ───────────────────────────────────────────────
function normaliseProfile(platformId, data) {
  if (!data) return null;
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
  const [editing, setEditing]      = useState(false);
  const [overrideVal, setOverride] = useState("");
  const [retryVal, setRetryVal]    = useState("");
  const [retrying, setRetrying]    = useState(false);
  const inputRef  = useRef(null);
  const retryRef  = useRef(null);
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

  const card = {
    background: selected
      ? "rgba(37,99,235,0.04)"
      : "var(--bg-surface)",
    border: selected ? "1px solid var(--accent-border)" : "1px solid var(--border)",
    borderRadius: 16,
    position: "relative",
    cursor: canSelect && !editing && !retrying ? "pointer" : "default",
    overflow: "hidden",
  };

  return (
    <div
      style={card}
      className={canSelect && !editing && !retrying ? "sr-card-hover" : ""}
      onClick={() => { if (canSelect && !editing && !retrying) onToggle(); }}
    >
      {/* Selected tick */}
      {selected && (
        <div style={{
          position: "absolute", top: 12, right: 12,
          width: 20, height: 20, borderRadius: "50%",
          background: "var(--accent)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "var(--shadow-btn)", zIndex: 10,
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5">
            <path d="M5 12l5 5L20 7"/>
          </svg>
        </div>
      )}

      {/* Platform header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 16px 10px" }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7,
          background: pl?.bg, color: pl?.tc,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <PlatformIcon id={platformId} size={12} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>{label}</span>
        <div style={{ marginLeft: "auto" }}>
          {isLoading && (
            <div style={{ width: 16, height: 16, border: "2px solid var(--accent-dim)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          )}
          {isFound && (
            <span style={{ fontSize: 10, fontWeight: 600, color: "var(--green)", background: "var(--green-dim)", border: "1px solid rgba(52,211,153,0.3)", padding: "2px 8px", borderRadius: 999, fontFamily: "monospace" }}>
              FOUND
            </span>
          )}
          {isNotFound && (
            <span style={{ fontSize: 10, color: "var(--text-3)", background: "var(--bg-elevated)", border: "1px solid var(--border)", padding: "2px 8px", borderRadius: 999, fontFamily: "monospace" }}>
              NOT FOUND
            </span>
          )}
        </div>
      </div>

      {/* Skeleton */}
      {isLoading && (
        <div style={{ padding: "4px 16px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(90deg, var(--shimmer-a) 25%, var(--shimmer-b) 50%, var(--shimmer-a) 75%)", backgroundSize: "200% 100%", animation: "shimmer 2s infinite", flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ height: 10, borderRadius: 6, background: "linear-gradient(90deg, var(--shimmer-a) 25%, var(--shimmer-b) 50%, var(--shimmer-a) 75%)", backgroundSize: "200% 100%", animation: "shimmer 2s infinite", width: "70%" }} />
            <div style={{ height: 10, borderRadius: 6, background: "linear-gradient(90deg, var(--shimmer-a) 25%, var(--shimmer-b) 50%, var(--shimmer-a) 75%)", backgroundSize: "200% 100%", animation: "shimmer 2s infinite", width: "45%" }} />
          </div>
        </div>
      )}

      {/* Found: social profile */}
      {isFound && !isGoogle && (
        <div style={{ padding: "4px 16px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar src={profile.avatar} name={profile.name} size={46} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.name}</span>
                {profile.verified && (
                  platformId === "twitter"
                    ? <img src={twitterVerifiedBadge} alt="verified" style={{ width: 14, height: 14, flexShrink: 0 }} />
                    : <span style={{ color: "var(--accent)", fontSize: 12 }}>✓</span>
                )}
              </div>
              {profile.username && (
                <div style={{ fontSize: 12, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>@{profile.username}</div>
              )}
              {profile.bio && (
                <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.5 }}>{profile.bio}</div>
              )}
              {profile.followers > 0 && (
                <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 5, background: "var(--accent-dim)", border: "1px solid var(--accent-border)", padding: "3px 10px", borderRadius: 999 }}>
                  <svg style={{ width: 11, height: 11, color: "var(--accent)" }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", fontFamily: "monospace" }}>{formatNum(profile.followers)}</span>
                  <span style={{ fontSize: 11, color: "var(--text-3)" }}>followers</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Found: Google Business */}
      {isFound && isGoogle && (
        <div style={{ padding: "4px 16px 14px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            {profile.avatar
              ? <img src={profile.avatar} alt="" style={{ width: 46, height: 46, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} onError={e => { e.target.style.display = "none"; }} />
              : <div style={{ width: 46, height: 46, borderRadius: 10, background: "var(--bg-elevated)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <PlatformIcon id="google" size={20} />
                </div>
            }
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}>{profile.name}</div>
              <StarRating rating={profile.rating} />
              {profile.reviewCount > 0 && (
                <div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 5, background: "var(--amber-dim)", border: "1px solid rgba(251,191,36,0.25)", padding: "3px 10px", borderRadius: 999 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--amber)", fontFamily: "monospace" }}>{formatNum(profile.reviewCount)}</span>
                  <span style={{ fontSize: 11, color: "var(--text-3)" }}>reviews</span>
                </div>
              )}
              {profile.username && <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>{profile.username}</div>}
              {profile.type && <div style={{ fontSize: 12, color: "var(--text-3)" }}>{profile.type}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Override display */}
      {isOverride && !isFound && (
        <div style={{ padding: "4px 16px 14px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "var(--accent-dim)", border: "1px solid var(--accent-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>
            🔗
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>Custom URL</div>
            <div style={{ fontSize: 12, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.overrideUrl}</div>
          </div>
        </div>
      )}

      {/* AI alternatives */}
      {isFound && alternatives.length > 0 && !editing && !retrying && (
        <div style={{ margin: "0 12px 12px", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(251,191,36,0.2)", background: "var(--amber-dim)" }} onClick={e => e.stopPropagation()}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderBottom: "1px solid rgba(251,191,36,0.15)" }}>
            <span style={{ fontSize: 13 }}>⚠️</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--amber)" }}>Not the right account?</span>
            <span style={{ fontSize: 11, color: "var(--text-3)", marginLeft: "auto" }}>Tap to swap</span>
          </div>
          {alternatives.map((alt, i) => (
            <button key={i} onClick={() => onSwapAlternative(alt.raw)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "transparent", border: "none", borderBottom: i < alternatives.length - 1 ? "1px solid rgba(251,191,36,0.1)" : "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}
              className="sr-alt-row">
              <Avatar src={alt.avatar} name={alt.name} size={28} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{alt.name}</div>
                {alt.username && <div style={{ fontSize: 11, color: "var(--text-3)" }}>@{alt.username}</div>}
              </div>
              {alt.followers > 0 && <span style={{ fontSize: 11, color: "var(--text-3)", flexShrink: 0, fontFamily: "monospace" }}>{formatNum(alt.followers)}</span>}
              <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "var(--accent)", padding: "2px 8px", borderRadius: 999, flexShrink: 0 }}>Use</span>
            </button>
          ))}
        </div>
      )}

      {/* Not found state */}
      {isNotFound && !editing && !retrying && (
        <div style={{ padding: "0 14px 14px" }} onClick={e => e.stopPropagation()}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
            <span style={{ fontSize: 16, marginTop: 1 }}>🔍</span>
            <p style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.5, margin: 0 }}>
              {isGoogle
                ? "No Google Business listing found. Try including the city (e.g. \"Nike New York\")."
                : "Couldn't find this account automatically. Enter their exact username or paste a profile URL below."}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button onClick={e => { e.stopPropagation(); setRetrying(true); }}
              style={{ padding: "9px 12px", fontSize: 12, fontWeight: 600, background: "var(--accent)", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit" }}
              onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
              onMouseOut={e => e.currentTarget.style.opacity = "1"}>
              <svg style={{ width: 12, height: 12 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" strokeWidth="2"/><path d="M21 21l-4.3-4.3" strokeWidth="2"/>
              </svg>
              {isGoogle ? "Add city" : "Try username"}
            </button>
            <button onClick={e => { e.stopPropagation(); setEditing(true); }}
              style={{ padding: "9px 12px", fontSize: 12, fontWeight: 600, background: "transparent", color: "var(--text-2)", border: "1px solid var(--border)", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit" }}
              className="sr-btn-ghost">
              <svg style={{ width: 12, height: 12 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Paste URL
            </button>
          </div>
        </div>
      )}

      {/* Retry / username input */}
      {retrying && (
        <div style={{ padding: "0 14px 14px", borderTop: "1px solid var(--border)" }} onClick={e => e.stopPropagation()}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", margin: "10px 0 8px" }}>
            {isGoogle ? "Enter business name + city:" : `Enter exact ${label} username:`}
          </p>
          <input ref={retryRef} type="text" value={retryVal} onChange={e => setRetryVal(e.target.value)}
            placeholder={isGoogle ? "e.g. Nike New York" : "e.g. @donaldtrump"}
            style={{ width: "100%", padding: "9px 12px", background: "var(--bg-elevated)", border: "1px solid var(--accent-border)", borderRadius: 10, color: "var(--text-1)", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
            onKeyDown={e => {
              if (e.key === "Enter" && retryVal.trim()) { onRetry(retryVal.trim()); setRetrying(false); setRetryVal(""); }
              if (e.key === "Escape") { setRetrying(false); setRetryVal(""); }
            }} />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button disabled={!retryVal.trim()}
              onClick={() => { if (retryVal.trim()) { onRetry(retryVal.trim()); setRetrying(false); setRetryVal(""); } }}
              style={{ flex: 1, padding: "8px", fontSize: 12, fontWeight: 600, background: "var(--accent)", color: "#fff", border: "none", borderRadius: 9, cursor: "pointer", opacity: retryVal.trim() ? 1 : 0.4, fontFamily: "inherit" }}>
              Search
            </button>
            <button onClick={() => { setRetrying(false); setRetryVal(""); }}
              style={{ padding: "8px 14px", fontSize: 12, fontWeight: 500, background: "transparent", color: "var(--text-3)", border: "1px solid var(--border)", borderRadius: 9, cursor: "pointer", fontFamily: "inherit" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Wrong result row */}
      {(isFound || isOverride) && !editing && !retrying && (
        <div style={{ borderTop: "1px solid var(--border)", display: "flex" }} onClick={e => e.stopPropagation()}>
          <button onClick={e => { e.stopPropagation(); setRetrying(true); }}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 0", fontSize: 11, fontWeight: 500, color: "var(--text-3)", background: "transparent", border: "none", borderRight: "1px solid var(--border)", cursor: "pointer", borderRadius: "0 0 0 16px", fontFamily: "inherit" }}
            className="sr-footer-btn">
            <svg style={{ width: 12, height: 12 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" strokeWidth="2"/><path d="M21 21l-4.3-4.3" strokeWidth="2"/>
            </svg>
            Try username
          </button>
          <button onClick={e => { e.stopPropagation(); setEditing(true); }}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 0", fontSize: 11, fontWeight: 500, color: "var(--text-3)", background: "transparent", border: "none", cursor: "pointer", borderRadius: "0 0 16px 0", fontFamily: "inherit" }}
            className="sr-footer-btn">
            <svg style={{ width: 12, height: 12 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Paste URL
          </button>
        </div>
      )}

      {/* Paste URL input */}
      {editing && (
        <div style={{ padding: "0 14px 14px", borderTop: "1px solid var(--border)" }} onClick={e => e.stopPropagation()}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", margin: "10px 0 8px" }}>Paste the correct profile URL:</p>
          <input ref={inputRef} type="text" value={overrideVal} onChange={e => setOverride(e.target.value)}
            placeholder={URL_PLACEHOLDERS[platformId] || "https://example.com/username"}
            style={{ width: "100%", padding: "9px 12px", background: "var(--bg-elevated)", border: "1px solid var(--accent-border)", borderRadius: 10, color: "var(--text-1)", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
            onKeyDown={e => {
              if (e.key === "Enter" && overrideVal.trim()) { onOverride(overrideVal.trim()); setEditing(false); }
              if (e.key === "Escape") setEditing(false);
            }} />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button disabled={!overrideVal.trim()}
              onClick={() => { if (overrideVal.trim()) { onOverride(overrideVal.trim()); setEditing(false); } }}
              style={{ flex: 1, padding: "8px", fontSize: 12, fontWeight: 600, background: "var(--accent)", color: "#fff", border: "none", borderRadius: 9, cursor: "pointer", opacity: overrideVal.trim() ? 1 : 0.4, fontFamily: "inherit" }}>
              Use this URL
            </button>
            <button onClick={() => setEditing(false)}
              style={{ padding: "8px 14px", fontSize: 12, fontWeight: 500, background: "transparent", color: "var(--text-3)", border: "1px solid var(--border)", borderRadius: 9, cursor: "pointer", fontFamily: "inherit" }}>
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
  const navigate = useNavigate();
  const location = useLocation();
  const state    = location.state || {};

  const sp             = new URLSearchParams(location.search);
  const qParam         = sp.get("query") || "";
  // Allow external entry points (e.g. the reputationreturn.com embed) to pass
  // mode + platforms + location via URL params, not just React Router state.
  const modeParam      = sp.get("mode");                       // "company" | "person"
  const platformsParam = sp.get("platforms");                  // comma list, e.g. "twitter,instagram,google"
  const locationParam  = sp.get("location") || "";
  const username       = state.username || qParam || "";
  const mode           = state.mode || modeParam || "company";
  const platforms      = state.platforms
    || (platformsParam ? platformsParam.split(",").map(p => p.trim()).filter(Boolean) : null)
    || ALL_PLATFORMS.map(p => p.id).filter(id => id !== "google");
  const handles        = state.handles || Object.fromEntries(platforms.map(p => [p, username]));
  const googleLocation = state.googleLocation || locationParam || "";

  const [profiles, setProfiles] = useState(
    () => Object.fromEntries(platforms.map(p => [p, undefined]))
  );
  const [selected, setSelected]                   = useState(new Set());
  const [showPlatformPicker, setShowPlatformPicker] = useState(false);

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
  }, []);

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

  const buildUserForPlatform = (platformId, p) => {
    const raw = p?.raw;
    if (!raw) return null;
    if (platformId === "twitter")   return { name: raw.name, screen_name: raw.screen_name || raw.screenName, avatar: raw.avatar, followers_count: raw.followers_count || raw.followers, description: raw.description, platform: "twitter" };
    if (platformId === "instagram") return { name: raw.full_name || raw.username, screen_name: raw.username, avatar: raw.avatar || raw.profile_pic_url, followers_count: raw.follower_count, biography: raw.biography, is_verified: raw.is_verified, platform: "instagram" };
    if (platformId === "tiktok")    return { name: raw.nickname, screen_name: raw.unique_id || raw.uniqueId, avatar: raw.avatar, sec_uid: raw.sec_uid || raw.secUid, follower_count: raw.follower_count || raw.followerCount, signature: raw.signature, platform: "tiktok" };
    if (platformId === "facebook")  return { name: raw.name, username: raw.username, avatar: raw.avatar, facebook_id: raw.facebook_id, url: raw.url, followers: raw.followers, type: raw.type, platform: "facebook" };
    if (platformId === "linkedin")  return { name: raw.full_name || raw.name, screen_name: raw.url?.split("/").filter(Boolean).pop(), avatar: raw.avatar, headline: raw.headline, url: raw.url, follower_count: raw.follower_count, platform: "linkedin" };
    if (platformId === "google")    return { name: raw.name, screen_name: raw.address, avatar: raw.avatar, business_id: raw.business_id, url: raw.url, platform: "google" };
    return null;
  };

  const handleGenerateReport = (reportType, forcePlatformId = null) => {
    const selectedArr = [...selected];

    if (reportType === "combined") {
      const toggles = {}, urls = {};
      selectedArr.forEach(id => {
        toggles[id] = true;
        urls[id] = buildUrl(id, profiles[id]);
        if (id === "google" && profiles[id]?.businessId) urls["googleBusinessId"] = profiles[id].businessId;
      });
      const avatar = selectedArr.map(id => profiles[id]?.avatar).find(a => a && typeof a === "string" && a.startsWith("http")) || null;
      navigate("/profile", { state: { brandName: username, urls, toggles, mode, avatar } });
      return;
    }

    if (reportType === "individual" && selectedArr.length > 1 && !forcePlatformId) {
      setShowPlatformPicker(true);
      return;
    }

    const targetId = forcePlatformId || selectedArr[0];
    const p = profiles[targetId];
    const user = buildUserForPlatform(targetId, p);
    if (user) navigate("/profile", { state: { user, mode } });
  };

  const anyLoading  = platforms.some(p => profiles[p] === undefined);
  const foundCount  = platforms.filter(p => profiles[p]?.found).length;
  const selectedArr = [...selected];

  if (!username) { navigate("/"); return null; }

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-page)",
      color: "var(--text-1)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      <style>{GLOBAL_CSS}</style>

      {/* Grid background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }} />

      {/* Sticky top bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        height: 60,
        background: "rgba(248,249,252,0.96)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        boxShadow: "0 1px 8px rgba(15,23,42,0.07)",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", gap: 16, height: "100%" }}>
          <button onClick={() => navigate("/")}
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-3)", background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0, fontFamily: "inherit" }}
            onMouseOver={e => e.currentTarget.style.color = "var(--text-2)"}
            onMouseOut={e => e.currentTarget.style.color = "var(--text-3)"}>
            <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>

          <div style={{
            flex: 1, maxWidth: 520, display: "flex", alignItems: "center", gap: 10,
            padding: "9px 16px", borderRadius: 12,
            background: "var(--bg-surface)", border: "1px solid var(--accent-border)",
          }}>
            <svg style={{ width: 14, height: 14, color: "var(--accent)", flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" strokeWidth="2"/><path d="M21 21l-4.3-4.3" strokeWidth="2"/>
            </svg>
            <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{username}</span>
            <span style={{
              fontSize: 11, fontWeight: 600,
              color: mode === "company" ? "var(--accent)" : "var(--amber)",
              background: mode === "company" ? "var(--accent-dim)" : "var(--amber-dim)",
              border: `1px solid ${mode === "company" ? "var(--accent-border)" : "rgba(251,191,36,0.25)"}`,
              padding: "2px 8px", borderRadius: 999, flexShrink: 0,
            }}>
              {mode === "company" ? "🏢 Business" : "👤 Person"}
            </span>
          </div>

          <div style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-3)", flexShrink: 0 }}>
            {anyLoading
              ? <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", animation: "pulse-dot 1.2s ease-in-out infinite" }} />
                  Searching…
                </span>
              : <><span style={{ color: "var(--green)", fontFamily: "monospace", fontWeight: 600 }}>{foundCount}</span> of {platforms.length} found</>
            }
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px 160px", position: "relative", zIndex: 1 }}>

        {/* Instruction banner */}
        <div style={{
          display: "flex", gap: 14, padding: "16px 18px", marginBottom: 24,
          background: "var(--accent-dim)", border: "1px solid var(--accent-border)",
          borderRadius: 14,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: "var(--accent-dim)", border: "1px solid var(--accent-border)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
          }}>🤖</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", margin: "0 0 8px" }}>AI picked the best match on each platform</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {[
                ["1", "Review each card — check the name, photo and follower count"],
                ["2", <>Wrong account? Use <strong style={{ color: "var(--accent)" }}>Try username</strong> or <strong style={{ color: "var(--accent)" }}>Paste URL</strong> at the bottom of each card</>],
                ["3", "Select the platforms you want, then tap Generate Report"],
              ].map(([n, text]) => (
                <div key={n} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff", flexShrink: 0, marginTop: 1 }}>{n}</div>
                  <span style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 310px), 1fr))",
          gap: 14,
        }}>
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

      {/* Sticky generate bar */}
      {selectedArr.length > 0 && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 30,
          padding: "0 12px",
          paddingBottom: "max(16px, env(safe-area-inset-bottom, 16px))",
        }}>
          <div className="sr-generate-bar" style={{
            maxWidth: 900, margin: "0 auto",
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: 18,
            boxShadow: "0 -4px 24px rgba(15,23,42,0.12), var(--shadow-glow)",
            padding: "14px 18px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
          }}>
            <div className="sr-generate-info" style={{ minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)", margin: 0 }}>
                {selectedArr.length} platform{selectedArr.length > 1 ? "s" : ""} selected
              </p>
              <p style={{ fontSize: 11, color: "var(--text-3)", margin: "3px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 }}>
                {selectedArr.map(id => ALL_PLATFORMS.find(p => p.id === id)?.label).join(", ")}
              </p>
            </div>

            <div className="sr-generate-btns" style={{ display: "flex", gap: 10, flexShrink: 0 }}>
              {selectedArr.length === 1 ? (
                <button onClick={() => handleGenerateReport("individual")}
                  className="sr-btn-primary"
                  style={{ padding: "12px 22px", fontSize: 13, fontWeight: 700, background: "var(--accent)", color: "#fff", border: "none", borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "var(--shadow-btn)", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                  Generate Report
                  <svg style={{ width: 14, height: 14, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M5 12h14M13 5l7 7-7 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              ) : (
                <>
                  <button onClick={() => handleGenerateReport("individual")}
                    style={{ padding: "12px 18px", fontSize: 13, fontWeight: 500, background: "transparent", color: "var(--text-2)", border: "1px solid var(--border)", borderRadius: 12, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", flex: 1, textAlign: "center" }}
                    className="sr-btn-ghost">
                    Individual
                  </button>
                  <button onClick={() => handleGenerateReport("combined")}
                    className="sr-btn-primary"
                    style={{ padding: "12px 22px", fontSize: 13, fontWeight: 700, background: "var(--accent)", color: "#fff", border: "none", borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "var(--shadow-btn)", fontFamily: "inherit", whiteSpace: "nowrap", flex: 1 }}>
                    Combined
                    <svg style={{ width: 14, height: 14, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M5 12h14M13 5l7 7-7 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Platform picker bottom sheet */}
      {showPlatformPicker && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowPlatformPicker(false)}>
          <div style={{
            width: "100%", maxWidth: 580,
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "24px 24px 0 0",
            boxShadow: "0 -8px 40px rgba(15,23,42,0.18)",
          }} onClick={e => e.stopPropagation()}>
            {/* Handle */}
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
              <div style={{ width: 36, height: 4, borderRadius: 999, background: "var(--border)" }} />
            </div>
            <div style={{ padding: "8px 24px 32px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: "var(--text-1)" }}>Pick platform for individual report</h3>
                <button onClick={() => setShowPlatformPicker(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", fontSize: 18, lineHeight: 1, padding: "4px", fontFamily: "inherit" }}>×</button>
              </div>
              <p style={{ fontSize: 12, color: "var(--text-3)", margin: "0 0 16px" }}>Each platform gives a focused report on that channel only.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {selectedArr.map(platformId => {
                  const pl = ALL_PLATFORMS.find(p => p.id === platformId);
                  const prof = profiles[platformId];
                  const followers = prof?.followers;
                  const fmtFollowers = followers >= 1_000_000 ? `${(followers/1_000_000).toFixed(1)}M` : followers >= 1000 ? `${(followers/1000).toFixed(1)}K` : followers ? String(followers) : null;
                  return (
                    <button key={platformId}
                      onClick={() => { setShowPlatformPicker(false); handleGenerateReport("individual", platformId); }}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14, background: "var(--bg-elevated)", border: "1px solid var(--border)", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}
                      onMouseOver={e => { e.currentTarget.style.background = "var(--accent-dim)"; e.currentTarget.style.borderColor = "var(--accent-border)"; }}
                      onMouseOut={e => { e.currentTarget.style.background = "var(--bg-elevated)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: pl?.bg, color: pl?.tc, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <PlatformIcon id={platformId} size={16} />
                      </div>
                      {prof?.avatar && (
                        <img src={prof.avatar} alt="" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid var(--accent-border)" }}
                          onError={e => { e.target.style.display = "none"; }} />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prof?.name || pl?.label}</div>
                        <div style={{ fontSize: 11, color: "var(--text-3)" }}>
                          {prof?.username ? `@${prof.username}` : pl?.label}
                          {fmtFollowers ? ` · ${fmtFollowers} followers` : ""}
                        </div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", background: "var(--accent-dim)", border: "1px solid var(--accent-border)", padding: "4px 12px", borderRadius: 999, flexShrink: 0 }}>
                        Select →
                      </span>
                    </button>
                  );
                })}
              </div>
              <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-3)", marginTop: 16 }}>
                Want all platforms in one report?{" "}
                <button onClick={() => { setShowPlatformPicker(false); handleGenerateReport("combined"); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent)", fontWeight: 600, fontSize: 12, padding: 0, fontFamily: "inherit" }}>
                  Use Combined →
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
