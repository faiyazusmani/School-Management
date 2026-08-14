const Homework = require('../models/Homework');
const Attendance = require('../models/Attendance');
const StudentProfile = require('../models/StudentProfile');
const APIFeatures = require('../utils/apiFeatures');

// --- HOMEWORK CONTROLLERS ---

exports.getHomework = async (req, res, next) => {
  try {
    const features = new APIFeatures(Homework.find(), req.query)
      .search(['title', 'subject', 'className', 'teacherName'])
      .filter()
      .sort()
      .paginate();

    const homeworkList = await features.query;
    const total = await Homework.countDocuments();

    res.status(200).json({ success: true, count: homeworkList.length, total, data: homeworkList });
  } catch (error) {
    next(error);
  }
};

exports.createHomework = async (req, res, next) => {
  try {
    const { title, subject, className, dueDate, totalPoints, description } = req.body;
    const newHw = await Homework.create({
      title,
      subject,
      className,
      teacherName: req.user?.name || 'Faculty Teacher',
      dueDate,
      totalPoints: totalPoints || 100,
      description,
    });
    res.status(201).json({ success: true, message: 'Homework assigned', data: newHw });
  } catch (error) {
    next(error);
  }
};

exports.updateHomework = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Homework.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Homework assignment not found' });
    }
    res.status(200).json({ success: true, message: 'Homework updated', data: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteHomework = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Homework.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Homework not found' });
    }
    res.status(200).json({ success: true, message: 'Homework assignment deleted', id });
  } catch (error) {
    next(error);
  }
};

// --- ATTENDANCE CONTROLLERS & ANALYTICS ENGINE ---

exports.getAttendanceAnalytics = async (req, res, next) => {
  try {
    const userRole = req.user?.role || 'super_admin';
    const userId = req.user?._id;
    const userType = req.query.userType || (userRole === 'teacher' ? 'teacher' : 'student');

    let matchQuery = { userType };

    if (userRole === 'student') {
      matchQuery.userId = userId;
    } else if (userRole === 'parent') {
      matchQuery.studentName = req.query.studentName || '';
    } else if (userRole === 'teacher' && req.query.ownOnly === 'true') {
      matchQuery.userId = userId;
    }

    const records = await Attendance.find(matchQuery).sort({ date: -1 });

    const totalPresent = records.filter((r) => r.status === 'Present').length;
    const totalAbsent = records.filter((r) => r.status === 'Absent').length;
    const totalLate = records.filter((r) => r.status === 'Late').length;
    const totalLeave = records.filter((r) => r.status === 'Leave').length;
    const totalDays = records.length || 1;

    const attendancePercentage = Number((((totalPresent + totalLate) / totalDays) * 100).toFixed(1));

    const monthlyTrend = [
      { name: 'Jan', Present: totalPresent, Absent: totalAbsent, Late: totalLate, Leave: totalLeave, Percentage: attendancePercentage }
    ];

    const statusDistribution = [
      { name: 'Present', value: totalPresent, color: '#10B981' },
      { name: 'Absent', value: totalAbsent, color: '#EF4444' },
      { name: 'Late', value: totalLate, color: '#F59E0B' },
      { name: 'Leave', value: totalLeave, color: '#6366F1' },
    ];

    res.status(200).json({
      success: true,
      role: userRole,
      metrics: {
        totalPresent,
        totalAbsent,
        totalLate,
        totalLeave,
        totalDays,
        attendancePercentage,
      },
      charts: {
        monthlyTrend,
        statusDistribution,
      },
      recentLogs: records.slice(0, 10),
    });
  } catch (error) {
    next(error);
  }
};

exports.getAttendance = async (req, res, next) => {
  try {
    const features = new APIFeatures(Attendance.find(), req.query)
      .search(['studentName', 'rollNumber', 'className', 'status'])
      .filter()
      .sort()
      .paginate();
    const attendance = await features.query;
    res.status(200).json({ success: true, count: attendance.length, data: attendance });
  } catch (error) {
    next(error);
  }
};

exports.markAttendance = async (req, res, next) => {
  try {
    const { userId, studentName, rollNumber, className, status, date, userType, remarks } = req.body;
    
    let targetUserId = userId;
    if (!targetUserId && rollNumber) {
      const student = await StudentProfile.findOne({ rollNumber });
      if (student) targetUserId = student.userId;
    }
    if (!targetUserId) {
      targetUserId = req.user._id;
    }

    const attRecord = await Attendance.create({
      userId: targetUserId,
      userType: userType || 'student',
      studentName: studentName || 'Student',
      rollNumber: rollNumber || '',
      className: className || 'Grade 11-A',
      date: date || new Date(),
      status: status || 'Present',
      remarks: remarks || '',
      markedBy: req.user?.name || 'Faculty Teacher',
    });

    // Update StudentProfile stats dynamically
    if (userType !== 'teacher' && rollNumber) {
      const student = await StudentProfile.findOne({ rollNumber });
      if (student) {
        if (status === 'Present') student.presentDays = (student.presentDays || 0) + 1;
        else if (status === 'Absent') student.absentDays = (student.absentDays || 0) + 1;
        else if (status === 'Late') student.lateDays = (student.lateDays || 0) + 1;
        else if (status === 'Leave') student.leaveDays = (student.leaveDays || 0) + 1;

        const total = (student.presentDays || 0) + (student.absentDays || 0) + (student.lateDays || 0) + (student.leaveDays || 0);
        if (total > 0) {
          student.attendanceRate = Number((((student.presentDays + student.lateDays) / total) * 100).toFixed(1));
        }
        await student.save();
      }
    }

    res.status(201).json({ success: true, message: 'Attendance recorded successfully', data: attRecord });
  } catch (error) {
    next(error);
  }
};
