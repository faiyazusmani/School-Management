const express = require('express');
const {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherMe,
} = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/me', getTeacherMe);

router.route('/')
  .get(getTeachers)
  .post(authorize('super_admin'), createTeacher);

router.route('/:id')
  .get(getTeacherById)
  .put(authorize('super_admin', 'teacher'), updateTeacher)
  .delete(authorize('super_admin'), deleteTeacher);

module.exports = router;
