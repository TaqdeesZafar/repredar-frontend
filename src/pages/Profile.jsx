"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  FaUser,
  FaEnvelope,
  FaCreditCard,
  FaCalendarAlt,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
} from "react-icons/fa"

// Import the function with a different name to avoid naming conflict
import { userInfo as getUserInfo } from "../utils/token"

export default function Profile() {
  const [userData, setUserData] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancellingSubscription, setCancellingSubscription] = useState(false)
  const [cancelSuccess, setCancelSuccess] = useState(false)
  const navigate = useNavigate();
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (token) {
      fetchUserData();
    }else {
      navigate("/login")
    }
  }, []);


  const fetchSubscriptionData = async (user) => {
    try {
      const subscriptionResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/products/subscription-products/${user.productId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!subscriptionResponse.ok) {
            throw new Error("Failed to fetch subscription information");
          }

      const subscriptionData = await subscriptionResponse.json();
          setSubscription(subscriptionData);
    } catch (err) {
      console.error("Error fetching subscription data:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserData = async () => {
    try {
      setLoading(true)
      setError(null)
  
      if (!token) throw new Error("No authentication token found")
  
      getUserInfo().then(user => {
        setUserData(user)
        if (user.productId) {
          fetchSubscriptionData(user)
        } else {
          setLoading(false)
        }
      })
    } catch (err) {
      console.error("Error fetching user data:", err)
      setError(err.message || "Failed to load user information")
      setLoading(false) 
    }
  }
  

  const handleCancelSubscription = async () => {
    try {
      setCancellingSubscription(true)
      const token = localStorage.getItem("token")

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/payment/cancel-subscription`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to cancel subscription")
      }

      setCancelSuccess(true)

      setTimeout(() => {
        fetchUserData()
        setCancelSuccess(false)
      }, 2000)
    } catch (err) {
      console.error("Error cancelling subscription:", err)
      setError(err.message || "Failed to cancel subscription")
    } finally {
      setCancellingSubscription(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
        <p className="text-gray-600">Loading profile information...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center mb-4">
          <FaExclamationTriangle className="text-red-500 text-2xl mr-3" />
          <h2 className="text-xl font-semibold text-red-700">Error Loading Profile</h2>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <div className="flex space-x-4">
          <button
            onClick={fetchUserData}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* User Profile Header */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">User Profile</h1>
          <p className="text-gray-600">Manage your account and subscription</p>
        </div>

        {/* User Information */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <FaUser className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-800">{userData?.name || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-start">
              <FaEnvelope className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium text-gray-800">{userData?.email || getUserInfo()?.email || "Not provided"}</p>
              </div>
            </div>

              <div className="flex items-start">
                <FaCreditCard className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Tokens Remaining</p>
                  <p className="font-medium text-gray-800">{userData?.tokens}</p>
                </div>
              </div>
          </div>
        </div>

        {/* Subscription Information */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Subscription Details</h2>

          {!userData?.stripeSubscriptionId ? (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-4">You don't have an active subscription.</p>
              <button
                onClick={() => navigate("/subscriptions")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                View Subscription Plans
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              {cancelSuccess ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <FaCheckCircle className="text-green-500 text-4xl mb-3" />
                  <p className="text-green-700 font-medium text-lg">Subscription successfully cancelled</p>
                  <p className="text-gray-600 mt-2">Your profile will update shortly...</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {subscription?.name || "Active Subscription"}
                      </h3>
                      <p className="text-gray-600">{subscription?.description || "Your current plan"}</p>
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Active</div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium text-gray-800">
                        ${subscription?.amount || userData?.subscriptionAmount || "N/A"}/
                        {subscription?.interval || "month"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Tokens</p>
                      <p className="font-medium text-gray-800">
                        {subscription?.tokens || "N/A"} per {subscription?.interval || "month"}
                      </p>
                    </div>

                    {userData?.subscriptionRenewDate && (
                      <div>
                        <p className="text-sm text-gray-500">Next Billing Date</p>
                        <p className="font-medium text-gray-800">
                          {new Date(userData.subscriptionRenewDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleCancelSubscription}
                    disabled={cancellingSubscription}
                    className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-red-300"
                  >
                    {cancellingSubscription ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="mr-2" />
                        Cancel Subscription
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
