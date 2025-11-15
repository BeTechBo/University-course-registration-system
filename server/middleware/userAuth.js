import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const userAuth = async (req, res, next) => {
  try {
    // Try to get token from Authorization header
    let token = req.header('Authorization')?.replace('Bearer ', '');

    // If not found in header, try cookies
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

export default userAuth;
