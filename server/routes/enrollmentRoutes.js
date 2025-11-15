import express from 'express';
import { 
  enrollInCourse, 
  dropCourse, 
  getMyEnrollments,
  checkEnrollment 
} from '../controllers/enrollmentController.js';
import userAuth from '../middleware/userAuth.js';

const enrollmentRouter = express.Router();

// All enrollment routes require authentication
enrollmentRouter.use(userAuth);

// Enroll in a course
enrollmentRouter.post('/enroll', enrollInCourse);

// Get my enrolled courses
enrollmentRouter.get('/my-courses', getMyEnrollments);

// Check enrollment status for a specific course
enrollmentRouter.get('/check/:courseId', checkEnrollment);

// Drop a course
enrollmentRouter.delete('/drop/:courseId', dropCourse);

export default enrollmentRouter;
