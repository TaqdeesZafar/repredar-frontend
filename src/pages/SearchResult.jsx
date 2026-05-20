import { useState, useEffect, useRef } from "react";
import { HiOutlineArrowRight, HiOutlineCheck, HiOutlineX } from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import {
  fetchTwitterData,
  fetchLinkedInData,
  fetchTikTokData,
  fetchFacebookData,
  fetchFacebookProfileUsers,
  fetchInstagramData,
} from "../api/apiClient";

import twitterVerifiedBadge from "../assets/Twitter_Verified_Badge.svg.png";

const PLATFORMS = ["X", "LinkedIn", "TikTok", "Facebook", "Instagram"];

// Normalise each platform's API response to a display object
function normaliseResult(platform, data, searchMode) {
  const preferCompany = searchMode === "company";

  if (platform === "X") {
    const users = data?.twitterUsers?.timeline || [];
    if (!users.length) return null;
    const u = users[0];
    return {
      name: u.name,
      screenName: `@${u.screen_name}`,
      avatar: u.avatar,
      followers: u.followers_count ?? null,
      verified: u.is_blue_verified || u.blue_verified,
      raw: u,
    };
  }

  if (platform === "LinkedIn") {
    const users = data?.linkedinUsers || [];
    if (!users.length) return null;
    // In company mode prefer Company type; in person mode prefer Person type
    const preferred = users.find(u => preferCompany ? u.type === "Company" : u.type === "Person");
    const u = preferred || users[0];
    const initials = (u.full_name || "?").split(" ").filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase();
    return {
      name: u.full_name,
      screenName: u.type,
      avatar: u.profile_picture?.[0]?.url || null,
      initials,
      followers: u.follower_count || null,
      url: u.url,
      raw: u,
    };
  }

  if (platform === "TikTok") {
    const users = data?.tiktokUsers || [];
    if (!users.length) return null;
    // In company mode prefer verified accounts (brands tend to be verified)
    const u = preferCompany
      ? (users.find(u => u.user_info?.verified) || users[0])
      : users[0];
    return {
      name: u.user_info?.nickname,
      screenName: `@${u.user_info?.unique_id}`,
      avatar: u.user_info?.avatar_thumb?.url_list?.[0] || null,
      followers: u.user_info?.follower_count ?? null,
      verified: u.user_info?.verified,
      raw: u,
    };
  }

  if (platform === "Facebook") {
    // Company mode uses Pages data, Person mode uses Profile data
    const users = preferCompany
      ? (data?.facebookUsers || [])
      : (data?.facebookUsers || []);
    if (!users.length) return null;
    const u = users[0];
    return {
      name: u.name,
      screenName: u.type,
      avatar: u.image?.uri || null,
      followers: null,
      verified: u.is_verified,
      raw: u,
    };
  }

  if (platform === "Instagram") {
    const users = data?.instagramUsers || [];
    if (!users.length) return null;
    const u = preferCompany
      ? (users.find(u => u.is_verified) || users[0])
      : users[0];
    return {
      name: u.full_name,
      screenName: `@${u.username}`,
      avatar: u.profile_pic_url || null,
      followers: null,
      verified: u.is_verified,
      raw: u,
    };
  }

  return null;
}

function formatFollowers(n) {
  if (!n && n !== 0) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M followers`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K followers`;
  return `${n} followers`;
}

function PlatformIcon({ platform }) {
  if (platform === "X") return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
  if (platform === "LinkedIn") return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
  if (platform === "TikTok") return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  );
  if (platform === "Facebook") return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
  if (platform === "Instagram") return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162S8.597 18.163 12 18.163s6.162-2.759 6.162-6.162S15.403 5.838 12 5.838zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
  return null;
}

function Avatar({ src, initials, size = 44 }) {
  const [failed, setFailed] = useState(false);
  return (
    <div style={{ width: size, height: size }} className="relative flex-shrink-0">
      <div
        style={{ width: size, height: size }}
        className="rounded-full bg-blue-600 flex items-center justify-center absolute inset-0"
      >
        <span className="text-white font-bold text-sm">{initials || "?"}</span>
      </div>
      {src && !failed && (
        <img
          src={src}
          alt=""
          style={{ width: size, height: size }}
          className="rounded-full object-cover absolute inset-0"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

function OverrideInput({ platform, onConfirm, onCancel }) {
  const [val, setVal] = useState("");
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);
  return (
    <div className="mt-3 space-y-2" onClick={e => e.stopPropagation()}>
      <p className="text-xs text-gray-500">Paste the correct {platform} profile URL:</p>
      <div className="flex gap-2">
        <input
          ref={ref}
          type="text"
          value={val}
          onChange={e => setVal(e.target.value)}
          placeholder={`https://...`}
          className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={e => { if (e.key === "Enter" && val.trim()) onConfirm(val.trim()); if (e.key === "Escape") onCancel(); }}
        />
        <button
          disabled={!val.trim()}
          onClick={() => val.trim() && onConfirm(val.trim())}
          className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-40"
        >
          Use this
        </button>
        <button onClick={onCancel} className="p-1.5 text-gray-400 hover:text-gray-600">
          <HiOutlineX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function PlatformCard({ platform, status, result, selected, onToggle, onOverrideConfirm }) {
  const [showOverride, setShowOverride] = useState(false);

  const isLoading = status === "loading";
  const isFound = status === "found";
  const isEmpty = status === "empty";
  const isError = status === "error";
  const isOverridden = status === "overridden";
  const canSelect = isFound || isOverridden;

  const borderColor = selected
    ? { X: "border-gray-900", LinkedIn: "border-blue-700", TikTok: "border-gray-900", Facebook: "border-blue-600", Instagram: "border-pink-500" }[platform]
    : "border-gray-200";

  return (
    <div
      className={`relative rounded-xl border-2 p-4 transition-all ${borderColor} ${
        selected ? "bg-blue-50 shadow-md" : "bg-white hover:border-gray-300 hover:shadow-sm"
      } ${canSelect && !showOverride ? "cursor-pointer" : ""}`}
      onClick={() => { if (canSelect && !showOverride) onToggle(); }}
    >
      {/* Selected checkmark */}
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center pointer-events-none">
          <HiOutlineCheck className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Platform header */}
      <div className="flex items-center gap-2 mb-3">
        <div className={selected ? "text-blue-700" : "text-gray-600"}>
          <PlatformIcon platform={platform} />
        </div>
        <span className="font-semibold text-sm text-gray-800">{platform}</span>
        <div className="ml-auto flex items-center gap-1.5">
          {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent" />}
          {isFound && <span className="text-xs text-green-600 font-medium">Found</span>}
          {isOverridden && <span className="text-xs text-blue-600 font-medium">Custom</span>}
          {isEmpty && <span className="text-xs text-gray-400">No results</span>}
          {isError && <span className="text-xs text-red-400">Error</span>}
        </div>
      </div>

      {/* Skeleton while loading */}
      {isLoading && (
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
          </div>
        </div>
      )}

      {/* Result row */}
      {(isFound || isOverridden) && result && (
        <div className="flex items-center gap-3">
          <Avatar
            src={result.avatar}
            initials={result.initials || (result.name || "?").split(" ").filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase()}
            size={44}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="font-medium text-sm text-gray-900 truncate">{result.name}</p>
              {result.verified && (
                platform === "X"
                  ? <img src={twitterVerifiedBadge} alt="" className="w-4 h-4 flex-shrink-0" />
                  : <span className="text-blue-500 text-xs flex-shrink-0">✓</span>
              )}
            </div>
            <p className="text-xs text-gray-500 truncate">{result.screenName}</p>
            {result.followers != null && (
              <p className="text-xs text-blue-600 font-medium">{formatFollowers(result.followers)}</p>
            )}
          </div>
        </div>
      )}

      {/* Empty / error state */}
      {(isEmpty || isError) && !showOverride && (
        <p className="text-xs text-gray-400 mt-1">
          {isError ? "Couldn't load results." : "No match found for this platform."}
        </p>
      )}

      {/* "Not the right one?" link */}
      {(isFound || isOverridden) && !showOverride && (
        <button
          className="mt-3 text-xs text-gray-400 hover:text-blue-600 transition-colors"
          onClick={e => { e.stopPropagation(); setShowOverride(true); }}
        >
          Not the right one? Paste a URL instead →
        </button>
      )}

      {/* Paste URL manually for empty/error */}
      {(isEmpty || isError) && !showOverride && (
        <button
          className="mt-2 text-xs text-blue-600 hover:underline font-medium"
          onClick={e => { e.stopPropagation(); setShowOverride(true); }}
        >
          + Paste URL manually
        </button>
      )}

      {/* Override input */}
      {showOverride && (
        <OverrideInput
          platform={platform}
          onConfirm={(url) => { onOverrideConfirm(url); setShowOverride(false); }}
          onCancel={() => setShowOverride(false)}
        />
      )}
    </div>
  );
}

export default function SearchResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("query") || location.state?.query || "";

  const [searchMode, setSearchMode] = useState("person"); // "person" | "company"

  const [platforms, setPlatforms] = useState(() =>
    Object.fromEntries(PLATFORMS.map(p => [p, { status: "loading", result: null, rawData: null, overrideUrl: "" }]))
  );
  const [selected, setSelected] = useState(new Set());

  const runSearch = (query, mode) => {
    setPlatforms(Object.fromEntries(PLATFORMS.map(p => [p, { status: "loading", result: null, rawData: null, overrideUrl: "" }])));
    setSelected(new Set());

    const fetchers = {
      // Twitter: pass search_type based on mode
      X: () => fetchTwitterData(query, mode === "company" ? "Top" : "People"),
      LinkedIn: () => fetchLinkedInData(query),
      TikTok: () => fetchTikTokData(query),
      // Facebook: pages for company, profiles for person
      Facebook: () => mode === "company" ? fetchFacebookData(query) : fetchFacebookProfileUsers(query),
      Instagram: () => fetchInstagramData(query),
    };

    PLATFORMS.forEach(platform => {
      fetchers[platform]()
        .then(data => {
          const result = normaliseResult(platform, data, mode);
          setPlatforms(prev => ({
            ...prev,
            [platform]: { ...prev[platform], status: result ? "found" : "empty", result, rawData: data },
          }));
          if (result) setSelected(prev => new Set([...prev, platform]));
        })
        .catch(() => {
          setPlatforms(prev => ({ ...prev, [platform]: { ...prev[platform], status: "error", result: null, rawData: null } }));
        });
    });
  };

  // Fire on mount
  useEffect(() => {
    if (!searchQuery) return;
    runSearch(searchQuery, searchMode);
  }, [searchQuery]);

  // Re-fire when mode toggles
  const handleModeChange = (mode) => {
    if (mode === searchMode) return;
    setSearchMode(mode);
    if (searchQuery) runSearch(searchQuery, mode);
  };

  const toggleSelect = (platform) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(platform) ? next.delete(platform) : next.add(platform);
      return next;
    });
  };

  const handleOverride = (platform, url) => {
    setPlatforms(prev => ({
      ...prev,
      [platform]: { ...prev[platform], status: "overridden", result: { name: url, screenName: url, avatar: null, followers: null }, overrideUrl: url },
    }));
    setSelected(prev => new Set([...prev, platform]));
  };

  const buildProfileUrl = (platform) => {
    const p = platforms[platform];
    if (p.status === "overridden") return p.overrideUrl;
    const raw = p.rawData;
    if (!raw) return "";
    if (platform === "X") {
      const sn = raw.twitterUsers?.timeline?.[0]?.screen_name;
      return sn ? `https://twitter.com/${sn}` : "";
    }
    if (platform === "LinkedIn") return raw.linkedinUsers?.[0]?.url || "";
    if (platform === "TikTok") {
      const id = raw.tiktokUsers?.[0]?.user_info?.unique_id;
      return id ? `https://www.tiktok.com/@${id}` : "";
    }
    if (platform === "Facebook") return raw.facebookUsers?.[0]?.url || "";
    if (platform === "Instagram") {
      const un = raw.instagramUsers?.[0]?.username;
      return un ? `https://www.instagram.com/${un}` : "";
    }
    return "";
  };

  const handleGenerateReport = (reportType) => {
    if (reportType === "combined") {
      const toggles = {};
      const urls = {};
      PLATFORMS.forEach(p => {
        const on = selected.has(p);
        const key = p === "Instagram" ? "InstaRab" : p;
        toggles[key] = on;
        if (on) urls[key] = buildProfileUrl(p);
      });
      navigate("/profile", { state: { brandName: searchQuery, urls, toggles } });
      return;
    }

    // Individual: navigate with the first selected platform's user object
    const firstPlatform = [...selected][0];
    const p = platforms[firstPlatform];
    const raw = p.rawData;

    if (firstPlatform === "X") {
      const u = raw?.twitterUsers?.timeline?.[0];
      if (u) navigate("/profile", { state: { user: { ...u, platform: "X" } } });
    } else if (firstPlatform === "LinkedIn") {
      const u = raw?.linkedinUsers?.[0];
      if (u) navigate("/profile", { state: { user: { name: u.full_name, screen_name: u.type, avatar: u.profile_picture?.[0]?.url || null, headline: u.headline, url: u.url, platform: "linkedin" } } });
    } else if (firstPlatform === "TikTok") {
      const u = raw?.tiktokUsers?.[0];
      if (u) navigate("/profile", { state: { user: { name: u.user_info.nickname, screen_name: u.user_info.unique_id, avatar: u.user_info.avatar_thumb?.url_list?.[0], sec_uid: u.user_info.sec_uid, follower_count: u.user_info.follower_count, signature: u.user_info.signature, platform: "tiktok" } } });
    } else if (firstPlatform === "Facebook") {
      const u = raw?.facebookUsers?.[0];
      if (u) navigate("/profile", { state: { user: { name: u.name, screen_name: u.type, avatar: u.image?.uri, facebook_id: u.facebook_id, url: u.url, is_verified: u.is_verified, platform: "facebook" } } });
    } else if (firstPlatform === "Instagram") {
      const u = raw?.instagramUsers?.[0];
      if (u) navigate("/profile", { state: { user: { name: u.full_name, screen_name: u.username, avatar: u.profile_pic_url, instagram_id: u.id, is_verified: u.is_verified, platform: "instagram" } } });
    }
  };

  const anyLoading = PLATFORMS.some(p => platforms[p].status === "loading");
  const selectedCount = selected.size;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search bar */}
      <header className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <SearchBar placeholder="Search for a business or person..." initialValue={searchQuery} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Person / Company toggle */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm text-gray-500 font-medium">Searching for:</span>
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 gap-1">
            <button
              onClick={() => handleModeChange("person")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                searchMode === "person"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Person
            </button>
            <button
              onClick={() => handleModeChange("company")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                searchMode === "company"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Company / Brand
            </button>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            {anyLoading
              ? `Searching "${searchQuery}" across all platforms…`
              : `Results for "${searchQuery}"`}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Select the accounts you want to include in the report. If a result is wrong, click "Not the right one?" to paste the correct URL.
          </p>
        </div>

        {/* Platform grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {PLATFORMS.map(platform => (
            <PlatformCard
              key={platform}
              platform={platform}
              status={platforms[platform].status}
              result={platforms[platform].result}
              selected={selected.has(platform)}
              onToggle={() => toggleSelect(platform)}
              onOverrideConfirm={(url) => handleOverride(platform, url)}
            />
          ))}
        </div>

        {/* Sticky generate bar */}
        {selectedCount > 0 && (
          <div className="sticky bottom-6 bg-white border border-gray-200 rounded-2xl shadow-lg px-6 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {selectedCount} platform{selectedCount > 1 ? "s" : ""} selected
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{[...selected].join(", ")}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {selectedCount === 1 ? (
                <button
                  onClick={() => handleGenerateReport("individual")}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  Generate Report <HiOutlineArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleGenerateReport("individual")}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
                  >
                    Individual Reports
                  </button>
                  <button
                    onClick={() => handleGenerateReport("combined")}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    Combined Report <HiOutlineArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
