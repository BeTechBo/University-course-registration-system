import React from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import { useContext } from 'react';
import { AppContent } from '../context/Appcontext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { userData, isLoggedIn } = useContext(AppContent);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Header />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoggedIn && userData ? (
          <>
            {/* Student Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Student ID</p>
                    <p className="font-semibold text-gray-900">{userData.studentId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-semibold text-gray-900">{userData.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📅</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Year Level</p>
                    <p className="font-semibold text-gray-900">Year {userData.yearLevel}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${userData.isAccountVerified ? 'bg-green-100' : 'bg-orange-100'} rounded-full flex items-center justify-center`}>
                    <span className="text-2xl">{userData.isAccountVerified ? '✅' : '⚠️'}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account Status</p>
                    <p className={`font-semibold ${userData.isAccountVerified ? 'text-green-600' : 'text-orange-600'}`}>
                      {userData.isAccountVerified ? 'Verified' : 'Not Verified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                  onClick={() => navigate('/courses')}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 cursor-pointer group border-2 border-transparent hover:border-blue-500"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-blue-100 group-hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                      <span className="text-3xl group-hover:scale-110 transition-transform">📚</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Browse Courses</h3>
                  </div>
                  <p className="text-gray-600">
                    Explore available courses and find the perfect classes for your schedule.
                  </p>
                </div>

                <div 
                  onClick={() => navigate('/courses')}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 cursor-pointer group border-2 border-transparent hover:border-green-500"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-green-100 group-hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors">
                      <span className="text-3xl group-hover:scale-110 transition-transform">🔍</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Search Courses</h3>
                  </div>
                  <p className="text-gray-600">
                    Use advanced filters to find courses by department, level, or instructor.
                  </p>
                </div>

                <div 
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 cursor-pointer group border-2 border-transparent hover:border-purple-500 opacity-60"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-3xl">📝</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">My Schedule</h3>
                  </div>
                  <p className="text-gray-600">
                    View your registered courses and manage your academic schedule.
                  </p>
                  <span className="text-xs text-gray-400 italic mt-2 block">Coming Soon</span>
                </div>
              </div>
            </div>

            {/* System Features */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">System Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                    <span className="text-3xl">🔐</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Secure Access</h3>
                  <p className="text-sm text-gray-600">
                    University email verification and secure authentication
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                    <span className="text-3xl">⚡</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Real-time Search</h3>
                  <p className="text-sm text-gray-600">
                    Instant course search with live results as you type
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Advanced Filters</h3>
                  <p className="text-sm text-gray-600">
                    Filter by department, level, credits, and availability
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                    <span className="text-3xl">📱</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Responsive Design</h3>
                  <p className="text-sm text-gray-600">
                    Access from any device - desktop, tablet, or mobile
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Not Logged In View */
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl p-8 sm:p-12 text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">🎓</span>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Get Started with Course Registration
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Access the complete course catalog, register for classes, and manage your 
                academic schedule all in one convenient platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                >
                  Login to Your Account
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all font-semibold"
                >
                  Create New Account
                </button>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Why Use Our System?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                  <div>
                    <div className="text-2xl mb-2">✨</div>
                    <h4 className="font-semibold text-gray-900 mb-1">Easy to Use</h4>
                    <p className="text-sm text-gray-600">
                      Intuitive interface designed for students
                    </p>
                  </div>
                  <div>
                    <div className="text-2xl mb-2">🚀</div>
                    <h4 className="font-semibold text-gray-900 mb-1">Fast & Reliable</h4>
                    <p className="text-sm text-gray-600">
                      Quick course search and registration
                    </p>
                  </div>
                  <div>
                    <div className="text-2xl mb-2">🔒</div>
                    <h4 className="font-semibold text-gray-900 mb-1">Secure</h4>
                    <p className="text-sm text-gray-600">
                      Your data is protected and encrypted
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 University Course Registration System. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Built with React, Node.js, and Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
