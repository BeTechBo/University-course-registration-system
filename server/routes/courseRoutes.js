import express from 'express';
import { 
  getAllCourses, 
  searchCourses, 
  advancedSearch,
  getCourseById,
  getFilterOptions
} from '../controllers/courseController.js';
import userAuth from '../middleware/userAuth.js';

const courseRouter = express.Router();

// All course routes require authentication
courseRouter.use(userAuth);

// Get all courses
courseRouter.get('/', getAllCourses);

// Basic search by name or code
courseRouter.get('/search', searchCourses);

// Advanced search with filters
courseRouter.get('/advanced-search', advancedSearch);

// Get filter options for frontend dropdowns
courseRouter.get('/filters', getFilterOptions);

// Get single course by ID
courseRouter.get('/:id', getCourseById);

export default courseRouter;
