const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const TeacherProfile = require('../models/TeacherProfile');
const ParentProfile = require('../models/ParentProfile');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');
const FeeInvoice = require('../models/FeeInvoice');
const Homework = require('../models/Homework');
const Result = require('../models/Result');
const Notice = require('../models/Notice');
const Timetable = require('../models/Timetable');

// @desc    Get Role Specific Dashboard Data
// @route   GET /api/dashboard/data
// @access  Private
exports.getDashboardData = async (req, res, next) => {
  try {
    const role = req.user?.role || 'guest';
    const userId = req.user?._id;

    let data = {};

    switch (role) {
      case 'super_admin': {
        const totalStudents = await StudentProfile.countDocuments({ isDeleted: { $ne: true } });
        const totalTeachers = await TeacherProfile.countDocuments();
        const totalParents = await ParentProfile.countDocuments();
        const activeClasses = await Class.countDocuments();
        const totalSubjects = await Subject.countDocuments();

        const paidInvoices = await FeeInvoice.find({ status: 'Paid' });
        const monthlyRevenue = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);

        // Calculate enrollment trend from student profiles
        const studentsList = await StudentProfile.find({ isDeleted: { $ne: true } });
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const trendMap = {};
        months.forEach(m => { trendMap[m] = 0; });
        studentsList.forEach(st => {
          if (st.createdAt) {
            const mName = months[new Date(st.createdAt).getMonth()];
            trendMap[mName]++;
          }
        });
        let cumulative = 0;
        const enrollmentTrend = months.map(m => {
          cumulative += trendMap[m];
          return { month: m, students: cumulative, revenue: cumulative * 150 };
        });

        // Pull real recent users from MongoDB
        const recentUsersRaw = await User.find().sort({ createdAt: -1 }).limit(5);
        const recentUsers = recentUsersRaw.map(u => ({
          id: u._id,
          name: u.name,
          role: u.role.charAt(0).toUpperCase() + u.role.slice(1),
          email: u.email,
          date: u.createdAt ? u.createdAt.toISOString().split('T')[0] : '',
          status: u.status === 'active' ? 'Active' : 'Inactive',
        }));

        // Pull real notices from MongoDB
        const noticesRaw = await Notice.find({ targetAudience: 'all' }).sort({ date: -1 }).limit(3);
        const notices = noticesRaw.map(n => ({
          id: n._id,
          title: n.title,
          category: n.category || 'General',
          date: n.date ? n.date.toISOString().split('T')[0] : '',
          priority: 'Normal',
        }));

        data = {
          role: 'super_admin',
          stats: {
            totalStudents,
            totalTeachers,
            totalParents,
            activeClasses,
            monthlyRevenue,
            systemUptime: '99.98%',
          },
          enrollmentTrend,
          recentUsers,
          notices,
        };
        break;
      }

      case 'student': {
        const studentProfile = await StudentProfile.findOne({ userId }).populate('userId', 'name email avatar phone status');
        if (!studentProfile) {
          return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        // Real results from MongoDB
        const resultsRaw = await Result.find({ studentId: userId });
        const courses = resultsRaw.map((resItem, idx) => ({
          id: resItem._id,
          code: `SUB-0${idx + 1}`,
          name: resItem.subject,
          teacher: 'Faculty Teacher',
          grade: resItem.grade,
          score: resItem.marksObtained,
          progress: 100,
        }));

        // Real homework from MongoDB
        const homeworksRaw = await Homework.find({ className: `${studentProfile.gradeLevel}-${studentProfile.section}` });
        const assignments = homeworksRaw.map(hw => ({
          id: hw._id,
          title: hw.title,
          subject: hw.subject,
          due: hw.dueDate ? hw.dueDate.toISOString().split('T')[0] : 'No due date',
          status: 'Pending',
        }));

        // Real attendance logs
        const attendanceLogs = await Attendance.find({ userId }).sort({ date: -1 });

        data = {
          role: 'student',
          profile: studentProfile,
          stats: {
            overallGPA: studentProfile.gpa || 0,
            attendancePercentage: `${studentProfile.attendanceRate || 0}%`,
            presentDays: studentProfile.presentDays || 0,
            absentDays: studentProfile.absentDays || 0,
            lateDays: studentProfile.lateDays || 0,
            leaveDays: studentProfile.leaveDays || 0,
            totalFees: studentProfile.totalFees || 0,
            paidFees: studentProfile.paidFees || 0,
            pendingFees: studentProfile.pendingFees || 0,
            admissionNumber: studentProfile.admissionNumber,
            transportRoute: studentProfile.transportRoute,
          },
          courses,
          assignments,
          attendanceLogs,
        };
        break;
      }

      case 'teacher': {
        const teacherProfile = await TeacherProfile.findOne({ userId }).populate('userId', 'name email avatar phone status');
        if (!teacherProfile) {
          return res.status(404).json({ success: false, message: 'Teacher profile not found' });
        }

        // Count assigned classes
        const classesCount = teacherProfile.assignedClasses ? teacherProfile.assignedClasses.length : 0;
        
        // Count total students taught (who belong to classes assigned to teacher)
        const studentsCount = await StudentProfile.countDocuments({
          isDeleted: { $ne: true },
          gradeLevel: { $in: teacherProfile.assignedClasses || [] }
        });

        // Get schedules/timetables
        const scheduleRaw = await Timetable.find({ classTeacher: userId });
        const todaySchedule = scheduleRaw.map(sc => ({
          id: sc._id,
          time: sc.timeSlot || '09:00 AM - 10:15 AM',
          subject: sc.subjectName || 'Lesson',
          room: sc.roomNumber || 'Room 101',
          status: 'Upcoming',
        }));

        data = {
          role: 'teacher',
          profile: teacherProfile,
          stats: {
            assignedClasses: classesCount,
            totalStudentsTaught: studentsCount,
            pendingGrades: 12,
            avgClassAttendance: `${teacherProfile.attendanceRate || 100}%`,
          },
          todaySchedule,
          gradingOverview: [],
          attendanceDistribution: [],
        };
        break;
      }

      case 'parent': {
        const parentProfile = await ParentProfile.findOne({ userId }).populate({
          path: 'children',
          populate: { path: 'userId', select: 'name email avatar phone status' }
        });
        if (!parentProfile) {
          return res.status(404).json({ success: false, message: 'Parent profile not found' });
        }

        const childrenDetails = await Promise.all((parentProfile.children || []).map(async (child) => {
          const results = await Result.find({ rollNumber: child.rollNumber });
          const homeworks = await Homework.find({ className: `${child.gradeLevel}-${child.section}` });
          const notices = await Notice.find({ targetAudience: { $in: ['student', 'parent', 'all'] } }).sort({ date: -1 }).limit(3);
          return {
            _id: child._id,
            id: child._id,
            name: child.name,
            email: child.email,
            rollNumber: child.rollNumber,
            admissionNumber: child.admissionNumber,
            gradeLevel: child.gradeLevel,
            section: child.section,
            gpa: child.gpa,
            attendanceRate: child.attendanceRate,
            presentDays: child.presentDays,
            absentDays: child.absentDays,
            totalFees: child.totalFees,
            paidFees: child.paidFees,
            pendingFees: child.pendingFees,
            medicalNotes: child.medicalNotes,
            transportRoute: child.transportRoute,
            fatherName: child.fatherName,
            motherName: child.motherName,
            dob: child.dob,
            bloodGroup: child.bloodGroup,
            previousSchool: child.previousSchool,
            results,
            homeworks,
            notices,
          };
        }));

        data = {
          role: 'parent',
          profile: parentProfile,
          children: childrenDetails,
        };
        break;
      }

      default:
        data = { role: 'guest', stats: {} };
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
