const express = require('express');
const {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  getTransportRoutes,
  createTransportRoute,
  updateTransportRoute,
  deleteTransportRoute,
} = require('../controllers/libraryTransportController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// Books Endpoints
router.get('/books', getBooks);
router.post('/books', authorize('super_admin'), createBook);
router.put('/books/:id', authorize('super_admin'), updateBook);
router.delete('/books/:id', authorize('super_admin'), deleteBook);

// Transport Routes Endpoints
router.get('/transport', getTransportRoutes);
router.post('/transport', authorize('super_admin'), createTransportRoute);
router.put('/transport/:id', authorize('super_admin'), updateTransportRoute);
router.delete('/transport/:id', authorize('super_admin'), deleteTransportRoute);

module.exports = router;
