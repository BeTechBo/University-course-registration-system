import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js'; // Assuming you have a user router
import courseRouter from './routes/courseRoutes.js';
import enrollmentRouter from './routes/enrollmentRoutes.js';
import sequelize from './config/database.js';


const app = express();

// Serve static files from uploads directory
const PORT = process.env.PORT || 4000;




// Initialize database and associations
const initializeDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // Use { force: true } for development to reset tables

    
    console.log('Access control database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize access control database:', error);
  }
};

// Initialize on startup
initializeDatabase();

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173'];


app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true }));
//allow cross-origin requests from the frontend

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter); // Use the user router for user-related routes
app.use('/api/courses', courseRouter);
app.use('/api/enrollments', enrollmentRouter);




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});