const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Class name is required'],
      trim: true,
      unique: true,
    },
    gradeLevel: {
      type: String,
      required: [true, 'Grade level is required'],
      trim: true,
    },
    sections: [
      {
        type: String,
        default: 'A',
      },
    ],
    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    roomNumber: {
      type: String,
      default: '101',
    },
    capacity: {
      type: Number,
      default: 40,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

classSchema.index({ gradeLevel: 1 });

module.exports = mongoose.model('Class', classSchema);
