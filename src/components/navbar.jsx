import { useState, useEffect } from 'react';
import Logo from './common/Logo';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => {
    navigate('/login', { state: { from: location.pathname } });
  };

  const handleSignup = async () => {
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
    navigate('/signup');
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header className='container mx-auto px-4 py-4 flex items-center justify-between'>
      <div className='flex items-center'>
        <Logo />
      </div>

      <nav className='hidden md:flex items-center space-x-6'>
        {/* <a
          href='#pricing'
          className='text-gray-600 hover:text-gray-900 relative z-10'
        >
          Pricing
        </a>
        <div className='relative group z-10'>
          <button className='text-gray-600 hover:text-gray-900 flex items-center relative z-10'>
            Use Cases
            <svg
              className='w-4 h-4 ml-1'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </button>
        </div> */}

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 cursor-pointer relative z-10'
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={handleLogin}
              className='text-gray-600 hover:text-gray-900 cursor-pointer relative z-10'
            >
              Login
            </button>
            <button
              onClick={handleSignup}
              className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer relative z-10'
            >
              Sign Up
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
