import express from 'express';
import {
  getAllEnrollments,
  updateEnrollmentStatus,
  getStudentEnrollments,
  getAllStudents,
  bulkUpdateEnrollments
} from '../controllers/adminController.js';
import { userAuth } from '../middleware/userAuth.js';
import { adminAuth } from '../middleware/adminAuth.js';

const adminRouter = express.Router();

// Protect all admin routes
adminRouter.use(userAuth, adminAuth);

// Enrollment management
adminRouter.get('/enrollments', getAllEnrollments);
adminRouter.put('/enrollments/:enrollmentId/status', updateEnrollmentStatus);
adminRouter.post('/enrollments/bulk-update', bulkUpdateEnrollments);

// Student management
adminRouter.get('/students', getAllStudents);
adminRouter.get('/students/:studentId/enrollments', getStudentEnrollments);

export default adminRouter;
