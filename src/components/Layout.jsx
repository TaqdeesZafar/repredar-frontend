"use client"

import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Logo from "./common/Logo"
import { isTokenExpired } from "../utils/token"
import { useTheme } from "../context/ThemeContext"

export default function Layout({ children }) {
  const navigate = useNavigate()
  const { theme, toggle: toggleTheme, isDark } = useTheme()
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
    background: "var(--nav-bg)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: "1px solid var(--border-soft)",
    position: "sticky",
    top: 0,
    zIndex: 9999,
  }

  const btnPrimary = {
    padding: "8px 18px",
    background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
    color: isDark ? "#051120" : "#ffffff",
    fontWeight: 600,
    fontSize: 13,
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    transition: "box-shadow 0.2s",
  }

  const btnGhost = {
    padding: "8px 18px",
    background: "transparent",
    color: "var(--text-secondary)",
    fontWeight: 500,
    fontSize: 13,
    border: "1px solid var(--border-subtle)",
    borderRadius: 10,
    cursor: "pointer",
    transition: "all 0.2s",
  }

  return (
    <>
      <div style={{ minHeight: "100vh", width: "100%", background: "var(--bg-dark)", display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" }}>
        <header style={navStyle}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 64 }}>
            <Logo />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                style={{
                  width: 36, height: 36, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
                  cursor: "pointer", color: "var(--text-secondary)", transition: "all 0.2s", flexShrink: 0,
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
              >
                {isDark ? (
                  /* Sun icon */
                  <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="4" strokeWidth="2"/>
                    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ) : (
                  /* Moon icon */
                  <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>

              {isLoggedIn ? (
                <div style={{ position: "relative" }} ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 10, cursor: "pointer", color: "#00D4FF", fontSize: 13, fontWeight: 500, transition: "all 0.2s" }}
                  >
                    {/* User icon */}
                    <svg style={{ width: 15, height: 15 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="7" r="4" strokeWidth="2"/>
                    </svg>
                    Profile
                    <svg style={{ width: 12, height: 12, transition: "transform 0.2s", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div style={{
                      position: "absolute", right: 0, top: "calc(100% + 8px)",
                      width: 200,
                      background: "var(--nav-bg)",
                      border: "1px solid var(--border-soft)",
                      borderRadius: 14,
                      backdropFilter: "blur(20px)",
                      boxShadow: isDark ? "0 16px 40px rgba(0,0,0,0.5)" : "0 8px 30px rgba(0,0,0,0.12)",
                      overflow: "hidden",
                      zIndex: 10,
                    }}>
                      {[
                        { icon: <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="7" r="4" strokeWidth="2"/></svg>, label: "Profile", action: () => { navigate("/profile-info"); setDropdownOpen(false); } },
                        { icon: <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2"/></svg>, label: "Dashboard", action: () => { navigate("/dashboard"); setDropdownOpen(false); } },
                      ].map((item) => (
                        <button key={item.label} onClick={item.action}
                          style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", background: "transparent", border: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: 13, textAlign: "left", transition: "all 0.15s", borderBottom: "1px solid var(--border-soft)" }}
                          onMouseOver={e => { e.currentTarget.style.background = "rgba(0,144,255,0.06)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                          onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
                          {item.icon}
                          {item.label}
                        </button>
                      ))}
                      <button onClick={handleLogout}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", background: "transparent", border: "none", cursor: "pointer", color: "#FF4757", fontSize: 13, textAlign: "left", transition: "all 0.15s" }}
                        onMouseOver={e => { e.currentTarget.style.background = "rgba(255,71,87,0.06)"; }}
                        onMouseOut={e => { e.currentTarget.style.background = "transparent"; }}>
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
                  <button onClick={() => navigate("/login")} style={btnGhost}
                    onMouseOver={e => { e.currentTarget.style.borderColor = "#00D4FF"; e.currentTarget.style.color = "#00D4FF"; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(30,45,74,1)"; e.currentTarget.style.color = "#8BA0C8"; }}>
                    Login
                  </button>
                  <button
                    style={btnPrimary}
                    onMouseOver={e => e.currentTarget.style.boxShadow = "0 0 24px rgba(0,212,255,0.45)"}
                    onMouseOut={e => e.currentTarget.style.boxShadow = "none"}
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
                    }}>
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
