import Course from '../models/courseModel.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js'; // Add this import


// Get all courses (with optional search)
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { isActive: true },
      order: [['courseCode', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses
    });

  } catch (error) {
    console.error('Get all courses error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Basic course search (by name or code)
export const searchCourses = async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ 
      success: false,
      message: 'Search query is required' 
    });
  }

  try {
    const courses = await Course.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { courseCode: { [Op.like]: `%${query}%` } },
          { courseName: { [Op.like]: `%${query}%` } }
        ]
      },
      order: [['courseCode', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses
    });

  } catch (error) {
    console.error('Search courses error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Advanced course search with filters
export const advancedSearch = async (req, res) => {
  const { 
    query, 
    department, 
    level, 
    semester, 
    year,
    credits,
    instructor,
    availableOnly 
  } = req.query;

  try {
    // Build dynamic where clause
    const whereClause = { isActive: true };

    // Text search on name or code
    if (query && query.trim().length > 0) {
      whereClause[Op.or] = [
        { courseCode: { [Op.like]: `%${query}%` } },
        { courseName: { [Op.like]: `%${query}%` } }
      ];
    }

    // Filter by department
    if (department) {
      whereClause.department = department;
    }

    // Filter by level
    if (level) {
      whereClause.level = level;
    }

    // Filter by semester
    if (semester) {
      whereClause.semester = semester;
    }

    // Filter by year
    if (year) {
      whereClause.year = parseInt(year);
    }

    // Filter by credits
    if (credits) {
      whereClause.credits = parseInt(credits);
    }

    // Filter by instructor
    if (instructor) {
      whereClause.instructor = { [Op.like]: `%${instructor}%` };
    }

    // Filter by availability (courses with available seats)
    if (availableOnly === 'true') {
      whereClause[Op.and] = sequelize.literal('currentEnrollment < maxCapacity');
    }

    const courses = await Course.findAll({
      where: whereClause,
      order: [['courseCode', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      count: courses.length,
      filters: {
        query,
        department,
        level,
        semester,
        year,
        credits,
        instructor,
        availableOnly
      },
      courses
    });

  } catch (error) {
    console.error('Advanced search error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get a single course by ID
export const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: 'Course not found' 
      });
    }

    return res.status(200).json({
      success: true,
      course
    });

  } catch (error) {
    console.error('Get course error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get unique filter options for advanced search
export const getFilterOptions = async (req, res) => {
  try {
    const [departments, levels, semesters, instructors] = await Promise.all([
      Course.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('department')), 'department']],
        where: { isActive: true },
        raw: true
      }),
      Course.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('level')), 'level']],
        where: { isActive: true },
        raw: true
      }),
      Course.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('semester')), 'semester']],
        where: { isActive: true },
        raw: true
      }),
      Course.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('instructor')), 'instructor']],
        where: { isActive: true, instructor: { [Op.not]: null } },
        raw: true
      })
    ]);

    return res.status(200).json({
      success: true,
      filters: {
        departments: departments.map(d => d.department),
        levels: levels.map(l => l.level),
        semesters: semesters.map(s => s.semester),
        instructors: instructors.map(i => i.instructor),
        credits: [1, 2, 3, 4, 5, 6]
      }
    });

  } catch (error) {
    console.error('Get filter options error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};