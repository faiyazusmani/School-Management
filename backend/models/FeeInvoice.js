const mongoose = require('mongoose');

const feeInvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentProfile',
      default: null,
    },
    studentName: {
      type: String,
      required: true,
    },
    rollNumber: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    feeType: {
      type: String,
      enum: ['Tuition Fee', 'Admission Fee', 'Exam Fee', 'Transport Fee', 'Library Fee', 'Hostel Fee', 'Other'],
      default: 'Tuition Fee',
    },
    academicYear: {
      type: String,
      default: '2026-2027',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    paymentDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Overdue', 'Partially Paid'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      default: 'Online Gateway',
    },
  },
  { timestamps: true }
);

feeInvoiceSchema.index({ rollNumber: 1 });
feeInvoiceSchema.index({ status: 1 });

module.exports = mongoose.model('FeeInvoice', feeInvoiceSchema);
