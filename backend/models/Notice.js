const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Academic', 'Event', 'Urgent', 'General', 'Examination', 'Holiday', 'Fee', 'Emergency'],
      default: 'General',
    },
    noticeType: {
      type: String,
      enum: ['General', 'Academic', 'Examination', 'Holiday', 'Fee', 'Emergency'],
      default: 'General',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Unpublished'],
      default: 'Published',
    },
    targetAudience: [
      {
        type: String,
        enum: ['super_admin', 'teacher', 'student', 'parent', 'all'],
      },
    ],
    postedBy: {
      type: String,
      default: 'School Administration',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

noticeSchema.index({ date: -1 });
noticeSchema.index({ category: 1 });

module.exports = mongoose.model('Notice', noticeSchema);
