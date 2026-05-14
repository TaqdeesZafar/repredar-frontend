"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaUser, FaEnvelope, FaSpinner, FaExclamationTriangle, FaArrowLeft } from "react-icons/fa"
import { userInfo as getUserInfo } from "../utils/token"

export default function Profile() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (token) {
      fetchUserData()
    } else {
      navigate("/login")
    }
  }, [])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      setError(null)
      if (!token) throw new Error("No authentication token found")
      const user = await getUserInfo()
      setUserData(user)
    } catch (err) {
      setError(err.message || "Failed to load user information")
    } finally {
      setLoading(false)
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
          <button onClick={fetchUserData} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Try Again
          </button>
          <button onClick={() => navigate("/")} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center">
            <FaArrowLeft className="mr-2" /> Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <button onClick={() => navigate("/")} className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <FaArrowLeft className="mr-2" /> Back to Home
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">User Profile</h1>
          <p className="text-gray-600">Your account information</p>
        </div>

        <div className="p-6">
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
                <p className="font-medium text-gray-800">{userData?.email || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
