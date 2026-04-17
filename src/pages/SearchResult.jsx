import { useState, useEffect } from "react";
import { HiOutlineArrowRight, HiOutlineUsers } from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import useDataStore from "../store/useDataStore";
import Logo from "../components/common/Logo";
// Remove the old SVG component import
// import VerifiedBadge from "../assets/BlueTickIcon";

// Import the PNG image
import twitterVerifiedBadge from "../assets/Twitter_Verified_Badge.svg.png";

function SearchResult() {
  const [platformToggles, setPlatformToggles] = useState({
    X: false,
    LinkedIn: false,
    TikTok: false,
    Facebook: false,
    InstaRab: false,
    Instagram: false,
  });
  const [brandName, setBrandName] = useState("");
  const [inputValues, setInputValues] = useState({
    X: "",
    LinkedIn: "",
    TikTok: "",
    Facebook: "",
    InstaRab: "",
    Instagram: "",
  });
  const [facebookSubTab, setFacebookSubTab] = useState("Pages");
  const [facebookType, setFacebookType] = useState("page");
  const [linkedinType, setLinkedinType] = useState("company");
  const [googleLocation, setGoogleLocation] = useState("");
  const [googleResults, setGoogleResults] = useState([]);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");

  const {
    twitterData,
    linkedinData,
    tiktokData,
    facebookData,
    facebookProfileData,
    instagramData,
    loading,
    activeTab,
    setActiveTab,
    getTwitterData,
    getLinkedInData,
    getTikTokData,
    getFacebookData,
    getFacebookProfileData,
    getInstagramData,
    setLoadingFalse,
    googleBusinessData,
    setGoogleBusinessData,
  } = useDataStore();

  const navigate = useNavigate();
  const location = useLocation();
  
  // Get query from URL parameters or state
  const searchParams = new URLSearchParams(location.search);
  const queryFromUrl = searchParams.get('query');
  const searchQuery = queryFromUrl || location.state?.query || "";

  // Map store data to simplify rendering
  const dataMap = {
    X: twitterData?.twitterUsers?.timeline || [],
    LinkedIn: linkedinData?.linkedinUsers || [],
    TikTok: tiktokData?.tiktokUsers || [],
    Facebook: facebookSubTab === "Pages"
      ? facebookData?.facebookUsers || []
      : facebookProfileData?.facebookUsers || [],
    Instagram: instagramData?.instagramUsers || [],
  };
  const currentData = dataMap[activeTab] || [];

  const getCurrentData = () => {
    if (activeTab === "X") {
      return twitterData?.twitterUsers?.timeline || [];
    }
    if (activeTab === "LinkedIn") {
      return linkedinData?.linkedinUsers || [];
    }
    if (activeTab === "TikTok") {
      return tiktokData?.tiktokUsers || [];
    }
    if (activeTab === "Facebook") {
      return facebookSubTab === "Pages"
        ? facebookData?.facebookUsers || []
        : facebookProfileData?.facebookUsers || [];
    }
    if (activeTab === "Instagram") {
      return instagramData?.instagramUsers || [];
    }
    return [];
  };

  // Fetch data whenever the active tab or search query changes
  useEffect(() => {
    if (!searchQuery) return;
  
    switch (activeTab) {
      case "X":
        if (!twitterData || twitterData.query !== searchQuery) {
          getTwitterData(searchQuery);
        }
        break;
      case "LinkedIn":
        if (!linkedinData || linkedinData.query !== searchQuery) {
          getLinkedInData(searchQuery);
        }
        break;
      case "TikTok":
        if (!tiktokData || tiktokData.query !== searchQuery) {
          getTikTokData(searchQuery);
        }
        break;
      case "Facebook":
        if (facebookSubTab === "Pages") {
          if (!facebookData || facebookData.query !== searchQuery) {
            getFacebookData(searchQuery);
          }
        } else {
          if (!facebookProfileData || facebookProfileData.query !== searchQuery) {
            getFacebookProfileData(searchQuery);
          }
        }
        break;
      case "Instagram":
        if (!instagramData || instagramData.query !== searchQuery) {
          getInstagramData(searchQuery);
        }
        break;
      default:
        setLoadingFalse();
        break;
    }
  }, [activeTab, searchQuery, facebookSubTab]);
  

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    if (tab !== "Cross Platform") {
      setPlatformToggles({
        X: false,
        LinkedIn: false,
        TikTok: false,
        Facebook: false,
        InstaRab: false,
        Instagram: false,
      });
    }

    localStorage.removeItem("profileUserData");
  };

  const handleUserClick = (user) => {
    switch (activeTab) {
      case "LinkedIn": {
        const linkedinUser = {
          name: user.full_name,
          screen_name: user.type,
          avatar:
            user.profile_picture?.[0]?.url || "https://via.placeholder.com/100",
          headline: user.headline,
          url: user.url,
          platform: "linkedin",
        };
        navigate("/profile", { state: { user: linkedinUser } });
        break;
      }
      case "TikTok": {
        const tiktokUser = {
          name: user.user_info.nickname,
          screen_name: user.user_info.unique_id,
          avatar: user.user_info.avatar_thumb.url_list[0],
          sec_uid: user.user_info.sec_uid,
          follower_count: user.user_info.follower_count,
          signature: user.user_info.signature,
          platform: "tiktok",
        };
        navigate("/profile", { state: { user: tiktokUser } });
        break;
      }
      case "Facebook": {
        const facebookUser = {
          name: user.name,
          screen_name: user.type,
          avatar: user.image.uri,
          facebook_id: user.facebook_id,
          url: user.url,
          is_verified: user.is_verified,
          platform: "facebook",
        };
        navigate("/profile", { state: { user: facebookUser, subtab: facebookSubTab } });
        break;
      }
      case "Instagram": {
        const instagramUser = {
          name: user.full_name,
          screen_name: user.username,
          avatar: user.profile_pic_url,
          instagram_id: user.id,
          is_verified: user.is_verified,
          platform: "instagram",
        };
        navigate("/profile", { state: { user: instagramUser } });
        break;
      }
      default: {
        const twitterUser = { ...user, platform: "X" };
        navigate("/profile", { state: { user: twitterUser } });
        break;
      }
    }
  };

  const handleToggleChange = (platform) => {
    setPlatformToggles((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }));
  };

  const handleInputChange = (platform, value) => {
    setInputValues((prev) => ({ ...prev, [platform]: value }));
  };

  const handleReportGenerate = async () => {
    try {
      // Log cross-platform search
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/search-logs/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: 'CROSS_PLATFORM',
          searchQuery: brandName,
          filters: {
            platforms: Object.entries(platformToggles)
              .filter(([_, enabled]) => enabled)
              .map(([platform]) => platform),
            urls: inputValues
          }
        })
      });
    } catch (error) {
      console.error('Error logging cross-platform search:', error);
    }
    
    const navigationState = { 
      brandName, 
      urls: inputValues, 
      toggles: platformToggles,
      facebookType: platformToggles.Facebook ? facebookType : undefined,
      linkedinType: platformToggles.LinkedIn ? linkedinType : undefined,
    };
    
    console.log('Navigation state being passed:', navigationState);
    console.log('Facebook toggle:', platformToggles.Facebook);
    console.log('Facebook type:', facebookType);
    
    navigate("/profile", {
      state: navigationState
    });
  };

  // Google Business search handler
  const handleGoogleBusinessSearch = async () => {
    if (!searchQuery.trim() || !googleLocation.trim()) return;
    setGoogleLoading(true);
    setGoogleError("");
    setGoogleResults([]);
    try {
      const joinedQuery = `${searchQuery}, ${googleLocation}`;
      const url = `${import.meta.env.VITE_BACKEND_URL}/google/fetch-businesses?query=${encodeURIComponent(joinedQuery)}`;
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      console.log(data);
      if (data.googleUsers.status === "OK" && Array.isArray(data.googleUsers.data)) {
        setGoogleResults(data.googleUsers.data);
        setGoogleBusinessData({ data: data.googleUsers.data, query: joinedQuery });
      } else {
        setGoogleError("No results found.");
      }
    } catch (err) {
      setGoogleError("Failed to fetch Google Business data.");
    } finally {
      setGoogleLoading(false);
    }
  };

  // Instantly fetch on tab select if both searchQuery and googleLocation are present
  useEffect(() => {
    if (activeTab === "Google Business") {
      if (googleBusinessData && googleBusinessData.query === `${searchQuery}, ${googleLocation}`) {
        setGoogleResults(googleBusinessData.data);
        setGoogleError("");
        setGoogleLoading(false);
      } else if (searchQuery && googleLocation) {
        handleGoogleBusinessSearch();
      } else {
        setGoogleResults([]);
        setGoogleError("");
        setGoogleLoading(false);
      }
    }
    // eslint-disable-next-line
  }, [activeTab]);

  return (
    <div className="min-h-screen w-[80%] mx-auto bg-white">
      {/* Header */}
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="w-full max-w-md mx-auto">
            <SearchBar placeholder="Search for a business or person..." initialValue={searchQuery} />
          </div>
        </div>
      </header>

      {/* Filters */}
      <nav className="border-b sticky top-0 bg-white z-10">
        <div className="max-w-7xl mx-auto flex overflow-x-auto no-scrollbar px-4 py-2 scroll-smooth">
          <div className="flex flex-nowrap gap-2 mx-auto">
            {["X", "LinkedIn", "TikTok", "Facebook", "Instagram", "Google Business", "Cross Platform"].map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => handleTabChange(filter)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    filter === activeTab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {filter}
                </button>
              )
            )}
          </div>
        </div>
      </nav>

      {/* Tab-specific messages */}
      {activeTab === "X" && (
        <div className="text-center py-4 text-gray-600">
          If you didn't find the account you're looking for try using the exact username
        </div>
      )}
      {activeTab === "LinkedIn" && (
        <div className="text-center py-4 text-gray-600">
          For now only Company accounts are supported, To search for a Profile account please use the Cross Platform tab 
        </div>
      )}
      {activeTab === "Facebook" && (
        <>
          <div className="flex justify-center gap-4 py-2">
            {["Pages", "Profiles"].map((subTab) => (
              <button
                key={subTab}
                onClick={() => setFacebookSubTab(subTab)}
                className={`px-4 py-1 text-sm font-medium border-b-2 transition-colors ${
                  facebookSubTab === subTab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {subTab}
              </button>
            ))}
          </div>
          <div className="text-center py-4 text-gray-600">
            {facebookSubTab === "Pages"
              ? "For now only Pages are supported"
              : "For now only Profiles are supported"}
          </div>
        </>
      )}
      {activeTab === "TikTok" && (
        <div className="text-center py-4 text-gray-600">
          If you didn't find the account you're looking for try using the exact username
        </div>
      )}
      {activeTab === "Instagram" && (
        <div className="text-center py-4 text-gray-600">
          If you didn't find the account you're looking for try using the exact username
        </div>
      )}
      {activeTab === "Google Business" && (
        <div className="text-center py-4 text-gray-600">
          Enter exact location of the business in the format "area name, city name"
        </div>
      )}

      {/* Main Content */}
      <main className="w-full px-4 py-8">
        {loading && activeTab !== "Google Business" && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Google Business Tab */}
        {activeTab === "Google Business" && (
          <div className="max-w-md mx-auto space-y-6">
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                Enter exact location of the business in the format "area name, city name"
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder='enter exact location of the business in the format "area name, city name"'
                  value={googleLocation}
                  onChange={e => setGoogleLocation(e.target.value)}
                  className="flex-1 px-4 py-2 text-gray-900 placeholder-gray-400 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <button
                  onClick={handleGoogleBusinessSearch}
                  disabled={!googleLocation.trim()}
                  className="px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Search
                </button>
              </div>
            </div>
            {googleLoading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}
            {googleError && (
              <div className="text-center text-red-500 py-4">{googleError}</div>
            )}
            {!googleLoading && !googleError && googleResults.length > 0 && (
              <div className="space-y-4">
                {googleResults.map((biz, idx) => (
                  <div
                    key={biz.business_id || idx}
                    onClick={() => navigate("/profile", { state: { user: biz, business_id: biz.business_id, platform: "google-business" } })}
                    className="bg-white p-4 rounded-lg border w-full mx-auto hover:shadow-md transition-shadow flex items-center gap-4 cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={biz.photos_sample && biz.photos_sample[0] && biz.photos_sample[0].photo_url ? biz.photos_sample[0].photo_url : 'https://via.placeholder.com/64?text=No+Image'}
                        alt={biz.name}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/64?text=No+Image'; }}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-base">{biz.name}</h3>
                      <p className="text-gray-500 text-sm">{biz.full_address}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Show no results only if not loading, no error, and no googleResults */}
            {!googleLoading && !googleError && googleResults.length === 0 && (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" /></svg>
                </div>
                <p className="text-lg font-medium text-gray-900">No local businesses found</p>
                <p className="text-gray-500 mt-1 max-w-xs mx-auto">We couldn't find a business matching that name in that location. Try a different city or check the spelling.</p>
                <button onClick={() => setActiveTab("Cross Platform")} className="mt-6 text-blue-600 font-semibold hover:text-blue-700">
                  Try Cross-Platform Search instead →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Global Empty State for other platforms */}
        {!loading && activeTab !== "Cross Platform" && activeTab !== "Google Business" && getCurrentData().length === 0 && (
           <div className="text-center py-20 px-4">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Finding "{searchQuery}" on {activeTab}</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              We couldn't find an exact match for this account. Try using their exact username or check if you're in the right tab.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
               {["X", "Instagram", "TikTok"].filter(p => p !== activeTab).map(p => (
                 <button key={p} onClick={() => setActiveTab(p)} className="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
                   Search on {p}
                 </button>
               ))}
            </div>
          </div>
        )}

        {/* Existing platform results */}
        {activeTab !== "Cross Platform" && activeTab !== "Google Business" &&
          getCurrentData().length > 0 && (
            <div className="mx-auto px-4 space-y-4">
              {getCurrentData().map((user, index) => {
                if (activeTab === "X") {
                  return (
                    <div
                      key={user.user_id || user.id}
                      onClick={() => handleUserClick(user)}
                      className="bg-white p-4 rounded-lg border w-full mx-auto hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-base">
                            {user.name}
                            {user.is_blue_verified && (
                              <span className="ml-1 align-middle">
                                <img
                                  src={twitterVerifiedBadge}
                                  alt="Verified"
                                  className="inline-block h-[18px] w-[18px]"
                                  style={{ verticalAlign: 'middle' }}
                                />
                              </span>
                            )}
                          </h3>
                          <p className="text-gray-500">@{user.screen_name}</p>
                        </div>
                      </div>
                      <HiOutlineArrowRight className="text-gray-400 w-5 h-5" />
                    </div>
                  );
                } else if (activeTab === "LinkedIn") {
                  return (
                    <div
                      key={user.id}
                      onClick={() => handleUserClick(user)}
                      className="bg-white p-4 rounded-lg border hover:shadow-md w-full transition-shadow cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img
                            src={
                              user.profile_picture?.[0]?.url ||
                              "https://via.placeholder.com/100"
                            }
                            alt={user.full_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-base">
                            {user.full_name}
                          </h3>
                          <p className="text-gray-500">{user.type}</p>
                          {user.headline && (
                            <p className="text-gray-400 text-sm mt-1 line-clamp-1">
                              {user.headline}
                            </p>
                          )}
                        </div>
                      </div>
                      <HiOutlineArrowRight className="text-gray-400 w-5 h-5" />
                    </div>
                  );
                } else if (activeTab === "Facebook") {
                  return (
                    <div
                      key={`${user.facebook_id || user.rank_id || index}-${index}`}
                      onClick={() => handleUserClick(user)}
                      className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img
                            src={user.image.uri}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-base">
                            {user.name}
                            {user.is_verified && (
                              <span className="ml-1 text-blue-500">✓</span>
                            )}
                          </h3>
                          <p className="text-gray-500">{user.type}</p>
                        </div>
                      </div>
                      <HiOutlineArrowRight className="text-gray-400 w-5 h-5" />
                    </div>
                  );
                } else if (activeTab === "Instagram") {
                  return (
                    <div
                      key={user.id}
                      onClick={() => handleUserClick(user)}
                      className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img
                            src={user.profile_pic_url}
                            alt={user.full_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-base">
                            {user.full_name}
                            {user.is_verified && (
                              <span className="ml-1 text-blue-500">✓</span>
                            )}
                          </h3>
                          <p className="text-gray-500">@{user.username}</p>
                        </div>
                      </div>
                      <HiOutlineArrowRight className="text-gray-400 w-5 h-5" />
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={`${user.user_info.sec_uid}-${index}`}
                      onClick={() => handleUserClick(user)}
                      className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img
                            src={user.user_info.avatar_thumb.url_list[0]}
                            alt={user.user_info.nickname}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-base">
                            {user.user_info.nickname}
                          </h3>
                          <p className="text-gray-500">
                            @{user.user_info.unique_id}
                          </p>
                        </div>
                      </div>
                      <HiOutlineArrowRight className="text-gray-400 w-5 h-5" />
                    </div>
                  );
                }
              })}
            </div>
          )}

        {/* Cross Platform Panel */}
        {!loading && activeTab === "Cross Platform" && (
          <div>
            {/* Toggles */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {["X", "LinkedIn", "TikTok", "Facebook", "InstaRab", "Instagram"].map((platform) => (
                <div key={platform} className="flex items-center gap-2">
                  <span className="text-gray-700">{platform}</span>
                  <label
                    htmlFor={`toggle-${platform}`}
                    className="relative inline-flex items-center cursor-pointer"
                  >
                    <input
                      id={`toggle-${platform}`}
                      type="checkbox"
                      className="sr-only peer"
                      checked={platformToggles[platform]}
                      onChange={() => handleToggleChange(platform)}
                    />
                    <div
                      className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-600 rounded-full
                    dark:bg-gray-700
                    peer-checked:after:translate-x-full peer-checked:after:border-white
                    after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                    after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                    dark:border-gray-600 peer-checked:bg-blue-600"
                    ></div>
                  </label>
                </div>
              ))}
            </div>

            {/* Brand + URLs */}
            <div className="max-w-md mx-auto space-y-6">
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  Brand Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Brand Name"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-4 py-2 text-gray-900 placeholder-gray-400 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {Object.entries(platformToggles).map(
                ([platform, isActive]) =>
                  isActive && (
                    <div key={platform}>
                      <label className="block mb-1 text-sm font-semibold text-gray-700">
                        {platform} URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder={`Enter ${platform} URL`}
                          value={inputValues[platform]}
                          onChange={(e) =>
                            handleInputChange(platform, e.target.value)
                          }
                          className="flex-1 px-4 py-2 text-gray-900 placeholder-gray-400 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {platform === "Facebook" && (
                          <div className="flex gap-2">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="facebookType"
                                value="page"
                                checked={facebookType === "page"}
                                onChange={(e) => setFacebookType(e.target.value)}
                                className="sr-only"
                              />
                              <span className={`px-4 py-2 text-sm font-medium border rounded-lg transition-colors cursor-pointer ${
                                facebookType === "page"
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}>
                                Page
                              </span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="facebookType"
                                value="profile"
                                checked={facebookType === "profile"}
                                onChange={(e) => setFacebookType(e.target.value)}
                                className="sr-only"
                              />
                              <span className={`px-4 py-2 text-sm font-medium border rounded-lg transition-colors cursor-pointer ${
                                facebookType === "profile"
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}>
                                Profile
                              </span>
                            </label>
                          </div>
                        )}
                        {platform === "LinkedIn" && (
                          <div className="flex gap-2">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="linkedinType"
                                value="company"
                                checked={linkedinType === "company"}
                                onChange={(e) => setLinkedinType(e.target.value)}
                                className="sr-only"
                              />
                              <span className={`px-4 py-2 text-sm font-medium border rounded-lg transition-colors cursor-pointer ${
                                linkedinType === "company"
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}>
                                Company
                              </span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="linkedinType"
                                value="profile"
                                checked={linkedinType === "profile"}
                                onChange={(e) => setLinkedinType(e.target.value)}
                                className="sr-only"
                              />
                              <span className={`px-4 py-2 text-sm font-medium border rounded-lg transition-colors cursor-pointer ${
                                linkedinType === "profile"
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}>
                                Profile
                              </span>
                            </label>
                          </div>
                        )}
                        {/* Add custom InstaRab handling here if needed */}
                      </div>
                    </div>
                  )
              )}

              <div className="flex justify-center">
                <button
                  onClick={handleReportGenerate}
                  disabled={
                    !brandName.trim() ||
                    !Object.entries(platformToggles).some(
                      ([p, on]) => on && inputValues[p].trim()
                    )
                  }
                  className="px-6 py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Report Generate
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default SearchResult;
