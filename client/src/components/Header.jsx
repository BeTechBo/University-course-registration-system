import React from 'react';
import { assets } from '../assets/assets';
import { useContext } from 'react';
import { AppContent } from '../context/Appcontext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
              <span className="text-4xl">👋</span>
              <h1 className="text-3xl sm:text-4xl font-bold">
                Welcome{userData ? `, ${userData.name.split(' ')[0]}` : ''}!
              </h1>
            </div>
            
            <p className="text-xl sm:text-2xl text-blue-100 mb-6">
              University Course Registration System
            </p>
            
            <p className="text-base sm:text-lg text-blue-200 mb-8 max-w-2xl">
              Browse and register for courses, manage your academic schedule, 
              and track your progress all in one place.
            </p>

            {userData && (
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <button
                  onClick={() => navigate('/courses')}
                  className="px-8 py-3 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Browse Courses
                </button>
                
                {!userData.isAccountVerified && (
                  <button
                    onClick={() => navigate('/email-verify')}
                    className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Verify Email
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Image/Illustration */}
          <div className="flex-1 max-w-md">
            <img 
              src={assets.auclogo} 
              alt="Students studying" 
              className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="relative">
        <svg 
          className="absolute bottom-0 w-full h-12 sm:h-16" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            fill="#f9fafb"
          />
        </svg>
      </div>
    </div>
  );
};

export default Header;
