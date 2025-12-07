import request from 'supertest';
import app from '../server.js';
import sequelize from '../config/testDatabase.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

// Override the database connection for User model
User.sequelize = sequelize;
User.init(User.rawAttributes, { sequelize, tableName: 'users' });

describe('Authentication API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  afterEach(async () => {
    await User.destroy({ where: {}, truncate: true, cascade: true });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new student with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@aucegypt.edu',
          studentId: '2021001',
          department: 'Computer Science',
          yearLevel: '1',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.needsVerification).toBe(true);
    }, 15000);

    it('should reject registration with duplicate email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane@aucegypt.edu',
          studentId: '2021002',
          department: 'Mathematics',
          yearLevel: '2',
          password: 'password123',
        });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Smith',
          email: 'jane@aucegypt.edu',
          studentId: '2021003',
          department: 'Physics',
          yearLevel: '1',
          password: 'password456',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('already');
    }, 15000);

    it('should reject registration with duplicate student ID', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane1@aucegypt.edu',
          studentId: '2021005',
          department: 'Mathematics',
          yearLevel: '2',
          password: 'password123',
        });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Smith',
          email: 'john2@aucegypt.edu',
          studentId: '2021005',
          department: 'Physics',
          yearLevel: '1',
          password: 'password456',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('already');
    }, 15000);

    it('should reject registration with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Incomplete User',
          email: 'incomplete@aucegypt.edu',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('required');
    });

    it('should reject registration with invalid email domain', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@gmail.com',
          studentId: '2021010',
          department: 'Computer Science',
          yearLevel: '1',
          password: 'password123',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Hash password manually before creating user
      const hashedPassword = await bcrypt.hash('testpass123', 10);
      
      await User.create({
        name: 'Test User',
        email: 'test@aucegypt.edu',
        studentId: '2021010',
        department: 'Engineering',
        yearLevel: '3',
        password: hashedPassword,
        isAccountVerified: true,
      }, {
        hooks: false // Skip hooks since we already hashed
      });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@aucegypt.edu',
          password: 'testpass123',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.isVerified).toBe(true);
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should reject login with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@aucegypt.edu',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid');
    });

    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@aucegypt.edu',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid');
    });

    it('should reject login with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@aucegypt.edu',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Logout');
    });
  });
});
