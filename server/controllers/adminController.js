import Enrollment from '../models/enrollmentModel.js';
import Course from '../models/courseModel.js';
import User from '../models/userModel.js';

// Get all enrollments with filters
export const getAllEnrollments = async (req, res) => {
  try {
    const { status, semester, year, courseId, studentId } = req.query;

    const whereClause = {};
    const courseWhereClause = {};

    if (status) whereClause.status = status;
    if (semester) courseWhereClause.semester = semester;
    if (year) courseWhereClause.year = year;
    if (courseId) whereClause.courseId = courseId;
    if (studentId) whereClause.userId = studentId;

    const enrollments = await Enrollment.findAll({
      where: whereClause,
      include: [
        {
          model: Course,
          as: 'course',
          where: Object.keys(courseWhereClause).length > 0 ? courseWhereClause : undefined,
          attributes: ['id', 'courseCode', 'courseName', 'credits', 'department', 'semester', 'year']
        },
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email', 'studentId', 'department', 'yearLevel']
        }
      ],
      order: [['enrolledAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments
    });

  } catch (error) {
    console.error('Get all enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollments',
      error: error.message
    });
  }
};

// Update enrollment status (mark as completed/failed)
export const updateEnrollmentStatus = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { status, grade } = req.body;

    // Validate status
    const validStatuses = ['enrolled', 'completed', 'dropped', 'failed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    // Find enrollment
    const enrollment = await Enrollment.findByPk(enrollmentId, {
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'courseCode', 'courseName', 'credits']
        },
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email', 'studentId']
        }
      ]
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Update enrollment
    enrollment.status = status;
    
    if (grade) {
      enrollment.grade = grade;
    }

    if (status === 'completed' || status === 'failed') {
      enrollment.completedAt = new Date();
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: `Enrollment status updated to ${status}`,
      enrollment
    });

  } catch (error) {
    console.error('Update enrollment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update enrollment status',
      error: error.message
    });
  }
};

// Get student enrollment history
export const getStudentEnrollments = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Get student info
    const student = await User.findByPk(studentId, {
      attributes: ['id', 'name', 'email', 'studentId', 'department', 'yearLevel', 'maxCreditsPerSemester']
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get all enrollments
    const enrollments = await Enrollment.findAll({
      where: { userId: studentId },
      include: [{
        model: Course,
        as: 'course',
        attributes: ['id', 'courseCode', 'courseName', 'credits', 'department', 'semester', 'year']
      }],
      order: [['enrolledAt', 'DESC']]
    });

    // Calculate statistics
    const completedCourses = enrollments.filter(e => e.status === 'completed');
    const totalCreditsCompleted = completedCourses.reduce((sum, e) => sum + (e.course?.credits || 0), 0);
    const currentEnrollments = enrollments.filter(e => e.status === 'enrolled');
    const currentCredits = currentEnrollments.reduce((sum, e) => sum + (e.course?.credits || 0), 0);

    res.status(200).json({
      success: true,
      student,
      enrollments,
      statistics: {
        totalEnrollments: enrollments.length,
        completedCourses: completedCourses.length,
        totalCreditsCompleted,
        currentEnrollments: currentEnrollments.length,
        currentCredits,
        droppedCourses: enrollments.filter(e => e.status === 'dropped').length,
        failedCourses: enrollments.filter(e => e.status === 'failed').length
      }
    });

  } catch (error) {
    console.error('Get student enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student enrollments',
      error: error.message
    });
  }
};

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.findAll({
      where: { role: 'student' },
      attributes: ['id', 'name', 'email', 'studentId', 'department', 'yearLevel', 'maxCreditsPerSemester', 'createdAt'],
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: students.length,
      students
    });

  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message
    });
  }
};

// Bulk update enrollments
export const bulkUpdateEnrollments = async (req, res) => {
  try {
    const { enrollmentIds, status, grade } = req.body;

    if (!Array.isArray(enrollmentIds) || enrollmentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'enrollmentIds must be a non-empty array'
      });
    }

    const validStatuses = ['enrolled', 'completed', 'dropped', 'failed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const updateData = { status };
    if (grade) updateData.grade = grade;
    if (status === 'completed' || status === 'failed') {
      updateData.completedAt = new Date();
    }

    const result = await Enrollment.update(
      updateData,
      {
        where: {
          id: enrollmentIds
        }
      }
    );

    res.status(200).json({
      success: true,
      message: `Updated ${result[0]} enrollments`,
      updatedCount: result[0]
    });

  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bulk update enrollments',
      error: error.message
    });
  }
};
