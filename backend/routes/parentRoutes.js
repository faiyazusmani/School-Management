const express = require('express');
const { getParents, createParent, updateParent, deleteParent, getParentMe, getParentById } = require('../controllers/parentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/me', getParentMe);

router.route('/')
  .get(getParents)
  .post(authorize('super_admin'), createParent);

router.route('/:id')
  .get(getParentById)
  .put(authorize('super_admin', 'parent'), updateParent)
  .delete(authorize('super_admin'), deleteParent);

module.exports = router;
