const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    capacity: {
      type: Number,
      default: 40,
    },
    roomNumber: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

sectionSchema.index({ class: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Section', sectionSchema);
