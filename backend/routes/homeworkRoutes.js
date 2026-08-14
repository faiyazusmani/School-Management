const express = require('express');
const {
  getHomework,
  createHomework,
  updateHomework,
  deleteHomework,
  getAttendance,
  getAttendanceAnalytics,
  markAttendance,
} = require('../controllers/homeworkController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// Homework Endpoints
router.route('/')
  .get(getHomework)
  .post(authorize('super_admin', 'teacher'), createHomework);

router.route('/:id')
  .put(authorize('super_admin', 'teacher'), updateHomework)
  .delete(authorize('super_admin', 'teacher'), deleteHomework);

// Attendance & Analytics Endpoints
router.get('/attendance/analytics', getAttendanceAnalytics);
router.route('/attendance')
  .get(getAttendance)
  .post(authorize('super_admin', 'teacher'), markAttendance);

module.exports = router;
