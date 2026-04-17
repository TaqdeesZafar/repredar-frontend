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
        <div className="text-[#2d3361] font-bold text-2xl md:text-2xl" style={{ lineHeight: "1" }}>
            Rep<br />Radar
          </div>
        </div>
      </div>
    </div>
  );
}

export default Logo;