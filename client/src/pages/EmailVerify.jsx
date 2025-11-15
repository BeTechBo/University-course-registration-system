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
};

export default EmailVerify;
