const mongoose = require('mongoose');

const libraryBookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'General Academic',
    },
    publisher: {
      type: String,
      default: 'Academic Publishing House',
    },
    publishedYear: {
      type: Number,
      default: 2024,
    },
    copiesTotal: {
      type: Number,
      default: 10,
      min: 0,
    },
    copiesAvailable: {
      type: Number,
      default: 8,
      min: 0,
    },
    shelfLocation: {
      type: String,
      default: 'Bay 3 - A',
    },
    status: {
      type: String,
      enum: ['Available', 'Low Stock', 'Out of Stock'],
      default: 'Available',
    },
  },
  { timestamps: true }
);

libraryBookSchema.index({ title: 1 });
libraryBookSchema.index({ category: 1 });

module.exports = mongoose.model('LibraryBook', libraryBookSchema);
