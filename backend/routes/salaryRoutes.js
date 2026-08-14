const express = require('express');
const { getSalaries, createSalary, updateSalary, deleteSalary } = require('../controllers/salaryController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getSalaries)
  .post(authorize('super_admin'), createSalary);

router.route('/:id')
  .put(authorize('super_admin'), updateSalary)
  .delete(authorize('super_admin'), deleteSalary);

module.exports = router;
