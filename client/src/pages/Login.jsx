import React, { useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/Appcontext';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [state, setState] = useState("Login");
  const isSignup = state === "Sign up";
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContent);

  axios.defaults.withCredentials = true;

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      studentId: '',
      department: '',
      yearLevel: '1',
    },
    validationSchema: Yup.object({
      name: isSignup ? Yup.string().required('Name is required') : Yup.string(),
      email: Yup.string()
        .email('Invalid email address')
        .matches(
          /@.+\.edu$/,
          'Please use your university email address (must end with .edu)'
        )
        .required('University email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      studentId: isSignup 
        ? Yup.string().required('Student ID is required') 
        : Yup.string(),
      department: isSignup 
        ? Yup.string().required('Department is required') 
        : Yup.string(),
      yearLevel: isSignup 
        ? Yup.string().required('Year level is required') 
        : Yup.string(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        toast.dismiss();

        const url = isSignup 
          ? `${backendUrl}/api/auth/register` 
          : `${backendUrl}/api/auth/login`;
        
        const payload = isSignup 
          ? values 
          : { email: values.email, password: values.password };

        const response = await axios.post(url, payload);

        if (response.status === 200 || response.status === 201) {
          const message = response.data.message || 
            (isSignup ? 'Account created successfully!' : 'Login successful!');

        // In the onSubmit handler, update the signup section:
        if (isSignup) {
          toast.success(message, { toastId: 'signup-success', autoClose: 1500 });
          setIsLoggedIn(true);
          getUserData();
          
          // Redirect to email verification page
          setTimeout(() => {
            navigate('/email-verify');
            toast.info("Please check your email and enter the verification code", {
              toastId: 'verify-prompt',
              autoClose: 4000,
            });
          }, 1500);
        } else {
          // For login
          toast.success(message, { toastId: 'login-success', autoClose: 1500 });
          setIsLoggedIn(true);
          getUserData();
          
          // Check if user needs verification
          if (response.data.needsVerification) {
            setTimeout(() => {
              navigate('/email-verify');
              toast.warning("Please verify your email to access all features", {
                toastId: 'needs-verification',
                autoClose: 4000,
              });
            }, 1500);
          } else {
            setTimeout(() => {
              navigate('/');
            }, 1500);
          }
        }

        }
      } catch (error) {
        console.error('Auth error:', error);
        let errorMessage = 'An error occurred. Please try again.';
        
        if (error.response) {
          errorMessage = error.response.data?.message || 
            error.response.data?.error || 
            `Server error: ${error.response.status}`;
        } else if (error.request) {
          errorMessage = 'No response from server. Please check your connection.';
        } else {
          errorMessage = error.message || 'Network error occurred.';
        }

        toast.error(errorMessage, { toastId: 'auth-error', autoClose: 4000 });
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  const handleStateChange = (newState) => {
    toast.dismiss();
    setState(newState);
    formik.resetForm();
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-50 to-blue-100">
      <img 
        onClick={() => navigate('/')} 
        src={assets.logo} 
        alt="Logo" 
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer" 
      />
      
      <div className="bg-white p-8 sm:p-12 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          {isSignup 
            ? 'Register with your university email' 
            : 'Login to your account'}
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Name Field - Sign up only */}
          {isSignup && (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Full Name
              </label>
              <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                <img src={assets.person_icon} alt="" className="w-4" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="flex-1 outline-none text-sm"
                  {...formik.getFieldProps('name')}
                />
              </div>
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              University Email
            </label>
            <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
              <img src={assets.mail_icon} alt="" className="w-4" />
              <input
                type="email"
                placeholder="yourusername@aucegypt.edu"
                className="flex-1 outline-none text-sm"
                {...formik.getFieldProps('email')}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Student ID - Sign up only */}
          {isSignup && (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Student ID
              </label>
              <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                <img src={assets.person_icon} alt="" className="w-4" />
                <input
                  type="text"
                  placeholder="e.g., 2021001234"
                  className="flex-1 outline-none text-sm"
                  {...formik.getFieldProps('studentId')}
                />
              </div>
              {formik.touched.studentId && formik.errors.studentId && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.studentId}</p>
              )}
            </div>
          )}

          {/* Department - Sign up only */}
          {isSignup && (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Department
              </label>
              <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                <img src={assets.school_icon} alt="" className="w-4" />
                <input
                  type="text"
                  placeholder="e.g., Computer Science"
                  className="flex-1 outline-none text-sm"
                  {...formik.getFieldProps('department')}
                />
              </div>
              {formik.touched.department && formik.errors.department && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.department}</p>
              )}
            </div>
          )}

          {/* Year Level - Sign up only */}
          {isSignup && (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Year Level
              </label>
              <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                <img src={assets.grade_icon} alt="" className="w-4" />
                <select
                  className="flex-1 outline-none text-sm bg-transparent"
                  {...formik.getFieldProps('yearLevel')}
                >
                  <option value="1">First Year</option>
                  <option value="2">Second Year</option>
                  <option value="3">Third Year</option>
                  <option value="4">Fourth Year</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>
              {formik.touched.yearLevel && formik.errors.yearLevel && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.yearLevel}</p>
              )}
            </div>
          )}

          {/* Password Field */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Password
            </label>
            <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
              <img src={assets.lock_icon} alt="" className="w-4" />
              <input
                type="password"
                placeholder="Enter your password"
                className="flex-1 outline-none text-sm"
                {...formik.getFieldProps('password')}
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
            )}
          </div>

          {/* Forgot Password - Login only */}
          {!isSignup && (
            <p 
              onClick={() => navigate('/reset-password')} 
              className="text-sm text-blue-600 cursor-pointer hover:underline text-right"
            >
              Forgot password?
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {formik.isSubmitting ? 'Processing...' : (isSignup ? 'Sign Up' : 'Login')}
          </button>
        </form>

        {/* Toggle between Login and Sign Up */}
        <div className="text-center mt-6 text-sm text-gray-600">
          {isSignup ? (
            <>
              Already have an account?{' '}
              <span
                onClick={() => handleStateChange("Login")}
                className="text-blue-600 cursor-pointer hover:underline font-medium"
              >
                Login here
              </span>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <span
                onClick={() => handleStateChange("Sign up")}
                className="text-blue-600 cursor-pointer hover:underline font-medium"
              >
                Sign Up
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
