import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { AppContent } from '../context/Appcontext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
  axios.defaults.withCredentials = true;
  const { backendUrl } = useContext(AppContent);

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value.length === 1 && index < 5) {
      inputRefs.current[index + 1].focus();
    } else if (value.length === 0 && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && e.target.value.length === '') {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pastedValue = e.clipboardData.getData('text');
    if (/^\d{6}$/.test(pastedValue)) {
      pastedValue.split('').forEach((char, index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index].value = char;
          inputRefs.current[index].dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      inputRefs.current[5].focus();
    }
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email });
      if (data.success) {
        setIsEmailSent(true);
        toast.success('Password reset code sent to your email');
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred while sending OTP');
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(input => input.value);
    const otpValue = otpArray.join('');
    
    if (otpValue.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }
    
    setOtp(otpValue);
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, { 
        email, 
        otp, 
        newPassword 
      });
      
      if (data.success) {
        toast.success('Password reset successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        toast.error(data.message || 'Failed to reset password');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred while resetting password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-50 to-blue-100">
      <img
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        onClick={() => navigate('/')}
      />

      {/* Email Input Form */}
      {!isEmailSent && (
        <form onSubmit={onSubmitEmail} className="bg-white p-8 sm:p-12 rounded-lg shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔒</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h1>
            <p className="text-sm text-gray-600">
              Enter your email address and we'll send you a code to reset your password
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
              <img src={assets.mail_icon} alt="" className="w-5" />
              <input
                type="email"
                placeholder="yourname@university.edu"
                className="flex-1 outline-none text-sm"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Send Reset Code
          </button>

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              ← Back to Login
            </button>
          </div>
        </form>
      )}

      {/* OTP Input Form */}
      {isEmailSent && !isOtpSubmitted && (
        <form onSubmit={onSubmitOtp} className="bg-white p-8 sm:p-12 rounded-lg shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📧</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Enter Reset Code</h1>
            <p className="text-sm text-gray-600 mb-1">
              We've sent a 6-digit code to
            </p>
            <p className="text-sm font-semibold text-blue-600">{email}</p>
          </div>

          <div className="flex justify-center gap-2 mb-6">
            {Array(6).fill(0).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                required
                ref={(e) => (inputRefs.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined}
              />
            ))}
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4">
            Verify Code
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsEmailSent(false);
                setEmail('');
                inputRefs.current.forEach(input => {
                  if (input) input.value = '';
                });
              }}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              ← Use different email
            </button>
          </div>
        </form>
      )}

      {/* New Password Form */}
      {isOtpSubmitted && (
        <form onSubmit={onSubmitNewPassword} className="bg-white p-8 sm:p-12 rounded-lg shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Password</h1>
            <p className="text-sm text-gray-600">
              Your code has been verified. Enter a new password for your account.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
              <img src={assets.lock_icon} alt="" className="w-5" />
              <input
                type="password"
                placeholder="Enter new password (min. 6 characters)"
                className="flex-1 outline-none text-sm"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            {newPassword.length > 0 && newPassword.length < 6 && (
              <p className="text-red-500 text-xs mt-1">Password must be at least 6 characters</p>
            )}
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
