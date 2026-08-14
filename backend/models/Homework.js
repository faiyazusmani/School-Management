const mongoose = require('mongoose');

const homeworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      required: true,
    },
    teacherName: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    totalPoints: {
      type: Number,
      default: 100,
    },
    description: {
      type: String,
    },
    attachments: [String],
  },
  { timestamps: true }
);

homeworkSchema.index({ className: 1, dueDate: 1 });
homeworkSchema.index({ subject: 1 });

module.exports = mongoose.model('Homework', homeworkSchema);
