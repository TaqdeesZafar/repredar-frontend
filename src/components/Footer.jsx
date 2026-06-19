import { useNavigate } from "react-router-dom";
import Logo from "./common/Logo";

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const linkStyle = {
    color: "var(--text-2)", fontSize: 13, textDecoration: "none",
    cursor: "pointer", transition: "color 0.15s", background: "none",
    border: "none", padding: 0, textAlign: "left", fontFamily: "inherit", display: "block",
  };

  const colTitle = {
    fontSize: 11, fontWeight: 700, color: "var(--text-3)",
    textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14,
  };

  const NavLink = ({ to, href, children }) => (
    <button
      style={linkStyle}
      onMouseOver={e => e.currentTarget.style.color = "var(--accent)"}
      onMouseOut={e => e.currentTarget.style.color = "var(--text-2)"}
      onClick={() => href ? window.open(href, "_blank", "noopener") : navigate(to)}
    >
      {children}
    </button>
  );

  return (
    <footer style={{
      background: "var(--bg-surface)",
      borderTop: "1px solid var(--border)",
      marginTop: "auto",
    }}>
      <style>{`
        @media (max-width: 700px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 28px 16px !important; }
          .footer-brand-col { grid-column: 1 / -1 !important; }
          .footer-bottom { flex-direction: column !important; gap: 10px !important; text-align: center !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 32px" }}>
        <div className="footer-grid" style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
          gap: 40,
        }}>
          {/* Brand column */}
          <div className="footer-brand-col">
            <Logo />
            <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6, margin: "16px 0 16px", maxWidth: 280 }}>
              See what the internet says about anyone. AI-powered reputation intelligence across 6 platforms — free.
            </p>
            <p style={{ fontSize: 12, color: "var(--text-3)", margin: 0 }}>
              by{" "}
              <a href="https://reputationreturn.com" target="_blank" rel="noopener noreferrer"
                 style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
                Reputation Return
              </a>
            </p>
          </div>

          {/* Product */}
          <div>
            <div style={colTitle}>Product</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              <NavLink to="/">Check Reputation</NavLink>
              <NavLink to="/signup">Create Account</NavLink>
              <NavLink to="/login">Login</NavLink>
            </div>
          </div>

          {/* Company */}
          <div>
            <div style={colTitle}>Company</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              <NavLink href="https://reputationreturn.com">About Reputation Return</NavLink>
              <NavLink href="https://reputationreturn.com/our-services/">Our Services</NavLink>
              <NavLink href="https://reputationreturn.com/calendar/">Book a Consultation</NavLink>
            </div>
          </div>

          {/* Legal */}
          <div>
            <div style={colTitle}>Legal</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              <NavLink to="/privacy">Privacy Policy</NavLink>
              <NavLink to="/terms">Terms of Service</NavLink>
              <NavLink href="https://reputationreturn.com/contact/">Contact</NavLink>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom" style={{
          marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <p style={{ fontSize: 12, color: "var(--text-3)", margin: 0 }}>
            © {year} Rep Radar · Reputation Return. All rights reserved.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 12, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block" }}/>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
