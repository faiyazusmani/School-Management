const express = require('express');
const {
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getLeaveRequests,
  createLeaveRequest,
  updateLeaveStatus,
} = require('../controllers/communicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// Notices Endpoints
router.get('/notices', getNotices);
router.post('/notices', authorize('super_admin'), createNotice);
router.put('/notices/:id', authorize('super_admin'), updateNotice);
router.delete('/notices/:id', authorize('super_admin'), deleteNotice);

// Events Endpoints
router.get('/events', getEvents);
router.post('/events', authorize('super_admin'), createEvent);
router.put('/events/:id', authorize('super_admin'), updateEvent);
router.delete('/events/:id', authorize('super_admin'), deleteEvent);

// Leave Requests Endpoints
router.get('/leaves', getLeaveRequests);
router.post('/leaves', createLeaveRequest);
router.put('/leaves/:id', authorize('super_admin', 'teacher'), updateLeaveStatus);

module.exports = router;
