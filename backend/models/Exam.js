const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    term: {
      type: String,
      enum: ['Mid-Term', 'Final', 'Quiz', 'Unit Test', 'Half Yearly', 'Half Yearly Examination', 'Term 1', 'Term 2', 'Annual', 'Quarterly'],
      default: 'Mid-Term',
    },
    subject: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      required: true,
    },
    examDate: {
      type: Date,
      required: true,
    },
    maxMarks: {
      type: Number,
      default: 100,
    },
    room: {
      type: String,
      default: 'Hall A',
    },
  },
  { timestamps: true }
);

examSchema.index({ className: 1, examDate: 1 });
examSchema.index({ subject: 1 });

module.exports = mongoose.model('Exam', examSchema);
