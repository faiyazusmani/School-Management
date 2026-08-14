const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
    },
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      required: true,
    },
    period: {
      type: Number,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    teacherName: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      default: 'Room 101',
    },
  },
  { timestamps: true }
);

timetableSchema.index({ className: 1, day: 1, period: 1 });
timetableSchema.index({ teacherName: 1 });

module.exports = mongoose.model('Timetable', timetableSchema);
