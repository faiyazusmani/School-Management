const mongoose = require('mongoose');

const teacherProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    department: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      default: 'Senior Faculty',
    },
    qualification: {
      type: String,
      default: 'Ph.D. Quantum Physics (MIT)',
    },
    experienceYears: {
      type: Number,
      default: 12,
    },
    joiningDate: {
      type: String,
      default: '2018-08-15',
    },
    monthlySalary: {
      type: Number,
      default: 7500,
    },
    paidSalaryTotal: {
      type: Number,
      default: 60000,
    },
    pendingSalaryBalance: {
      type: Number,
      default: 0,
    },
    presentDays: {
      type: Number,
      default: 140,
    },
    absentDays: {
      type: Number,
      default: 2,
    },
    leaveDays: {
      type: Number,
      default: 3,
    },
    attendanceRate: {
      type: Number,
      default: 98.6,
    },
    subjects: [String],
    assignedClasses: [String],
    phone: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    emergencyContact: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

teacherProfileSchema.index({ userId: 1 });
teacherProfileSchema.index({ department: 1 });

module.exports = mongoose.model('TeacherProfile', teacherProfileSchema);
