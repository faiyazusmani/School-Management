const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userType: {
      type: String,
      enum: ['student', 'teacher'],
      default: 'student',
    },
    studentName: {
      type: String,
      required: true,
    },
    rollNumber: {
      type: String,
      default: '',
    },
    className: {
      type: String,
      default: 'Grade 11-A',
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late', 'Leave'],
      required: true,
      default: 'Present',
    },
    remarks: {
      type: String,
      default: '',
    },
    markedBy: {
      type: String,
      default: 'System Admin',
    },
  },
  { timestamps: true }
);

attendanceSchema.index({ userId: 1, date: 1 });
attendanceSchema.index({ className: 1, date: 1 });
attendanceSchema.index({ userType: 1, status: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
