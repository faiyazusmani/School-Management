const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    senderName: {
      type: String,
      required: true,
    },
    senderRole: {
      type: String,
      required: true,
    },
    receiverName: {
      type: String,
      required: true,
    },
    receiverRole: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
