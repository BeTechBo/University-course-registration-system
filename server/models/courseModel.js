import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  courseCode: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    comment: 'Unique course code (e.g., CS101, MATH202)'
  },
  courseName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Full course name'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Detailed course description'
  },
  credits: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 6
    },
    comment: 'Credit hours (1-6)'
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Department offering the course'
  },
  level: {
    type: DataTypes.ENUM('100', '200', '300', '400', 'Graduate'),
    allowNull: false,
    comment: 'Course level (100-level, 200-level, etc.)'
  },
  instructor: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Primary instructor name'
  },
  maxCapacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30,
    validate: {
      min: 1
    },
    comment: 'Maximum number of students'
  },
  currentEnrollment: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    },
    comment: 'Current number of enrolled students'
  },
  schedule: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Class schedule (e.g., "MWF 10:00-11:00")'
  },
  room: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Classroom location'
  },
  semester: {
    type: DataTypes.ENUM('Fall', 'Spring', 'Summer'),
    allowNull: false,
    comment: 'Semester offering'
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 2024,
      max: 2030
    },
    comment: 'Academic year'
  },
  prerequisites: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Prerequisites as comma-separated course codes'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Whether the course is currently available for registration'
  }
}, {
  timestamps: true,
  tableName: 'courses',
  indexes: [
    {
      fields: ['courseCode'],
      name: 'courses_course_code_index'
    },
    {
      fields: ['department'],
      name: 'courses_department_index'
    },
    {
      fields: ['level'],
      name: 'courses_level_index'
    },
    {
      fields: ['semester', 'year'],
      name: 'courses_semester_year_index'
    },
    {
      fields: ['courseName'],
      name: 'courses_name_index',
      type: 'FULLTEXT'
    }
  ]
});

// Instance method to check if course is full
Course.prototype.isFull = function() {
  return this.currentEnrollment >= this.maxCapacity;
};

// Instance method to get available seats
Course.prototype.getAvailableSeats = function() {
  return this.maxCapacity - this.currentEnrollment;
};

export default Course;
