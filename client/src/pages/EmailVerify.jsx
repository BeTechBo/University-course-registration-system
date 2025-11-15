import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/Appcontext';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmailVerify = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, getUserData, isLoggedIn } = useContext(AppContent);
  const [isResending, setIsResending] = useState(false);

  axios.defaults.withCredentials = true;

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

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(input => input.value);
      const otp = otpArray.join('');

      if (otp.length !== 6) {
        toast.error('Please enter all 6 digits');
        return;
      }

      const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, { otp });

      if (data.success) {
        toast.success('Email verified successfully!');
        getUserData();
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        toast.error(data.message || 'Failed to verify email');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify email');
    }
  };

  const resendOtp = async () => {
    try {
      setIsResending(true);
      const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`);

      if (data.success) {
        toast.success('Verification code sent to your email');
        // Clear OTP inputs
        inputRefs.current.forEach(input => {
          if (input) input.value = '';
        });
        inputRefs.current[0]?.focus();
      } else {
        toast.error(data.message || 'Failed to send verification code');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send verification code');
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && userData && userData.isAccountVerified) {
      navigate('/');
    }
  }, [userData, isLoggedIn, navigate]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-50 to-blue-100">
      <img 
        onClick={() => navigate('/')} 
        src={assets.logo} 
        alt="Logo" 
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer" 
      />

      <div className="bg-white p-8 sm:p-12 rounded-lg shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📧</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Verify Your Email
          </h2>
          <p className="text-sm text-gray-600">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-sm font-semibold text-blue-600 mt-1">
            {userData?.email}
          </p>
        </div>

        <form onSubmit={onSubmitHandler}>
          <div className="flex justify-center gap-2 mb-6">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                ref={(el) => (inputRefs.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined}
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4"
          >
            Verify Email
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={resendOtp}
              disabled={isResending}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isResending ? 'Sending...' : 'Resend Code'}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
