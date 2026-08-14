const mongoose = require('mongoose');

const parentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    parentId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentProfile',
      },
    ],
    relationship: {
      type: String,
      enum: ['father', 'mother', 'guardian'],
      default: 'father',
    },
    occupation: {
      type: String,
      default: 'Business',
    },
    income: {
      type: String,
      default: '$50,000 - $100,000',
    },
    alternatePhone: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    emergencyContact: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

parentProfileSchema.index({ userId: 1 });

module.exports = mongoose.model('ParentProfile', parentProfileSchema);
