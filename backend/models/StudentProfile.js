const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    admissionNumber: {
      type: String,
      required: true,
      default: () => `ADM-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
    },
    rollNumber: {
      type: String,
      required: true,
      default: () => `${Math.floor(Math.random() * 900 + 100)}`,
    },
    gradeLevel: {
      type: String,
      default: 'Grade 11',
    },
    section: {
      type: String,
      default: 'A',
    },
    dob: {
      type: String,
      default: '2009-05-14',
    },
    gender: {
      type: String,
      default: 'Male',
    },
    bloodGroup: {
      type: String,
      default: 'O+',
    },
    // Detailed Contact & Onboarding Demographics
    fatherName: { type: String, default: '' },
    motherName: { type: String, default: '' },
    fatherMobile: { type: String, default: '' },
    fatherEmail: { type: String, default: '' },
    motherMobile: { type: String, default: '' },
    motherEmail: { type: String, default: '' },
    guardianName: { type: String, default: '' },
    guardianRelationship: { type: String, default: 'Father' },
    alternateMobile: { type: String, default: '' },
    city: { type: String, default: 'Silicon Valley' },
    state: { type: String, default: 'California' },
    pincode: { type: String, default: '94107' },
    previousSchool: { type: String, default: 'St. Xavier Academy' },
    admissionDate: { type: String, default: '2022-08-15' },
    address: {
      type: String,
      default: '124 Innovation Way, Silicon Valley, CA 94107',
    },
    parentName: {
      type: String,
      default: 'Guardian Name',
    },
    parentPhone: {
      type: String,
      default: '+1 (555) 890-1234',
    },
    parentEmail: {
      type: String,
      default: 'guardian@edumanage.com',
    },
    emergencyContact: {
      type: String,
      default: '+1 (555) 999-8877',
    },
    medicalNotes: {
      type: String,
      default: 'Fit for athletics.',
    },
    studentNotes: {
      type: String,
      default: 'Good academic standing.',
    },
    gpa: {
      type: Number,
      default: 3.88,
    },
    attendanceRate: {
      type: Number,
      default: 96.2,
    },
    presentDays: {
      type: Number,
      default: 140,
    },
    absentDays: {
      type: Number,
      default: 4,
    },
    lateDays: {
      type: Number,
      default: 2,
    },
    leaveDays: {
      type: Number,
      default: 2,
    },
    totalFees: {
      type: Number,
      default: 4850,
    },
    paidFees: {
      type: Number,
      default: 4850,
    },
    pendingFees: {
      type: Number,
      default: 0,
    },
    transportRoute: {
      type: String,
      default: 'Route R-101 (North Metro)',
    },
    parentUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'graduated'],
      default: 'active',
    },
  },
  { timestamps: true }
);

studentProfileSchema.index({ userId: 1 });
studentProfileSchema.index({ gradeLevel: 1, section: 1 });
studentProfileSchema.index({ isDeleted: 1 });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
