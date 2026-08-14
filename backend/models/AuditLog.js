const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    module: {
      type: String,
      required: true,
    },
    details: {
      type: String,
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
    status: {
      type: String,
      enum: ['Success', 'Failed', 'Warning'],
      default: 'Success',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
