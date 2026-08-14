const express = require('express');
const {
  getAdmissions,
  updateAdmissionStatus,
  getFeeInvoices,
  createFeeInvoice,
  updateFeeInvoice,
  deleteFeeInvoice,
  recordPayment,
} = require('../controllers/admissionFeeController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// Admission Endpoints
router.get('/admissions', getAdmissions);
router.put('/admissions/:id', authorize('super_admin'), updateAdmissionStatus);

// Fee Invoices Endpoints
router.get('/fees', getFeeInvoices);
router.post('/fees', authorize('super_admin'), createFeeInvoice);
router.put('/fees/:id', authorize('super_admin'), updateFeeInvoice);
router.delete('/fees/:id', authorize('super_admin'), deleteFeeInvoice);
router.post('/fees/pay/:id', recordPayment);

module.exports = router;
