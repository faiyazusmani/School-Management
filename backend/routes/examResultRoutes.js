const express = require('express');
const {
  getExams,
  createExam,
  updateExam,
  deleteExam,
  getResults,
  createResult,
  updateResult,
  deleteResult,
} = require('../controllers/examResultController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// Exams Endpoints
router.get('/exams', getExams);
router.post('/exams', authorize('super_admin', 'teacher'), createExam);
router.put('/exams/:id', authorize('super_admin', 'teacher'), updateExam);
router.delete('/exams/:id', authorize('super_admin'), deleteExam);

// Results Endpoints
router.get('/results', getResults);
router.post('/results', authorize('super_admin', 'teacher'), createResult);
router.put('/results/:id', authorize('super_admin', 'teacher'), updateResult);
router.delete('/results/:id', authorize('super_admin'), deleteResult);

module.exports = router;
