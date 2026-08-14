const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Subject code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    credits: {
      type: Number,
      default: 3,
      min: 1,
      max: 6,
    },
    type: {
      type: String,
      enum: ['Core', 'Elective', 'Lab'],
      default: 'Core',
    },
  },
  { timestamps: true }
);

subjectSchema.index({ department: 1 });

module.exports = mongoose.model('Subject', subjectSchema);
