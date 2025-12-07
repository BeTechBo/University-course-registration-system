import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './userModel.js';
import Course from './courseModel.js';

const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('enrolled', 'dropped', 'completed'),
    defaultValue: 'enrolled',
    allowNull: false
  },
  grade: {
    type: DataTypes.STRING(2),
    allowNull: true,
    comment: 'Final grade (e.g., A, B+, C)'
  },
  enrolledAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
    grade: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIn: [['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F', 'P', 'NP', 'W', 'I']]
    },
    comment: 'Final grade for completed courses'
  },
  // ✅ NEW: Add completion date
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Date when course was completed'
  }
}, {
  timestamps: true,
  tableName: 'enrollments',
  indexes: [
    {
      unique: true,
      fields: ['userId', 'courseId'],
      name: 'enrollments_user_course_unique'
    }
  ]
});

// Define associations
User.belongsToMany(Course, { 
  through: Enrollment, 
  foreignKey: 'userId',
  otherKey: 'courseId',
  as: 'enrolledCourses'
});

Course.belongsToMany(User, { 
  through: Enrollment, 
  foreignKey: 'courseId',
  otherKey: 'userId',
  as: 'enrolledStudents'
});

// Direct associations for easier querying
Enrollment.belongsTo(User, { foreignKey: 'userId', as: 'student' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

User.hasMany(Enrollment, { foreignKey: 'userId', as: 'enrollments' });
Course.hasMany(Enrollment, { foreignKey: 'courseId', as: 'enrollments' });

export default Enrollment;
