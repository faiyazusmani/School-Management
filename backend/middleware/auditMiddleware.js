const AuditLog = require('../models/AuditLog');

const logActivity = async (req, action, module, details, status = 'Success') => {
  try {
    const userName = req.user?.name || 'System User';
    const userRole = req.user?.role || 'super_admin';
    const ipAddress = req.ip || req.connection.remoteAddress || '127.0.0.1';

    await AuditLog.create({
      userName,
      userRole,
      action,
      module,
      details,
      ipAddress,
      status,
    });
  } catch (err) {
    console.warn('Audit log creation skipped (demo mode):', err.message);
  }
};

module.exports = { logActivity };
