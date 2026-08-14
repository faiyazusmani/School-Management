const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const APIFeatures = require('../utils/apiFeatures');

// Helper to format student payload cleanly with linked User info
const formatStudentRecord = (st) => {
  if (!st) return null;
  const userObj = st.userId && typeof st.userId === 'object' ? st.userId : {};
  return {
    _id: st._id || st.id,
    id: st._id || st.id,
    userId: userObj._id || st.userId,
    name: st.name || userObj.name || '',
    email: st.email || userObj.email || '',
    avatar: userObj.avatar || st.avatar || '',
    rollNumber: st.rollNumber || '',
    admissionNumber: st.admissionNumber || '',
    gradeLevel: st.gradeLevel || '',
    section: st.section || '',
    dob: st.dob || '',
    gender: st.gender || '',
    bloodGroup: st.bloodGroup || '',
    phone: userObj.phone || st.phone || '',
    address: st.address || '',
    transportRoute: st.transportRoute || '',
    parentName: st.parentName || '',
    parentPhone: st.parentPhone || '',
    parentEmail: st.parentEmail || '',
    emergencyContact: st.emergencyContact || '',
    medicalNotes: st.medicalNotes || '',
    studentNotes: st.studentNotes || '',
    gpa: st.gpa || 0,
    attendanceRate: st.attendanceRate || 0,
    presentDays: st.presentDays || 0,
    absentDays: st.absentDays || 0,
    lateDays: st.lateDays || 0,
    leaveDays: st.leaveDays || 0,
    totalFees: st.totalFees || 0,
    paidFees: st.paidFees || 0,
    pendingFees: st.pendingFees || 0,
    status: st.status || 'active',
  };
};

// @desc    Get currently logged in student profile
// @route   GET /api/students/me
// @access  Private (student)
exports.getStudentMe = async (req, res, next) => {
  try {
    const student = await StudentProfile.findOne({ userId: req.user._id }).populate('userId', 'name email avatar phone status');
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }
    res.status(200).json({
      success: true,
      data: formatStudentRecord(student),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students with Search, Filter, Sort & Pagination
// @route   GET /api/students
// @access  Private (super_admin, teacher, parent, student)
exports.getStudents = async (req, res, next) => {
  try {
    const features = new APIFeatures(
      StudentProfile.find({ isDeleted: { $ne: true } }).populate('userId', 'name email avatar phone status'),
      req.query
    )
      .search(['rollNumber', 'admissionNumber', 'gradeLevel', 'section', 'name', 'email'])
      .filter()
      .sort()
      .paginate();

    const rawStudents = await features.query;
    const total = await StudentProfile.countDocuments({ isDeleted: { $ne: true } });

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const formatted = rawStudents.map(formatStudentRecord);

    res.status(200).json({
      success: true,
      count: formatted.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Single Student Profile
// @route   GET /api/students/:id
// @access  Private
exports.getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let student = null;

    if (id && id.length === 24) {
      student = await StudentProfile.findById(id).populate('userId', 'name email avatar phone status');
      if (!student) {
        student = await StudentProfile.findOne({ userId: id }).populate('userId', 'name email avatar phone status');
      }
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    // Role-based authorization check
    const userRole = req.user?.role;
    const userId = req.user?._id;

    if (userRole === 'student') {
      if (student.userId?._id?.toString() !== userId?.toString() && student.userId?.toString() !== userId?.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view your own profile.',
        });
      }
    } else if (userRole === 'parent') {
      const ParentProfile = require('../models/ParentProfile');
      const parent = await ParentProfile.findOne({ userId });
      if (!parent || !parent.children.some(childId => childId.toString() === student._id.toString())) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view profiles of your linked children.',
        });
      }
    } else if (userRole === 'teacher') {
      const TeacherProfile = require('../models/TeacherProfile');
      const teacher = await TeacherProfile.findOne({ userId });
      const studentClass = `${student.gradeLevel}-${student.section}`;
      if (!teacher || (!teacher.assignedClasses.includes(studentClass) && !teacher.assignedClasses.includes(student.gradeLevel))) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view profiles of students in your assigned classes.',
        });
      }
    }

    res.status(200).json({
      success: true,
      data: formatStudentRecord(student),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Student
// @route   POST /api/students
// @access  Private (super_admin)
exports.createStudent = async (req, res, next) => {
  try {
    const { name, email, rollNumber, gradeLevel, section, parentName, parentPhone, parentEmail } = req.body;

    const user = await User.create({
      name,
      email: email || `student_${Date.now()}@edumanage.com`,
      password: 'password123',
      role: 'student',
    });

    const profile = await StudentProfile.create({
      userId: user._id,
      name,
      email: user.email,
      rollNumber: rollNumber || `${Math.floor(Math.random() * 900 + 100)}`,
      admissionNumber: `ADM-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
      gradeLevel: gradeLevel || 'Grade 11',
      section: section || 'A',
      parentName: parentName || 'Parent Guardian',
      parentPhone: parentPhone || '+1 (555) 890-1234',
      parentEmail: parentEmail || 'parent@edumanage.com',
    });

    res.status(201).json({
      success: true,
      message: 'Student record created successfully',
      data: formatStudentRecord(await profile.populate('userId', 'name email avatar phone')),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Student
// @route   PUT /api/students/:id
// @access  Private (super_admin, teacher, student)
exports.updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userRole = req.user?.role || 'super_admin';
    const userId = req.user?._id;

    let updateData = { ...req.body };

    // Enforce student self-edit field restrictions
    if (userRole === 'student') {
      const student = await StudentProfile.findById(id);
      if (!student || (student.userId?.toString() !== userId?.toString())) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only update your own profile.',
        });
      }
      const allowed = ['phone', 'address', 'emergencyContact', 'medicalNotes', 'avatar'];
      const sanitized = {};
      allowed.forEach((field) => {
        if (updateData[field] !== undefined) sanitized[field] = updateData[field];
      });
      updateData = sanitized;
    } else if (userRole === 'teacher') {
      const student = await StudentProfile.findById(id);
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student profile not found.' });
      }
      const TeacherProfile = require('../models/TeacherProfile');
      const teacher = await TeacherProfile.findOne({ userId });
      const studentClass = `${student.gradeLevel}-${student.section}`;
      if (!teacher || (!teacher.assignedClasses.includes(studentClass) && !teacher.assignedClasses.includes(student.gradeLevel))) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only update students in your assigned classes.',
        });
      }
    } else if (userRole === 'parent') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Parents cannot update student profiles.',
      });
    }

    let updatedStudent = null;

    if (id && id.length === 24) {
      // Update StudentProfile
      updatedStudent = await StudentProfile.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).populate('userId', 'name email avatar phone status');

      // If not found by profile id, try finding by userId
      if (!updatedStudent) {
        updatedStudent = await StudentProfile.findOneAndUpdate({ userId: id }, updateData, {
          new: true,
          runValidators: true,
        }).populate('userId', 'name email avatar phone status');
      }

      // Synchronize name, email, phone, avatar back to the linked User document in MongoDB
      if (updatedStudent && updatedStudent.userId) {
        const userUpdates = {};
        if (updateData.name) userUpdates.name = updateData.name;
        if (updateData.email) userUpdates.email = updateData.email;
        if (updateData.phone) userUpdates.phone = updateData.phone;
        if (updateData.avatar) userUpdates.avatar = updateData.avatar;

        if (Object.keys(userUpdates).length > 0) {
          const targetUserId = updatedStudent.userId._id || updatedStudent.userId;
          await User.findByIdAndUpdate(targetUserId, userUpdates);
        }
      }
    }

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found to update',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student profile updated successfully',
      data: formatStudentRecord(updatedStudent),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Student (Soft Delete & Disable User)
// @route   DELETE /api/students/:id
// @access  Private (super_admin)
exports.deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id && id.length === 24) {
      const student = await StudentProfile.findById(id);
      if (student) {
        student.isDeleted = true;
        student.status = 'inactive';
        await student.save();

        if (student.userId) {
          await User.findByIdAndUpdate(student.userId, { status: 'inactive' });
        }
      } else {
        const fallbackUpdate = await StudentProfile.findOneAndUpdate({ userId: id }, { isDeleted: true, status: 'inactive' });
        if (!fallbackUpdate) {
          return res.status(404).json({
            success: false,
            message: 'Student profile not found to delete',
          });
        }
        await User.findByIdAndUpdate(id, { status: 'inactive' });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid Student ID format',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student record deleted successfully',
      id,
    });
  } catch (error) {
    next(error);
  }
};
