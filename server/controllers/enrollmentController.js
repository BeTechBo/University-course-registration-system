import Enrollment from '../models/enrollmentModel.js';
import Course from '../models/courseModel.js';
import User from '../models/userModel.js';
import sequelize from '../config/database.js';

// Enroll in a course
export const enrollInCourse = async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ 
      success: false,
      message: 'Course ID is required' 
    });
  }

  try {
    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: 'Course not found' 
      });
    }

    // Check if course is active
    if (!course.isActive) {
      return res.status(400).json({ 
        success: false,
        message: 'This course is not available for enrollment' 
      });
    }

    // Check for any existing enrollment record (enrolled or dropped)
    const existingEnrollment = await Enrollment.findOne({
      where: { userId, courseId }
    });

    if (existingEnrollment && existingEnrollment.status === 'enrolled') {
      return res.status(400).json({ 
        success: false,
        message: 'You are already enrolled in this course' 
      });
    }

    // Check if course is full
    if (course.currentEnrollment >= course.maxCapacity) {
      return res.status(400).json({ 
        success: false,
        message: 'This course is full' 
      });
    }

    let enrollment;

    if (existingEnrollment && existingEnrollment.status !== 'enrolled') {
      // Re-enroll by updating the existing dropped enrollment
      existingEnrollment.status = 'enrolled';
      // update enrolledAt if your model has this field
      if (Object.prototype.hasOwnProperty.call(existingEnrollment, 'enrolledAt')) {
        existingEnrollment.enrolledAt = new Date();
      }
      await existingEnrollment.save();
      enrollment = existingEnrollment;

      // Increment course enrollment count
      await course.increment('currentEnrollment');
    } else {
      // Create enrollment
      enrollment = await Enrollment.create({
        userId,
        courseId,
        status: 'enrolled'
      });

      // Increment course enrollment count
      await course.increment('currentEnrollment');
    }

    // Fetch the enrollment with course details
    const enrollmentWithDetails = await Enrollment.findByPk(enrollment.id, {
      include: [{
        model: Course,
        as: 'course',
        attributes: ['id', 'courseCode', 'courseName', 'credits', 'instructor', 'schedule']
      }]
    });

    return res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      enrollment: enrollmentWithDetails
    });

  } catch (error) {
    console.error('Enrollment error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to enroll in course', 
      error: error.message 
    });
  }
};

// Drop a course
export const dropCourse = async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.params;

  try {
    // Find active enrollment
    const enrollment = await Enrollment.findOne({
      where: { userId, courseId, status: 'enrolled' }
    });

    if (!enrollment) {
      return res.status(404).json({ 
        success: false,
        message: 'Enrollment not found or already dropped' 
      });
    }

    // Update enrollment status to dropped
    enrollment.status = 'dropped';
    await enrollment.save();

    // Decrement course enrollment count
    const course = await Course.findByPk(courseId);
    if (course && course.currentEnrollment > 0) {
      await course.decrement('currentEnrollment');
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully dropped course'
    });

  } catch (error) {
    console.error('Drop course error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to drop course', 
      error: error.message 
    });
  }
};

// Get user's enrolled courses
export const getMyEnrollments = async (req, res) => {
  const userId = req.user.id;

  try {
    const enrollments = await Enrollment.findAll({
      where: { userId, status: 'enrolled' },
      include: [{
        model: Course,
        as: 'course',
        attributes: [
          'id', 'courseCode', 'courseName', 'credits', 
          'department', 'instructor', 'schedule', 'room',
          'semester', 'year', 'maxCapacity', 'currentEnrollment'
        ]
      }],
      order: [['enrolledAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments
    });

  } catch (error) {
    console.error('Get enrollments error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to fetch enrollments', 
      error: error.message 
    });
  }
};

// Check if user is enrolled in a specific course
export const checkEnrollment = async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.params;

  try {
    const enrollment = await Enrollment.findOne({
      where: { userId, courseId, status: 'enrolled' }
    });

    return res.status(200).json({
      success: true,
      isEnrolled: !!enrollment
    });

  } catch (error) {
    console.error('Check enrollment error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to check enrollment status', 
      error: error.message 
    });
  }
};
