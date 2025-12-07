import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import courseRouter from './routes/courseRoutes.js';
import enrollmentRouter from './routes/enrollmentRoutes.js';
import sequelize from './config/database.js';
import adminRouter from './routes/adminRoutes.js'; // ✅ ADD THIS

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize database and associations
const initializeDatabase = async () => {
  try {
    // Don't alter database in test environment
    if (process.env.NODE_ENV !== 'test') {
      await sequelize.sync({ alter: true });
      console.log('Database initialized successfully');
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
};

// Initialize on startup (but not during tests)
if (process.env.NODE_ENV !== 'test') {
  initializeDatabase();
}

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173'];

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Routes
app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/courses', courseRouter);
app.use('/api/enrollments', enrollmentRouter);
app.use('/api/admin', adminRouter); // ✅ ADD THIS

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
