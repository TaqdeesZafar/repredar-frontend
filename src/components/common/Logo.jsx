import { useNavigate } from 'react-router-dom';
import repuLogo from '/src/assets/repu_logo.png';

function Logo({ className = '' }) {
  const navigate = useNavigate();
  
  return (
    <div
      className={`flex items-center cursor-pointer ${className}`}
      onClick={() => navigate('/')}
    >
      <div className="flex items-center">
        {/* Target/Radar Icon */}
        <div className="mr-3">
          <img src={repuLogo} alt="Rep Radar Logo" className="h-20 w-20" />
        </div>
        
        {/* Text Content */}
        <div className="flex flex-col">
          <div style={{ color: "#F0F4FF", fontWeight: 700, fontSize: 22, lineHeight: 1, letterSpacing: "-0.02em", fontFamily: "inherit" }}>
            Rep<br />Radar
          </div>
        </div>
      </div>
    </div>
  );
}

export default Logo;