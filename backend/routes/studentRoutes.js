const express = require('express');
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentMe,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/me', getStudentMe);

router.route('/')
  .get(getStudents)
  .post(authorize('super_admin'), createStudent);

router.route('/:id')
  .get(getStudentById)
  .put(authorize('super_admin', 'teacher', 'student'), updateStudent)
  .delete(authorize('super_admin'), deleteStudent);

module.exports = router;
