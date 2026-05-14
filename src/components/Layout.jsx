"use client"

import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Logo from "./common/Logo";
import { isTokenExpired } from "../utils/token";
import { FaUserCircle, FaTachometerAlt, FaSignOutAlt, FaChevronDown } from "react-icons/fa";

export default function Layout({ children }) {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const token = localStorage.getItem("token")


  // Check login status on mount and when localStorage changes
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }

    if (isTokenExpired(token) && token) {
      localStorage.removeItem("token");
      navigate("/login")
    }
  }, [token, navigate])

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setIsLoggedIn(false)
    setDropdownOpen(false)
    navigate("/login")
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  return (
    <>
      <div className="min-h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
        <header className="bg-white shadow sticky top-0 z-[9999] ">
          <div className="w-full mx-auto px-4 flex justify-between items-center">
            <Logo />
            <div className="space-x-4">
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <FaUserCircle className="text-xl" />
                    <span>Profile</span>
                    <FaChevronDown className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                      <button
                        onClick={() => {
                          navigate("/profile-info")
                          setDropdownOpen(false)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FaUserCircle className="mr-2" />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          navigate("/dashboard")
                          setDropdownOpen(false)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FaTachometerAlt className="mr-2" />
                        Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await fetch(`${import.meta.env.VITE_BACKEND_URL}/signup-logs/visit`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          }
                        });
                      } catch (error) {
                        console.error('Error logging signup page visit:', error);
                      }
                      navigate("/signup");
                    }}
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full max-w-full p-2">{children}</main>
      </div>
    </>
  )
}
