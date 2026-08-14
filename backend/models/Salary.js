const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    teacherName: {
      type: String,
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      default: 2026,
    },
    baseSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    allowances: {
      type: Number,
      default: 0,
      min: 0,
    },
    deductions: {
      type: Number,
      default: 0,
      min: 0,
    },
    netSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    pendingAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Paid', 'Partial', 'Pending'],
      default: 'Pending',
    },
    paymentDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

salarySchema.index({ employeeId: 1, month: 1, year: 1 });
salarySchema.index({ teacherId: 1 });

module.exports = mongoose.model('Salary', salarySchema);
