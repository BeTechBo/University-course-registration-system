import express from 'express';
import { 
  enrollInCourse, 
  dropCourse, 
  getMyEnrollments,
  checkEnrollment,
  getCurrentCredits  // ✅ ADD THIS

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

enrollmentRouter.get('/current-credits', userAuth, getCurrentCredits); 


export default enrollmentRouter;
