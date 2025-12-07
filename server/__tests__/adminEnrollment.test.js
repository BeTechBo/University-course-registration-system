import request from 'supertest';
import app from '../server.js';
import sequelize from '../config/testDatabase.js';
import User from '../models/userModel.js';
import Course from '../models/courseModel.js';
import Enrollment from '../models/enrollmentModel.js';
import bcrypt from 'bcryptjs';

// Override models with test database
User.sequelize = sequelize;
Course.sequelize = sequelize;
Enrollment.sequelize = sequelize;

User.init(User.rawAttributes, { sequelize, tableName: 'users' });
Course.init(Course.rawAttributes, { sequelize, tableName: 'courses' });
Enrollment.init(Enrollment.rawAttributes, { sequelize, tableName: 'enrollments' });

// Re-establish associations
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

Enrollment.belongsTo(User, { foreignKey: 'userId', as: 'student' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

User.hasMany(Enrollment, { foreignKey: 'userId', as: 'enrollments' });
Course.hasMany(Enrollment, { foreignKey: 'courseId', as: 'enrollments' });

describe('Admin Enrollment Management', () => {
  let adminToken;
  let studentToken;
  let adminUser;
  let studentUser;
  let testCourse;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@aucegypt.edu',
      studentId: 'ADMIN001',
      department: 'Administration',
      yearLevel: 'Staff',
      password: hashedPassword,
      isAccountVerified: true,
      role: 'admin' // Add role field
    }, { hooks: false });

    // Create regular student
    studentUser = await User.create({
      name: 'Test Student',
      email: 'student@aucegypt.edu',
      studentId: '2021001',
      department: 'Computer Science',
      yearLevel: '2',
      password: hashedPassword,
      isAccountVerified: true,
      role: 'student'
    }, { hooks: false });

    // Login admin
    const adminLoginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@aucegypt.edu',
        password: 'admin123',
      });
    adminToken = adminLoginResponse.headers['set-cookie'];

    // Login student
    const studentLoginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'student@aucegypt.edu',
        password: 'admin123',
      });
    studentToken = studentLoginResponse.headers['set-cookie'];
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    testCourse = await Course.create({
      courseCode: 'CS101',
      courseName: 'Intro to CS',
      credits: 3,
      department: 'Computer Science',
      level: '100',
      maxCapacity: 30,
      currentEnrollment: 0,
      semester: 'Fall',
      year: 2025,
      isActive: true,
    });

    // Enroll student in course
    await Enrollment.create({
      userId: studentUser.id,
      courseId: testCourse.id,
      status: 'enrolled',
      enrolledAt: new Date()
    });
  });

  afterEach(async () => {
    await Enrollment.destroy({ where: {}, force: true });
    await Course.destroy({ where: {}, force: true });
  });

  describe('GET /api/admin/enrollments', () => {
    it('should get all enrollments (admin only)', async () => {
      const response = await request(app)
        .get('/api/admin/enrollments')
        .set('Cookie', adminToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.enrollments).toBeDefined();
      expect(response.body.enrollments.length).toBeGreaterThan(0);
    });

it('should reject non-admin users', async () => {
  const response = await request(app)
    .get('/api/admin/enrollments')
    .set('Cookie', studentToken);

  expect(response.status).toBe(403);
  // ✅ FIXED: Case-insensitive check or check for capital A
  expect(response.body.message).toContain('Admin'); // Changed from 'admin' to 'Admin'
});

  });

  describe('PUT /api/admin/enrollments/:enrollmentId/status', () => {
    it('should mark enrollment as completed', async () => {
      const enrollment = await Enrollment.findOne({
        where: { userId: studentUser.id, courseId: testCourse.id }
      });

      const response = await request(app)
        .put(`/api/admin/enrollments/${enrollment.id}/status`)
        .set('Cookie', adminToken)
        .send({ 
          status: 'completed',
          grade: 'A'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.enrollment.status).toBe('completed');
      expect(response.body.enrollment.grade).toBe('A');
    });

    it('should mark enrollment as failed', async () => {
      const enrollment = await Enrollment.findOne({
        where: { userId: studentUser.id, courseId: testCourse.id }
      });

      const response = await request(app)
        .put(`/api/admin/enrollments/${enrollment.id}/status`)
        .set('Cookie', adminToken)
        .send({ 
          status: 'failed',
          grade: 'F'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.enrollment.status).toBe('failed');
    });

    it('should reject invalid status', async () => {
      const enrollment = await Enrollment.findOne({
        where: { userId: studentUser.id, courseId: testCourse.id }
      });

      const response = await request(app)
        .put(`/api/admin/enrollments/${enrollment.id}/status`)
        .set('Cookie', adminToken)
        .send({ 
          status: 'invalid_status'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid status');
    });

    it('should reject non-admin users', async () => {
      const enrollment = await Enrollment.findOne({
        where: { userId: studentUser.id, courseId: testCourse.id }
      });

      const response = await request(app)
        .put(`/api/admin/enrollments/${enrollment.id}/status`)
        .set('Cookie', studentToken)
        .send({ status: 'completed' });

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/admin/students/:studentId/enrollments', () => {
    it('should get student enrollment history', async () => {
      const response = await request(app)
        .get(`/api/admin/students/${studentUser.id}/enrollments`)
        .set('Cookie', adminToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.enrollments).toBeDefined();
      expect(response.body.student).toBeDefined();
      expect(response.body.student.name).toBe('Test Student');
    });
  });

  describe('Prerequisites Integration Test', () => {
    it('should allow enrollment after prerequisite is completed', async () => {
      // Create CS201 that requires CS101
      const cs201 = await Course.create({
        courseCode: 'CS201',
        courseName: 'Data Structures',
        credits: 4,
        department: 'Computer Science',
        level: '200',
        prerequisites: 'CS101',
        maxCapacity: 30,
        currentEnrollment: 0,
        semester: 'Fall',
        year: 2025,
        isActive: true,
      });

      // Try to enroll in CS201 (should fail - CS101 not completed)
      let response = await request(app)
        .post('/api/enrollments/enroll')
        .set('Cookie', studentToken)
        .send({ courseId: cs201.id, userId: studentUser.id });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('prerequisite');

      // Admin marks CS101 as completed
      const cs101Enrollment = await Enrollment.findOne({
        where: { userId: studentUser.id, courseId: testCourse.id }
      });

      await request(app)
        .put(`/api/admin/enrollments/${cs101Enrollment.id}/status`)
        .set('Cookie', adminToken)
        .send({ status: 'completed', grade: 'A' });

      // Now try to enroll in CS201 (should succeed)
      response = await request(app)
        .post('/api/enrollments/enroll')
        .set('Cookie', studentToken)
        .send({ courseId: cs201.id, userId: studentUser.id });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });
});
