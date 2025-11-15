import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
      isUniversityEmail(value) {
        // Replace with your university domain
        if (!value.endsWith('@aucegypt.edu')) {
          throw new Error('Email must be a valid university email address');
        }
      }
    }
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'University student ID number'
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Student department or major'
  },
  yearLevel: {
    type: DataTypes.ENUM('1', '2', '3', '4', 'Graduate'),
    allowNull: false,
    defaultValue: '1'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'student'
  },
  verifyOTP: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  verifyOTPExpireAt: {
    type: DataTypes.BIGINT,
    defaultValue: 0
  },
  isAccountVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  resetOTP: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  resetOTPExpireAt: {
    type: DataTypes.BIGINT,
    defaultValue: 0
  }
}, {
  timestamps: true,
  tableName: 'users',
  indexes: [
    {
      unique: true,
      fields: ['email'],
      name: 'users_email_unique'
    },
    {
      unique: true,
      fields: ['studentId'],
      name: 'users_student_id_unique'
    }
  ],
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Add password comparison method
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default User;
