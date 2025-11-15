import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import User from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';

export const register = async (req, res) => {
  const { name, email, studentId, department, yearLevel, password } = req.body;

  // Validate required fields
  if (!name || !email || !studentId || !department || !yearLevel || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Validate university email domain
  if (!email.endsWith('@aucegypt.edu')) {  // Replace with your university domain
    return res.status(400).json({ message: 'Please use your university email address' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [{ email }, { studentId }] 
      } 
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      if (existingUser.studentId === studentId) {
        return res.status(400).json({ message: 'Student ID already registered' });
      }
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      studentId,
      department,
      yearLevel,
      password,
    });

    // Generate OTP immediately after registration
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOTP = otp;
    user.verifyOTPExpireAt = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    // Generate JWT token and log user in
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send OTP email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'University Registration - Email Verification',
      html: EMAIL_VERIFY_TEMPLATE.replace('{{email}}', email).replace('{{otp}}', otp),
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ 
      success: true,
      message: 'Registration successful. Please check your email for verification code.',
      needsVerification: true
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Allow login but return verification status
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ 
      success: true,
      message: 'Login successful',
      isVerified: user.isAccountVerified,
      needsVerification: !user.isAccountVerified
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Keep other functions the same (logout, sendVerifyOtp, verifyEmail, etc.)
export const logout = (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    res.status(200).json({ success: true, message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const sendVerifyOtp = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({ message: 'Account already verified' });
    }

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOTP = otp;
    user.verifyOTPExpireAt = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'University Registration - Email Verification',
      html: EMAIL_VERIFY_TEMPLATE.replace('{{email}}', user.email).replace('{{otp}}', otp),
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ 
      success: true,
      message: 'Verification code sent to your email' 
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const userId = req.user?.id;
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({ message: 'OTP is required' });
  }

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({ message: 'Account already verified' });
    }

    if (user.verifyOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (Date.now() > Number(user.verifyOTPExpireAt)) {
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    user.isAccountVerified = true;
    user.verifyOTP = '';
    user.verifyOTPExpireAt = 0;
    await user.save();

    return res.status(200).json({ 
      success: true,
      message: 'Email verified successfully' 
    });

  } catch (error) {
    console.error('Verify email error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const isAuthenticated = (req, res) => {
  if (req.user) {
    return res.status(200).json({ 
      success: true,
      message: 'User is authenticated' 
    });
  }
  return res.status(401).json({ 
    success: false,
    message: 'Unauthorized' 
  });
};

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOTP = otp;
    user.resetOTPExpireAt = Date.now() + 30 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Password Reset Request',
      html: PASSWORD_RESET_TEMPLATE.replace('{{email}}', email).replace('{{otp}}', otp),
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ 
      success: true,
      message: 'Password reset code sent to your email' 
    });

  } catch (error) {
    console.error('Send reset OTP error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'Email, OTP, and new password are required' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.resetOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (Date.now() > Number(user.resetOTPExpireAt)) {
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    user.password = newPassword; // Hashed by beforeUpdate hook
    user.resetOTP = '';
    user.resetOTPExpireAt = 0;
    await user.save();

    return res.status(200).json({ 
      success: true,
      message: 'Password reset successfully' 
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
