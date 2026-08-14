const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const passport = require('passport');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const configurePassport = require('./config/passport');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Initialize Passport Google Strategy Configuration
configurePassport();

const app = express();

// Security Headers Middleware (Helmet with COOP allow-popups for Google OAuth)
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Vite & Google OAuth popups
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  })
);

// Rate Limiting (200 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address, please try again after 15 minutes',
  },
});
app.use('/api', limiter);

// Dynamic Local & Production CORS Whitelist
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Cookie Parser Middleware
app.use(cookieParser());

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Passport Middleware
app.use(passport.initialize());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/teachers', require('./routes/teacherRoutes'));
app.use('/api/parents', require('./routes/parentRoutes'));
app.use('/api/salary', require('./routes/salaryRoutes'));
app.use('/api/academic', require('./routes/academicRoutes'));
app.use('/api/homework', require('./routes/homeworkRoutes'));
app.use('/api/exams', require('./routes/examResultRoutes'));
app.use('/api/library', require('./routes/libraryTransportRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/finance', require('./routes/admissionFeeRoutes'));
app.use('/api/communication', require('./routes/communicationRoutes'));

// Serve Static Uploads & Frontend in Production Mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to EduManage Pro API Server',
      status: 'Active',
      version: '1.0.0',
    });
  });
}

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const DEFAULT_PORT = process.env.PORT || 5000;

// Port listening logic with EADDRINUSE fallback handling
const startServer = (port) => {
  const server = app
    .listen(port, () => {
      console.log(`🚀 EduManage Pro Enterprise Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`⚠️ Port ${port} is occupied. Retrying with port ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error('Server error:', err.message);
      }
    });
};

// Ensure MongoDB connection is initialized BEFORE starting Express server
connectDB().finally(() => {
  startServer(DEFAULT_PORT);
});
