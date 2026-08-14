const mongoose = require('mongoose');

const admissionRequestSchema = new mongoose.Schema(
  {
    applicantName: {
      type: String,
      required: true,
    },
    parentName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    appliedGrade: {
      type: String,
      required: true,
    },
    previousSchool: {
      type: String,
      default: 'N/A',
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Under Review'],
      default: 'Pending',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdmissionRequest', admissionRequestSchema);
