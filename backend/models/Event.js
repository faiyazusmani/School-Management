const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Academic', 'Sports', 'Cultural', 'Holiday', 'Workshop'],
      default: 'Academic',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      default: 'Main Campus Auditorium',
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

eventSchema.index({ startDate: 1 });
eventSchema.index({ category: 1 });

module.exports = mongoose.model('Event', eventSchema);
