const express = require('express');
const {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getTimetable,
  createTimetableSlot,
} = require('../controllers/academicController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// Classes Routes
router.get('/classes', getClasses);
router.post('/classes', authorize('super_admin'), createClass);
router.put('/classes/:id', authorize('super_admin'), updateClass);
router.delete('/classes/:id', authorize('super_admin'), deleteClass);

// Subjects Routes
router.get('/subjects', getSubjects);
router.post('/subjects', authorize('super_admin'), createSubject);
router.put('/subjects/:id', authorize('super_admin'), updateSubject);
router.delete('/subjects/:id', authorize('super_admin'), deleteSubject);

// Timetable Routes
router.get('/timetable', getTimetable);
router.post('/timetable', authorize('super_admin', 'teacher'), createTimetableSlot);

module.exports = router;
