import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/Appcontext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn, isLoggedIn } = useContext(AppContent);

  axios.defaults.withCredentials = true;

  const sendVerificationOtp = async () => {
    try {
      toast.info('Sending verification email...', { autoClose: 700 });
      const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`);
      
      if (data.success) {
        toast.success('Verification email sent successfully');
        navigate('/email-verify');
      } else {
        toast.error(data.message || 'Failed to send verification email');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send verification email');
    }
  };

  const logout = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      
      if (data.success) {
        setUserData(null);
        setIsLoggedIn(false);
        toast.success('Logout successful');
        navigate('/login');
      }
    } catch (error) {
      toast.error('Logout failed. Please try again.');
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <img 
              src={assets.smalllogo} 
              alt="University Logo" 
              className="w-10 h-10 transition-transform group-hover:scale-110" 
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">Course Registration</h1>
              <p className="text-xs text-gray-500">University Portal</p>
            </div>
          </div>

          {/* Navigation Links & Actions */}
          <div className="flex items-center gap-4">
            {isLoggedIn && userData ? (
              <>
                {/* Navigation Links */}
                <button
                  onClick={() => navigate('/')}
                  className="hidden md:block px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => navigate('/courses')}
                  className="hidden md:block px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Courses
                </button>
                <button
                  onClick={() => navigate('/my-courses')}
                  className="hidden md:block px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  My Courses
                </button>

                {/* User Info & Dropdown */}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-semibold text-gray-900">{userData.name}</p>
                    <p className="text-xs text-gray-500">{userData.studentId}</p>
                  </div>

                  {/* User Avatar */}
                  <div className="relative group">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-blue-700 transition-colors">
                      {userData.name?.charAt(0).toUpperCase()}
                    </div>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="p-4 border-b border-gray-200">
                        <p className="font-semibold text-gray-900">{userData.name}</p>
                        <p className="text-sm text-gray-500">{userData.email}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {userData.department}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            Year {userData.yearLevel}
                          </span>
                        </div>
                      </div>

                      <div className="p-2">
                        {!userData.isAccountVerified && (
                          <button
                            onClick={sendVerificationOtp}
                            className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-md transition-colors flex items-center gap-2"
                          >
                            <span>⚠️</span>
                            Verify Email
                          </button>
                        )}
                        
                        <button
                          onClick={() => navigate('/')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors md:hidden"
                        >
                          🏠 Home
                        </button>
                        
                        <button
                          onClick={() => navigate('/courses')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors md:hidden"
                        >
                          📚 Courses
                        </button>
                        <button
                          onClick={() => navigate('/my-courses')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors md:hidden"
                        >
                          My Courses
                        </button>

                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center gap-2"
                        >
                          <span>🚪</span>
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
