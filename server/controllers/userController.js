import User from "../models/userModel.js";

export const getUserData = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ['password', 'verifyOTP', 'verifyOTPExpireAt', 'resetOTP', 'resetOTPExpireAt']
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      userData: {
        id: user.id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        department: user.department,
        yearLevel: user.yearLevel,
        isAccountVerified: user.isAccountVerified,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Get user data error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
