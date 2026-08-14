const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    rollNumber: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    marksObtained: {
      type: Number,
      required: true,
      min: 0,
    },
    maxMarks: {
      type: Number,
      default: 100,
    },
    grade: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
      default: 'Good performance',
    },
  },
  { timestamps: true }
);

resultSchema.index({ studentId: 1, examId: 1 });
resultSchema.index({ rollNumber: 1 });

module.exports = mongoose.model('Result', resultSchema);
