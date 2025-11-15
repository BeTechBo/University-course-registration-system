import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { AppContent } from '../context/Appcontext'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ResetPassword = () => {
  axios.defaults.withCredentials = true
  const { backendUrl, getUserData } = useContext(AppContent)

  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState('')
  const [otp, setOtp] = useState(0)
  const [isOtpsubmitted, setIsOtpSubmitted] = useState(false)

    const inputRefs = React.useRef([]);
    const handleInput = (e, index) => {
      const value = e.target.value;
      if (value.length === 1 && index < 5) {
        inputRefs.current[index + 1].focus();
      } else if (value.length === 0 && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
    const handleKeyDown = (e, index) => {
      if (e.key === 'Backspace' && index > 0 && e.target.value.length === '') {
        inputRefs.current[index - 1].focus();
      } else if (e.key === 'ArrowRight' && index < 5) {
        inputRefs.current[index + 1].focus();
      } else if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  
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
    } 

  const onSubmitEmail = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email })
      if (data.message === 'OTP sent successfully') {
        setIsEmailSent(true)
        toast.success(data.message)
      } else {
        toast.error(data.message || 'Failed to send OTP')
      }
    } catch (error) {
      toast.error('An error occurred while sending OTP')
    }
  }

  const onSubmitOtp = async (e) => {
    e.preventDefault()
      const otpArray = inputRefs.current.map(input => input.value)
      const otp = otpArray.join('')
      setOtp(otp)
      setIsOtpSubmitted(true)
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, { email, otp, newPassword })
      if (data.message === 'Password reset successfully') {
        toast.success(data.message)
        navigate('/login')
      } else {
        toast.error(data.message || 'Failed to reset password')
      }
    } catch (error) {
      toast.error('An error occurred while resetting password')
    }
  }
  

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
        <img
          src={assets.logo}
          alt="Logo"
          className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
          onClick={() => navigate('/')}
        />

        {/* email input form */}

        {!isEmailSent &&
        <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-2xl font-semibold text-white mb-4 text-center'>Password Reset </h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the email you want to reset password for.</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src= {assets.mail_icon} alt = ""/>
            <input
              type="email"
              placeholder='Enter your email'
              className='w-full bg-transparent text-white outline-none'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>

          <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white 
          rounded-full mt-3 cursor-pointer'>
            Submit
          </button>

        </form>
        }
        {/* OTP Input Form */}
        {isEmailSent && !isOtpsubmitted &&
        <form onSubmit={onSubmitOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-2xl font-semibold text-white mb-4 text-center'>Reset password OTP </h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit OTP sent to your email.</p>
          <div className='flex justify-between mb-8'>
            {Array(6).fill(0).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className='w-12 h-12 text-center bg-[#333A5C] text-white text-xl rounded-md'
                required
                ref={e => inputRefs.current[index] = e}
                onInput={(e) => {handleInput(e, index)}}
                onKeyDown={(e) => {handleKeyDown(e, index)}}
                onPaste={handlePaste}
              />
            ))}

          </div>
          <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>
            Submit
          </button>
        </form>
        }

        {/* Reset Password Form */}

        {isOtpsubmitted &&
        <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-2xl font-semibold text-white mb-4 text-center'>Reset Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter your new password.</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" />
            <input
              type="password"
              placeholder='New Password'
              className='w-full bg-transparent text-white outline-none'
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white 
          rounded-full mt-3 cursor-pointer'>
            Reset Password
          </button> 
        </form>
        }


    </div>
  )
}

export default ResetPassword