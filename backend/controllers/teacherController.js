const User = require('../models/User');
const TeacherProfile = require('../models/TeacherProfile');
const APIFeatures = require('../utils/apiFeatures');



const formatTeacherRecord = (tc) => {
  if (!tc) return null;
  const u = tc.userId || {};
  return {
    _id: tc._id || tc.id,
    id: tc._id || tc.id,
    userId: u._id || null,
    name: u.name || 'Faculty Member',
    email: u.email || '',
    phone: tc.phone || u.phone || '',
    avatar: u.avatar || '',
    status: u.status || 'active',
    employeeId: tc.employeeId || '',
    department: tc.department || '',
    designation: tc.designation || '',
    qualification: tc.qualification || '',
    experienceYears: tc.experienceYears || 0,
    joiningDate: tc.joiningDate || '',
    monthlySalary: tc.monthlySalary || 0,
    paidSalaryTotal: tc.paidSalaryTotal || 0,
    pendingSalaryBalance: tc.pendingSalaryBalance || 0,
    presentDays: tc.presentDays || 0,
    absentDays: tc.absentDays || 0,
    leaveDays: tc.leaveDays || 0,
    attendanceRate: tc.attendanceRate || 100,
    subjects: tc.subjects || [],
    assignedClasses: tc.assignedClasses || [],
    address: tc.address || '',
    emergencyContact: tc.emergencyContact || '',
  };
};

// @desc    Get currently logged in teacher profile
// @route   GET /api/teachers/me
// @access  Private (teacher)
exports.getTeacherMe = async (req, res, next) => {
  try {
    const teacher = await TeacherProfile.findOne({ userId: req.user._id }).populate('userId', 'name email avatar phone status');
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher profile not found',
      });
    }
    res.status(200).json({
      success: true,
      data: formatTeacherRecord(teacher),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all teachers with Search, Filter & Pagination
// @route   GET /api/teachers
// @access  Private (super_admin, teacher)
exports.getTeachers = async (req, res, next) => {
  try {
    const features = new APIFeatures(TeacherProfile.find().populate('userId', 'name email avatar phone status'), req.query)
      .search(['employeeId', 'department', 'designation'])
      .filter()
      .sort()
      .paginate();

    const teachers = await features.query;
    const total = await TeacherProfile.countDocuments();

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const formatted = teachers.map(formatTeacherRecord);

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

// @desc    Get Single Teacher Profile
// @route   GET /api/teachers/:id
// @access  Private
exports.getTeacherById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let teacher = null;

    if (id && id.length === 24) {
      teacher = await TeacherProfile.findById(id).populate('userId', 'name email avatar phone status');
      if (!teacher) {
        teacher = await TeacherProfile.findOne({ userId: id }).populate('userId', 'name email avatar phone status');
      }
    }

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher profile not found',
      });
    }

    // Role-based authorization check
    const userRole = req.user?.role;
    const userId = req.user?._id;

    if (userRole === 'teacher') {
      if (teacher.userId?._id?.toString() !== userId?.toString() && teacher.userId?.toString() !== userId?.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You cannot view private information of unrelated teachers.',
        });
      }
    } else if (userRole === 'student' || userRole === 'parent') {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }

    res.status(200).json({
      success: true,
      data: formatTeacherRecord(teacher),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Teacher
// @route   POST /api/teachers
// @access  Private (super_admin)
exports.createTeacher = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      qualification,
      experienceYears,
      joiningDate,
      employeeId,
      department,
      designation,
      assignedClasses,
      subjects,
      address,
      emergencyContact,
      avatar,
      status,
      monthlySalary,
      paidSalaryTotal,
    } = req.body;

    const user = await User.create({
      name,
      email: email || `teacher_${Date.now()}@edumanage.com`,
      password: 'password123',
      role: 'teacher',
      phone: phone || '',
      avatar: avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      status: status || 'active',
    });

    const newTeacher = await TeacherProfile.create({
      userId: user._id,
      employeeId: employeeId || `EMP-00${Math.floor(Math.random() * 90 + 10)}`,
      department: department || 'General Studies',
      designation: designation || 'Faculty',
      qualification: qualification || 'M.Sc.',
      experienceYears: experienceYears || 0,
      joiningDate: joiningDate || new Date().toISOString().split('T')[0],
      assignedClasses: assignedClasses || [],
      subjects: subjects || [],
      address: address || '',
      emergencyContact: emergencyContact || '',
      monthlySalary: monthlySalary || 7000,
      paidSalaryTotal: paidSalaryTotal || 0,
      pendingSalaryBalance: 0,
      phone: phone || '',
    });

    const result = await TeacherProfile.findById(newTeacher._id).populate('userId', 'name email avatar phone status');

    res.status(201).json({
      success: true,
      message: 'Teacher record created successfully',
      data: formatTeacherRecord(result),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Teacher
// @route   PUT /api/teachers/:id
// @access  Private (super_admin)
exports.updateTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    let teacher = null;

    if (id && id.length === 24) {
      teacher = await TeacherProfile.findById(id);
      if (!teacher) {
        teacher = await TeacherProfile.findOne({ userId: id });
      }
    }

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher profile not found to update',
      });
    }

    // Role-based authorization check
    const userRole = req.user?.role || 'super_admin';
    const userId = req.user?._id;

    if (userRole === 'teacher') {
      if (teacher.userId?.toString() !== userId?.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only update your own profile.',
        });
      }
      // Teachers cannot change salary, classes/subjects or status or employeeId
      const forbidden = ['monthlySalary', 'paidSalaryTotal', 'pendingSalaryBalance', 'employeeId', 'status', 'assignedClasses', 'subjects'];
      forbidden.forEach(field => {
        if (req.body[field] !== undefined) {
          delete req.body[field];
        }
      });
    }

    // Update teacher profile
    const profileFields = [
      'employeeId', 'department', 'designation', 'qualification', 'experienceYears',
      'joiningDate', 'monthlySalary', 'paidSalaryTotal', 'pendingSalaryBalance',
      'presentDays', 'absentDays', 'leaveDays', 'attendanceRate',
      'subjects', 'assignedClasses', 'phone', 'address', 'emergencyContact'
    ];

    profileFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        teacher[field] = req.body[field];
      }
    });

    await teacher.save();

    // Update linked user fields
    if (teacher.userId) {
      const userUpdates = {};
      if (req.body.name !== undefined) userUpdates.name = req.body.name;
      if (req.body.email !== undefined) userUpdates.email = req.body.email;
      if (req.body.phone !== undefined) userUpdates.phone = req.body.phone;
      if (req.body.avatar !== undefined) userUpdates.avatar = req.body.avatar;
      if (req.body.status !== undefined) userUpdates.status = req.body.status;

      if (Object.keys(userUpdates).length > 0) {
        await User.findByIdAndUpdate(teacher.userId, userUpdates);
      }
    }

    const result = await TeacherProfile.findById(teacher._id).populate('userId', 'name email avatar phone status');

    res.status(200).json({
      success: true,
      message: 'Teacher profile updated successfully',
      data: formatTeacherRecord(result),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Teacher
// @route   DELETE /api/teachers/:id
// @access  Private (super_admin)
exports.deleteTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deleted = false;

    if (id && id.length === 24) {
      const teacher = await TeacherProfile.findById(id);
      if (teacher) {
        deleted = true;
        if (teacher.userId) {
          await User.findByIdAndUpdate(teacher.userId, { status: 'inactive' });
        }
        await TeacherProfile.findByIdAndDelete(id);
      } else {
        const teacherByUserId = await TeacherProfile.findOne({ userId: id });
        if (teacherByUserId) {
          deleted = true;
          await User.findByIdAndUpdate(id, { status: 'inactive' });
          await TeacherProfile.findByIdAndDelete(teacherByUserId._id);
        }
      }
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Teacher profile not found to delete',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Teacher record deleted successfully',
      id,
    });
  } catch (error) {
    next(error);
  }
};
