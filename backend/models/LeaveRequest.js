const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema(
  {
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    applicantName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['teacher', 'student', 'staff'],
      required: true,
    },
    leaveType: {
      type: String,
      enum: ['Medical', 'Personal', 'Casual', 'Academic'],
      default: 'Personal',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

leaveRequestSchema.index({ applicantId: 1 });
leaveRequestSchema.index({ status: 1 });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
