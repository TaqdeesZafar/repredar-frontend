import { useNavigate } from 'react-router-dom';
import repuLogo from '/src/assets/repu_logo.png';

function Logo({ className = '' }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate('/')}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        cursor: "pointer",
        userSelect: "none",
        textDecoration: "none",
      }}
    >
      <img
        src={repuLogo}
        alt="Rep Radar"
        style={{ width: 36, height: 36, objectFit: "contain", flexShrink: 0 }}
      />
      <span style={{
        fontSize: 17,
        fontWeight: 800,
        color: "var(--text-1)",
        letterSpacing: "-0.02em",
        lineHeight: 1,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>
        Rep Radar
      </span>
    </div>
  );
}

export default Logo;
