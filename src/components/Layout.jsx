"use client"

import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Logo from "./common/Logo"
import Footer from "./Footer"
import { isTokenExpired } from "../utils/token"

export default function Layout({ children }) {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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

  // Close mobile menu on route navigation
  const goTo = (path) => {
    setMobileMenuOpen(false)
    setDropdownOpen(false)
    navigate(path)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userInfo")
    setIsLoggedIn(false)
    setDropdownOpen(false)
    setMobileMenuOpen(false)
    navigate("/login")
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

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
          white-space: nowrap;
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
          white-space: nowrap;
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

        .hamburger-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 8px;
          cursor: pointer;
          color: var(--text-2);
          transition: background 0.15s, border-color 0.15s;
        }
        .hamburger-btn:hover { background: var(--bg-elevated); border-color: var(--accent); color: var(--accent); }

        .mobile-menu {
          display: none;
          position: fixed;
          top: 60px;
          left: 0;
          right: 0;
          background: var(--bg-surface);
          border-bottom: 1px solid var(--border);
          box-shadow: 0 8px 24px rgba(15,23,42,0.12);
          z-index: 9998;
          padding: 12px 16px 20px;
          flex-direction: column;
          gap: 8px;
        }
        .mobile-menu.open { display: flex; }

        .mobile-menu-btn {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: background 0.12s;
        }
        .mobile-menu-btn-ghost {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-2);
        }
        .mobile-menu-btn-ghost:hover { background: var(--bg-elevated); color: var(--text-1); }
        .mobile-menu-btn-primary {
          background: var(--accent);
          border: none;
          color: #fff;
          box-shadow: var(--shadow-btn);
        }
        .mobile-menu-btn-primary:hover { opacity: 0.92; }
        .mobile-menu-btn-red {
          background: var(--red-dim);
          border: 1px solid rgba(220,38,38,0.2);
          color: var(--red);
        }

        @media (max-width: 640px) {
          .nav-desktop-actions { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        width: "100%",
        background: "var(--bg-page)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>
        {/* ── Nav ── */}
        <header style={{
          background: scrolled ? "rgba(248,249,252,0.96)" : "var(--bg-surface)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: `1px solid var(--border)`,
          position: "sticky",
          top: 0,
          zIndex: 9999,
          transition: "box-shadow 0.2s",
          boxShadow: scrolled ? "0 1px 12px rgba(15,23,42,0.08)" : "none",
        }}>
          <div style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 60,
          }}>
            <Logo />

            {/* Desktop actions */}
            <div className="nav-desktop-actions" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {isLoggedIn ? (
                <div style={{ position: "relative" }} ref={dropdownRef}>
                  <button className="nav-profile-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="7" r="4" strokeWidth="2"/>
                    </svg>
                    Profile
                    <svg style={{ width: 11, height: 11, transition: "transform 0.2s", transform: dropdownOpen ? "rotate(180deg)" : "none" }}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9l-7 7-7-7" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div style={{
                      position: "absolute", right: 0, top: "calc(100% + 8px)",
                      width: 196, background: "var(--bg-surface)",
                      border: "1px solid var(--border)", borderRadius: 12,
                      boxShadow: "0 8px 30px rgba(15,23,42,0.14)",
                      overflow: "hidden", zIndex: 10,
                    }}>
                      {[
                        { icon: <svg style={{width:14,height:14}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="7" r="4" strokeWidth="2"/></svg>, label: "Profile", path: "/profile-info" },
                        { icon: <svg style={{width:14,height:14}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2"/></svg>, label: "Dashboard", path: "/dashboard" },
                      ].map(item => (
                        <button key={item.label} className="nav-dd-item" onClick={() => goTo(item.path)}>
                          {item.icon}{item.label}
                        </button>
                      ))}
                      <button className="nav-dd-logout" onClick={handleLogout}>
                        <svg style={{width:14,height:14}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button className="nav-login-btn" onClick={() => navigate("/login")}>Login</button>
                  <button className="nav-signup-btn" onClick={async () => {
                    try {
                      await fetch(`${import.meta.env.VITE_BACKEND_URL}/signup-logs/visit`, {
                        method: "POST", headers: { "Content-Type": "application/json" },
                      })
                    } catch {}
                    navigate("/signup")
                  }}>
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Hamburger (mobile only) */}
            <button className="hamburger-btn" onClick={() => setMobileMenuOpen(v => !v)} aria-label="Menu">
              {mobileMenuOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 12h18M3 6h18M3 18h18"/>
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* ── Mobile menu ── */}
        <div className={`mobile-menu${mobileMenuOpen ? " open" : ""}`}>
          {isLoggedIn ? (
            <>
              <button className="mobile-menu-btn mobile-menu-btn-ghost" onClick={() => goTo("/profile-info")}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="7" r="4" strokeWidth="2"/>
                </svg>
                Profile
              </button>
              <button className="mobile-menu-btn mobile-menu-btn-ghost" onClick={() => goTo("/dashboard")}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
                  <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
                  <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
                  <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
                </svg>
                Dashboard
              </button>
              <button className="mobile-menu-btn mobile-menu-btn-red" onClick={handleLogout}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="mobile-menu-btn mobile-menu-btn-ghost" onClick={() => goTo("/login")}>
                Login
              </button>
              <button className="mobile-menu-btn mobile-menu-btn-primary" onClick={async () => {
                try {
                  await fetch(`${import.meta.env.VITE_BACKEND_URL}/signup-logs/visit`, {
                    method: "POST", headers: { "Content-Type": "application/json" },
                  })
                } catch {}
                goTo("/signup")
              }}>
                Sign Up — Free
              </button>
            </>
          )}
        </div>

        <main style={{ flex: 1, width: "100%", maxWidth: "100%" }}>{children}</main>
        <Footer />
      </div>
    </>
  )
}
