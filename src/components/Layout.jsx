"use client"

import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Logo from "./common/Logo"
import { isTokenExpired } from "../utils/token"
export default function Layout({ children }) {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
    if (isTokenExpired(token) && token) {
      localStorage.removeItem("token")
      navigate("/login")
    }
  }, [token, navigate])

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userInfo")
    setIsLoggedIn(false)
    setDropdownOpen(false)
    navigate("/login")
  }

  const navStyle = {
    background: "var(--bg-page)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: "1px solid var(--border)",
    position: "sticky",
    top: 0,
    zIndex: 9999,
  }

  const btnGhost = {
    padding: "8px 18px",
    background: "transparent",
    color: "var(--text-2)",
    fontWeight: 500,
    fontSize: 13,
    border: "1px solid var(--border)",
    borderRadius: 10,
    cursor: "pointer",
    fontFamily: "inherit",
  }

  const btnPrimary = {
    padding: "8px 18px",
    background: "linear-gradient(135deg, #38BDF8, #818CF8)",
    color: "#050911",
    fontWeight: 700,
    fontSize: 13,
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    boxShadow: "var(--shadow-btn)",
    fontFamily: "inherit",
  }

  return (
    <>
      <div style={{
        minHeight: "100vh",
        width: "100%",
        background: "var(--bg-page)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>
        <header style={navStyle}>
          <div style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 64,
          }}>
            <Logo />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {isLoggedIn ? (
                <div style={{ position: "relative" }} ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 14px",
                      background: "var(--accent-dim)",
                      border: "1px solid var(--accent-border)",
                      borderRadius: 10,
                      cursor: "pointer",
                      color: "var(--accent)",
                      fontSize: 13,
                      fontWeight: 500,
                      fontFamily: "inherit",
                    }}
                  >
                    <svg style={{ width: 15, height: 15 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="7" r="4" strokeWidth="2"/>
                    </svg>
                    Profile
                    <svg
                      style={{
                        width: 12,
                        height: 12,
                        transition: "transform 0.2s",
                        transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 8px)",
                      width: 200,
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 14,
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
                      overflow: "hidden",
                      zIndex: 10,
                    }}>
                      {[
                        {
                          icon: (
                            <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeWidth="2" strokeLinecap="round"/>
                              <circle cx="12" cy="7" r="4" strokeWidth="2"/>
                            </svg>
                          ),
                          label: "Profile",
                          action: () => { navigate("/profile-info"); setDropdownOpen(false); },
                        },
                        {
                          icon: (
                            <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
                              <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
                              <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
                              <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
                            </svg>
                          ),
                          label: "Dashboard",
                          action: () => { navigate("/dashboard"); setDropdownOpen(false); },
                        },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={item.action}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "11px 16px",
                            background: "transparent",
                            border: "none",
                            borderBottom: "1px solid var(--border)",
                            cursor: "pointer",
                            color: "var(--text-2)",
                            fontSize: 13,
                            textAlign: "left",
                            fontFamily: "inherit",
                          }}
                          onMouseOver={e => {
                            e.currentTarget.style.background = "var(--bg-hover)"
                            e.currentTarget.style.color = "var(--text-1)"
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.background = "transparent"
                            e.currentTarget.style.color = "var(--text-2)"
                          }}
                        >
                          {item.icon}
                          {item.label}
                        </button>
                      ))}
                      <button
                        onClick={handleLogout}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "11px 16px",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--red)",
                          fontSize: 13,
                          textAlign: "left",
                          fontFamily: "inherit",
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = "var(--red-dim)"; }}
                        onMouseOut={e => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    style={btnGhost}
                    onMouseOver={e => {
                      e.currentTarget.style.borderColor = "var(--accent)"
                      e.currentTarget.style.color = "var(--accent)"
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.borderColor = "var(--border)"
                      e.currentTarget.style.color = "var(--text-2)"
                    }}
                  >
                    Login
                  </button>
                  <button
                    style={btnPrimary}
                    onMouseOver={e => e.currentTarget.style.opacity = "0.9"}
                    onMouseOut={e => e.currentTarget.style.opacity = "1"}
                    onClick={async () => {
                      try {
                        await fetch(`${import.meta.env.VITE_BACKEND_URL}/signup-logs/visit`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                        })
                      } catch (error) {
                        console.error("Error logging signup page visit:", error)
                      }
                      navigate("/signup")
                    }}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, width: "100%", maxWidth: "100%" }}>{children}</main>
      </div>
    </>
  )
}
