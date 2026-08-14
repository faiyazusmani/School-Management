const mongoose = require('mongoose');

const adminProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    adminId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    department: {
      type: String,
      default: 'Administration',
    },
    accessLevel: {
      type: String,
      enum: ['full', 'manager', 'editor'],
      default: 'full',
    },
  },
  {
    timestamps: true,
  }
);

adminProfileSchema.index({ adminId: 1 });

module.exports = mongoose.model('AdminProfile', adminProfileSchema);
