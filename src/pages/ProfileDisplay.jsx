import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaLinkedin,
  FaTiktok,
  FaCheck,
} from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";

const ProfileDisplay = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loginMessage, setLoginMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // Check for pending report data after login
    const pendingReportData = localStorage.getItem('pendingReportData');
    if (pendingReportData) {
      const data = JSON.parse(pendingReportData);
      if (data.user) {
        setUserData(data.user);
        localStorage.setItem("profileData", JSON.stringify(data.user));
      }
      // Clear the pending data
      localStorage.removeItem('pendingReportData');
    } else if (location?.state?.user) {
      localStorage.setItem("profileData", JSON.stringify(location.state.user));
      setUserData(location.state.user);
    } else {
      const storedData = localStorage.getItem("profileData");
      if (storedData) {
        const userData = JSON.parse(storedData);
        setUserData(userData);
      } else if (location?.state?.brandName) {
        const defaultUser = {
          name: location.state.brandName,
          platform: "crossplateform",
        };
        localStorage.setItem("profileData", JSON.stringify(defaultUser));
        setUserData(defaultUser);
      } else {
        const defaultUser = {
          name: "Mr XYZ",
          avatar: "https://via.placeholder.com/150",
          screen_name: "McDonalds",
          platform: "X",
        };
        localStorage.setItem("profileData", JSON.stringify(defaultUser));
        setUserData(defaultUser);
      }
    }
  }, [location.state]);

  const handleDownloadReport = async () => {
    if (isDownloading) return;

    if (!isLoggedIn) {
      setShowEmailModal(true);
      return;
    }

    setProgress(0);
    setIsDownloading(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      const platform = location?.state?.platform
        ? location.state.platform
        : (userData.platform || "X").toLowerCase();

      let identifier;
      let apiUrl;

      // Google Business
      if (platform === "google-business") {
        const businessId = location?.state?.business_id || userData.business_id || "";
        const businessName = userData.name || "";
        identifier = businessId;
        apiUrl = `${import.meta.env.VITE_BACKEND_URL}/google/generate-pdf-report?query=${encodeURIComponent(businessName)}&business_id=${encodeURIComponent(businessId)}`;
      } else if (platform === "linkedin") {
        identifier = userData.name || userData.full_name || "";
        const linkedinUrl = userData.url || "";
        apiUrl = `${import.meta.env.VITE_BACKEND_URL}/linkedin/generate-pdf-report?url=${encodeURIComponent(linkedinUrl)}&query=${encodeURIComponent(identifier)}`;
      } else if (platform === "tiktok") {
        const secUid = userData.sec_uid || "";
        identifier = userData.name || "";
        apiUrl = `${import.meta.env.VITE_BACKEND_URL}/tiktok/generate-pdf-report?secUid=${encodeURIComponent(secUid)}&query=${encodeURIComponent(identifier)}`;
      } else if (platform === "facebook") {
        const subtab = location?.state?.subtab;
        if (subtab === "Profiles") {
          const profileId = userData.facebook_id || "";
          identifier = userData.name || "";
          apiUrl = `${import.meta.env.VITE_BACKEND_URL}/facebook/generate-pdf-report?profile_id=${encodeURIComponent(profileId)}&query=${encodeURIComponent(identifier)}`;
        } else {
          const pageId = userData.facebook_id || "";
          identifier = userData.name || "";
          apiUrl = `${import.meta.env.VITE_BACKEND_URL}/facebook/generate-pdf-report?page_id=${encodeURIComponent(pageId)}&query=${encodeURIComponent(identifier)}`;
        }
      } else if (platform === "instagram") {
        identifier = userData.screen_name || "";
        apiUrl = `${import.meta.env.VITE_BACKEND_URL}/instagram/generate-pdf-report?query=@${encodeURIComponent(identifier)}`;
      } else if (platform === "X" || platform === "x") {
        identifier = userData.screen_name || "";
        apiUrl = `${import.meta.env.VITE_BACKEND_URL}/twitter/generate-pdf-report?query=@${encodeURIComponent(identifier)}`;
      } else {
        const nonEmptyURLs = Object.entries(location?.state?.urls)
          .filter(([key, value]) => value.trim() !== "")
          .map(([key, value]) => {
            let backendKey = key === "X" ? "twitter" : key.toLowerCase();
            return `${encodeURIComponent(backendKey)}=${encodeURIComponent(value.trim())}`;
          })
          .join("&");

        if (!nonEmptyURLs) {
          setErrorMessage("No URLs provided for cross platform report");
          setIsDownloading(false);
          return;
        }

        let apiUrlWithParams = nonEmptyURLs;
        if (location?.state?.urls?.Facebook && location?.state?.facebookType) {
          apiUrlWithParams += `&facebookType=${encodeURIComponent(location.state.facebookType)}`;
        }

        apiUrl = `${import.meta.env.VITE_BACKEND_URL}/crossplatform/generate-pdf-report?${apiUrlWithParams}&query=${encodeURIComponent(location.state?.brandName)}`;
        identifier = "crossplatform";
      }

      // Calculate progress increments for 3 minutes (180 seconds)
      // We'll go from 0% to 90% in 3 minutes, leaving 10% for completion
      const totalSteps = 180;
      const incrementPerStep = 90 / totalSteps;
      let currentStep = 0;

      const loadingSteps = [
        "Initializing engine...",
        "Scanning social profiles...",
        "Analyzing sentiment...",
        "Calculated reputation score...",
        "Comparing with competitors...",
        "Formatting report...",
        "Finalizing PDF..."
      ];

      // Simulate progress updates while waiting for response
      let progressInterval = setInterval(() => {
        if (currentStep < totalSteps) {
          currentStep++;
          const currentProgress = Math.min(90, currentStep * incrementPerStep);
          setProgress(currentProgress);
          
          // Update message every few steps
          const msgIndex = Math.floor((currentProgress / 90) * loadingSteps.length);
          setLoadingMessage(loadingSteps[Math.min(msgIndex, loadingSteps.length - 1)]);
        }
      }, 1000); // Update every second

      // Make a fetch request
      const fetchOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(apiUrl, fetchOptions);

      if (response.ok) {
        const blob = await response.blob();

        // Set to 95% when blob is received
        setProgress(95);

        const url = window.URL.createObjectURL(blob);

        // Create a temporary link and trigger download
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `${identifier}_reputation_report.pdf`;
        document.body.appendChild(a);
        a.click();

        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        clearInterval(progressInterval);

        // Complete the progress
        setProgress(100);

        // Add a small delay
        setTimeout(() => {
          setIsDownloading(false);
        }, 1000);
      } else {
        // Handle API error response
        clearInterval(progressInterval);
        setProgress(100); // Set progress to 100% to end the loading bar

        let errorDetails = "";
        try {
          const errorData = await response.json();
          errorDetails = errorData.message || errorData.error || "";
        } catch (e) {
          // If we can't parse JSON, use status text
          errorDetails = response.statusText;
          console.log("error : ", e);
        }

        const errorMsg = `Failed to download report: ${errorDetails}`;
        console.error(errorMsg);
        setErrorMessage(errorMsg);

        setTimeout(() => {
          setIsDownloading(false);
        }, 1000);
      }
    } catch (error) {
      console.error("Error downloading report:", error);
      setProgress(100); // Set progress to 100% to end the loading bar
      setErrorMessage(
        `Failed to download report: ${error.message || "Unknown error"}`
      );
      setIsDownloading(false);
      setLoadingMessage("");
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsSubmittingEmail(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/guest-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        setShowEmailModal(false);
        // Automatically start the download after successful email capture
        handleDownloadReport();
      } else {
        setErrorMessage("Failed to process email. Please try again.");
      }
    } catch (err) {
      setErrorMessage("Connection error. Please try again later.");
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  // Get display name based on data structure
  const getDisplayName = () => {
    if (!userData) return "";

    if (userData.platform === "tiktok") {
      return userData.name || "TikTok User";
    } else if (userData.platform === "linkedin") {
      return userData.name || "LinkedIn User";
    } else if (userData.platform === "facebook") {
      return userData.name || "Facebook Page";
    } else if (userData.platform === "instagram") {
      return userData.name || "Instagram User";
    } else if (userData.platform === "crossplateform") {
      return location?.state?.brandName || "Cross Platform User";
    } else {
      return userData.name || userData.screen_name || "Twitter User";
    }
  };

  // Get identifier based on data structure
  const getIdentifier = () => {
    if (!userData) return "";

    if (userData.platform === "tiktok") {
      return userData.screen_name ? `@${userData.screen_name}` : "";
    } else if (userData.platform === "linkedin") {
      return userData.headline || "";
    } else if (userData.platform === "facebook") {
      return userData.screen_name || "Page";
    } else if (userData.platform === "instagram") {
      return userData.screen_name ? `@${userData.screen_name}` : "";
    } else if (userData.platform === "crossplateform") {
      return "Cross Platform User";
    } else {
      return userData.screen_name ? `@${userData.screen_name}` : "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Notification Banner */}
      {showBanner && (
        <div className="bg-gray-800 text-white py-3 px-4 flex justify-between items-center">
          <div className="flex-1 text-center">
            <span className="inline-flex items-center justify-center">
              Create a report about your business
              <a href="/" className="ml-2 font-medium underline">
                Get Started
              </a>
            </span>
          </div>
          <button onClick={() => setShowBanner(false)} className="text-white">
            <IoMdClose size={24} />
          </button>
        </div>
      )}

      {/* Login Message */}
      {loginMessage && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 fixed top-20 right-4 z-50 shadow-lg rounded">
          <div className="flex items-center">
            <div className="py-1">
              <svg
                className="h-6 w-6 text-yellow-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <p className="font-bold">{loginMessage}</p>
              <p className="text-sm">Redirecting to login page...</p>
            </div>
            <button
              onClick={() => setLoginMessage("")}
              className="ml-auto text-yellow-500 hover:text-yellow-700"
            >
              <IoMdClose size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 fixed top-20 right-4 z-50 shadow-lg rounded">
          <div className="flex items-center">
            <div className="py-1">
              <svg
                className="h-6 w-6 text-red-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <p className="font-bold">Error</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage("")}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <IoMdClose size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Profile Section */}
      {!location?.state?.brandName &&
        <section className="py-6 px-6 flex flex-col items-center border-b relative">
        {userData?.avatar && (
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
            <img
              src={userData?.avatar}
              alt={getDisplayName()}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <h1 className="text-2xl font-bold mb-1">{getDisplayName()}</h1>
        <p className="text-gray-500 mb-2">{getIdentifier()}</p>

        {/* TikTok-specific stats (only show if platform is TikTok) */}
        {userData?.platform === "tiktok" && (
          <div className="mt-4 flex items-center space-x-4">
            <div className="text-center">
              <p className="text-xl font-bold">
                {userData.follower_count?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            {userData.signature && (
              <div className="max-w-xs">
                <p className="text-sm text-gray-700">{userData.signature}</p>
              </div>
            )}
          </div>
        )}

        {/* Facebook-specific info */}
        {userData?.platform === "facebook" && (
          <div className="mt-4 flex items-center space-x-4">
            {userData.is_verified && (
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Verified
              </div>
            )}
            {userData.url && (
              <a
                href={userData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Visit Page
              </a>
            )}
          </div>
        )}

        {/* Instagram-specific info */}
        {userData?.platform === "instagram" && (
          <div className="mt-4 flex items-center space-x-4">
            {userData.is_verified && (
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Verified
              </div>
            )}
          </div>
        )}
        </section>}
      {
        location?.state?.brandName?.length !== 0 &&
        <section className="py-6 px-6 flex flex-col items-center border-b relative">
          <h1 className="text-2xl font-bold mb-1">Brand Name</h1>
          <h2 className="text-2xl font-bold mb-1">{location.state.brandName}</h2>
        </section>
      }

      {/* Report Generation Section */}
      <section className="w-full py-8 px-4 flex flex-col items-center">
        <div className="max-w-md w-full bg-white p-4 rounded-lg border">
          <h2 className="text-xl font-bold mb-4">
            Generate a comprehensive report
          </h2>
          <p className="text-gray-600 mb-6">
            Get detailed insights about this account's online presence,
            engagement metrics, and more.
          </p>

          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 font-medium">Report Status</span>
            <svg
              className="w-5 h-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* Only show progress bar if downloading */}
          {isDownloading && (
            <>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-linear shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm font-medium text-blue-600 animate-pulse">
                  {loadingMessage}
                </p>
                <p className="text-sm font-bold text-gray-700">
                  {Math.round(progress)}%
                </p>
              </div>
            </>
          )}

          <div className="flex items-center justify-center">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <FaFacebook className="text-blue-600" />
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <FaInstagram className="text-pink-600" />
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <FaXTwitter />
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <FaLinkedin className="text-blue-700" />
              </div>
            </div>
            <span className="ml-3 text-gray-600">
              Found 100+ data sources to check
            </span>
          </div>
        </div>

        {/* Download Report button */}
        {/* <button
          onClick={() => handleDownloadReport("free")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition-all duration-300 mt-6 w-full max-w-md"
        >
          Free Report
        </button>
        <button
          onClick={() => handleDownloadReport("paid")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition-all duration-300 mt-6 w-full max-w-md"
        >
          Paid Report
        </button> */}
        {/* Download Report Button */}
        <div className="w-full max-w-md mt-6 text-center">
          <button
            onClick={handleDownloadReport}
            disabled={isDownloading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition-all duration-300 w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isDownloading ? "Generating..." : "Download Report"}</span>
            <FaCheck className="w-5 h-5" />
          </button>
        </div>

        {/* Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl relative">
              <button 
                onClick={() => setShowEmailModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <IoMdClose size={24} />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Get Your Report</h3>
                <p className="text-gray-500 mt-2">Enter your email and we'll start generating your profile scan instantly.</p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingEmail}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all disabled:opacity-50"
                >
                  {isSubmittingEmail ? "Creating Secure Access..." : "Check My Reputation →"}
                </button>
              </form>
              <p className="text-center text-xs text-gray-400 mt-4">
                No credit card required. Private & secure.
              </p>
            </div>
          </div>
        )}

        {/* <button
          className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition-all duration-300 mt-6 w-full max-w-md'
          disabled={isDownloading}
          onClick={openReportModal}
        >
          {isDownloading ? 'Downloading...' : 'Download Report'}
        </button> */}
      </section>
    </div>
  );
};

export default ProfileDisplay;
