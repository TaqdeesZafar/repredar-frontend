"use client"

import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Logo from "./common/Logo"
import { isTokenExpired } from "../utils/token"

export default function Layout({ children }) {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userInfo")
    setIsLoggedIn(false)
    setDropdownOpen(false)
    navigate("/login")
  }

  return (
    <>
      <style>{`
        .nav-login-btn {
          padding: 7px 16px;
          background: transparent;
          color: var(--text-2);
          font-weight: 500;
          font-size: 13px;
          border: 1px solid var(--border);
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
        }
        .nav-login-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
          background: var(--accent-dim);
        }
        .nav-signup-btn {
          padding: 7px 16px;
          background: var(--accent);
          color: #fff;
          font-weight: 600;
          font-size: 13px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          box-shadow: var(--shadow-btn);
          transition: opacity 0.15s, transform 0.1s;
        }
        .nav-signup-btn:hover { opacity: 0.92; transform: translateY(-1px); }
        .nav-profile-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 14px;
          background: var(--accent-dim);
          border: 1px solid var(--accent-border);
          border-radius: 8px;
          cursor: pointer;
          color: var(--accent);
          font-size: 13px;
          font-weight: 600;
          font-family: inherit;
          transition: background 0.15s;
        }
        .nav-profile-btn:hover { background: rgba(37,99,235,0.13); }
        .nav-dd-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          color: var(--text-2);
          font-size: 13px;
          text-align: left;
          font-family: inherit;
          transition: background 0.12s, color 0.12s;
        }
        .nav-dd-item:hover { background: var(--bg-elevated); color: var(--text-1); }
        .nav-dd-logout {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--red);
          font-size: 13px;
          text-align: left;
          font-family: inherit;
          transition: background 0.12s;
        }
        .nav-dd-logout:hover { background: var(--red-dim); }
      `}</style>

      <div style={{
        minHeight: "100vh",
        width: "100%",
        background: "var(--bg-page)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>
        <header style={{
          background: scrolled ? "rgba(248,249,252,0.96)" : "var(--bg-surface)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: `1px solid ${scrolled ? "var(--border)" : "rgba(15,23,42,0.07)"}`,
          position: "sticky",
          top: 0,
          zIndex: 9999,
          transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
          boxShadow: scrolled ? "0 1px 12px rgba(15,23,42,0.08)" : "none",
        }}>
          <div style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 60,
          }}>
            <Logo />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {isLoggedIn ? (
                <div style={{ position: "relative" }} ref={dropdownRef}>
                  <button
                    className="nav-profile-btn"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="7" r="4" strokeWidth="2"/>
                    </svg>
                    Profile
                    <svg
                      style={{
                        width: 11,
                        height: 11,
                        transition: "transform 0.2s",
                        transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path d="M19 9l-7 7-7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 8px)",
                      width: 196,
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      boxShadow: "0 8px 30px rgba(15,23,42,0.14)",
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
                          className="nav-dd-item"
                          onClick={item.action}
                        >
                          {item.icon}
                          {item.label}
                        </button>
                      ))}
                      <button className="nav-dd-logout" onClick={handleLogout}>
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
                    className="nav-login-btn"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                  <button
                    className="nav-signup-btn"
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
