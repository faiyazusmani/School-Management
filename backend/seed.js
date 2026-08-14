const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');
const TeacherProfile = require('./models/TeacherProfile');
const Class = require('./models/Class');
const Subject = require('./models/Subject');
const Homework = require('./models/Homework');
const Exam = require('./models/Exam');
const Result = require('./models/Result');
const FeeInvoice = require('./models/FeeInvoice');
const Salary = require('./models/Salary');
const Notice = require('./models/Notice');
const LibraryBook = require('./models/LibraryBook');
const TransportRoute = require('./models/TransportRoute');

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edumanage_pro';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB for Seeding...');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      StudentProfile.deleteMany({}),
      TeacherProfile.deleteMany({}),
      Class.deleteMany({}),
      Subject.deleteMany({}),
      Homework.deleteMany({}),
      Exam.deleteMany({}),
      Result.deleteMany({}),
      FeeInvoice.deleteMany({}),
      Salary.deleteMany({}),
      Notice.deleteMany({}),
      LibraryBook.deleteMany({}),
      TransportRoute.deleteMany({}),
    ]);

    console.log('Cleared previous database records.');

    // 1. Seed Users
    const adminUser = await User.create({
      name: 'Alexander Wright',
      email: 'admin@edumanage.com',
      password: 'password123',
      role: 'super_admin',
      phone: '+1 (555) 100-2000',
    });

    const teacherUser = await User.create({
      name: 'Dr. Sarah Connor',
      email: 'teacher@edumanage.com',
      password: 'password123',
      role: 'teacher',
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    });

    const teacherUser2 = await User.create({
      name: 'Prof. Marcus Vance',
      email: 'marcus.vance@edumanage.com',
      password: 'password123',
      role: 'teacher',
      phone: '+1 (555) 341-9876',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    });

    const teacherUser3 = await User.create({
      name: 'Elena Rostova',
      email: 'elena.rostova@edumanage.com',
      password: 'password123',
      role: 'teacher',
      phone: '+1 (555) 782-4310',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    });

    const teacherUser4 = await User.create({
      name: 'David Chen',
      email: 'david.chen@edumanage.com',
      password: 'password123',
      role: 'teacher',
      phone: '+1 (555) 901-2345',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    });

    const parentUser = await User.create({
      name: 'Marcus Rivera',
      email: 'parent@edumanage.com',
      password: 'password123',
      role: 'parent',
      phone: '+1 (555) 890-1234',
    });

    const studentUsers = await User.create([
      {
        name: 'Aarav Sharma',
        email: 'aarav.sharma@edumanage.com',
        password: 'password123',
        role: 'student',
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'Ananya Verma',
        email: 'ananya.verma@edumanage.com',
        password: 'password123',
        role: 'student',
        phone: '+91 98765 43211',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'Rohan Gupta',
        email: 'rohan.gupta@edumanage.com',
        password: 'password123',
        role: 'student',
        phone: '+91 98765 43212',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'Priya Patel',
        email: 'priya.patel@edumanage.com',
        password: 'password123',
        role: 'student',
        phone: '+91 98765 43213',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'Kabir Mehta',
        email: 'kabir.mehta@edumanage.com',
        password: 'password123',
        role: 'student',
        phone: '+91 98765 43214',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha.reddy@edumanage.com',
        password: 'password123',
        role: 'student',
        phone: '+91 98765 43215',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'Lucas Rivera',
        email: 'student@edumanage.com',
        password: 'password123',
        role: 'student',
        phone: '+1 (555) 345-6789',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'Ishaan Malhotra',
        email: 'ishaan.m@edumanage.com',
        password: 'password123',
        role: 'student',
        phone: '+91 98765 43216',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400',
      },
    ]);

    // 2. Seed Profiles
    await StudentProfile.create([
      {
        userId: studentUsers[0]._id,
        name: 'Aarav Sharma',
        email: 'aarav.sharma@edumanage.com',
        admissionNumber: 'ADM-2026-101',
        rollNumber: '101',
        gradeLevel: 'Grade 12',
        section: 'A',
        dob: '2008-04-12',
        bloodGroup: 'B+',
        parentName: parentUser.name,
        parentEmail: parentUser.email,
        parentPhone: parentUser.phone,
        parentUserId: parentUser._id,
        gpa: 3.96,
        attendanceRate: 98.8,
        presentDays: 144,
        absentDays: 2,
        leaveDays: 1,
        totalFees: 48500,
        paidFees: 48500,
        pendingFees: 0,
      },
      {
        userId: studentUsers[1]._id,
        name: 'Ananya Verma',
        email: 'ananya.verma@edumanage.com',
        admissionNumber: 'ADM-2026-102',
        rollNumber: '102',
        gradeLevel: 'Grade 11',
        section: 'A',
        dob: '2009-08-20',
        bloodGroup: 'O+',
        parentName: 'Ramesh Verma',
        parentEmail: 'ramesh.v@gmail.com',
        parentPhone: '+91 98111 22334',
        gpa: 3.92,
        attendanceRate: 97.5,
        presentDays: 142,
        absentDays: 4,
        leaveDays: 0,
        totalFees: 48500,
        paidFees: 48500,
        pendingFees: 0,
      },
      {
        userId: studentUsers[2]._id,
        name: 'Rohan Gupta',
        email: 'rohan.gupta@edumanage.com',
        admissionNumber: 'ADM-2026-103',
        rollNumber: '103',
        gradeLevel: 'Grade 11',
        section: 'B',
        dob: '2009-01-15',
        bloodGroup: 'A+',
        parentName: 'Sunil Gupta',
        parentEmail: 'sunil.g@gmail.com',
        parentPhone: '+91 98222 33445',
        gpa: 3.85,
        attendanceRate: 96.9,
        presentDays: 140,
        absentDays: 5,
        leaveDays: 1,
        totalFees: 48500,
        paidFees: 30000,
        pendingFees: 18500,
      },
      {
        userId: studentUsers[3]._id,
        name: 'Priya Patel',
        email: 'priya.patel@edumanage.com',
        admissionNumber: 'ADM-2026-104',
        rollNumber: '104',
        gradeLevel: 'Grade 10',
        section: 'A',
        dob: '2010-06-05',
        bloodGroup: 'AB+',
        parentName: 'Vikram Patel',
        parentEmail: 'vikram.p@gmail.com',
        parentPhone: '+91 98333 44556',
        gpa: 3.78,
        attendanceRate: 95.4,
        presentDays: 138,
        absentDays: 6,
        leaveDays: 2,
        totalFees: 45000,
        paidFees: 45000,
        pendingFees: 0,
      },
      {
        userId: studentUsers[4]._id,
        name: 'Kabir Mehta',
        email: 'kabir.mehta@edumanage.com',
        admissionNumber: 'ADM-2026-105',
        rollNumber: '105',
        gradeLevel: 'Grade 12',
        section: 'B',
        dob: '2008-11-28',
        bloodGroup: 'O-',
        parentName: 'Sanjay Mehta',
        parentEmail: 'sanjay.m@gmail.com',
        parentPhone: '+91 98444 55667',
        gpa: 3.82,
        attendanceRate: 94.8,
        presentDays: 136,
        absentDays: 7,
        leaveDays: 3,
        totalFees: 48500,
        paidFees: 48500,
        pendingFees: 0,
      },
      {
        userId: studentUsers[5]._id,
        name: 'Sneha Reddy',
        email: 'sneha.reddy@edumanage.com',
        admissionNumber: 'ADM-2026-106',
        rollNumber: '106',
        gradeLevel: 'Grade 9',
        section: 'A',
        dob: '2011-03-17',
        bloodGroup: 'B-',
        parentName: 'Venkat Reddy',
        parentEmail: 'venkat.r@gmail.com',
        parentPhone: '+91 98555 66778',
        gpa: 3.90,
        attendanceRate: 96.5,
        presentDays: 139,
        absentDays: 5,
        leaveDays: 1,
        totalFees: 42000,
        paidFees: 42000,
        pendingFees: 0,
      },
      {
        userId: studentUsers[6]._id,
        name: 'Lucas Rivera',
        email: 'student@edumanage.com',
        admissionNumber: 'ADM-2026-107',
        rollNumber: '107',
        gradeLevel: 'Grade 11',
        section: 'A',
        dob: '2009-05-14',
        bloodGroup: 'O+',
        parentName: parentUser.name,
        parentEmail: parentUser.email,
        parentPhone: parentUser.phone,
        parentUserId: parentUser._id,
        gpa: 3.88,
        attendanceRate: 96.2,
        presentDays: 135,
        absentDays: 5,
        leaveDays: 2,
        totalFees: 48500,
        paidFees: 48500,
        pendingFees: 0,
      },
      {
        userId: studentUsers[7]._id,
        name: 'Ishaan Malhotra',
        email: 'ishaan.m@edumanage.com',
        admissionNumber: 'ADM-2026-108',
        rollNumber: '108',
        gradeLevel: 'Grade 10',
        section: 'B',
        dob: '2010-09-30',
        bloodGroup: 'A-',
        parentName: 'Rajiv Malhotra',
        parentEmail: 'rajiv.m@gmail.com',
        parentPhone: '+91 98666 77889',
        gpa: 3.72,
        attendanceRate: 93.6,
        presentDays: 133,
        absentDays: 9,
        leaveDays: 4,
        totalFees: 45000,
        paidFees: 30000,
        pendingFees: 15000,
      },
    ]);

    await TeacherProfile.create([
      {
        userId: teacherUser._id,
        employeeId: 'EMP-001',
        department: 'Science & Innovation',
        designation: 'Head of Physics Department',
        qualification: 'Ph.D. Quantum Physics (MIT)',
        experienceYears: 12,
        joiningDate: '2018-08-15',
        monthlySalary: 7500,
        paidSalaryTotal: 60000,
        pendingSalaryBalance: 0,
        attendanceRate: 98.6,
        subjects: ['Advanced Physics', 'Astrophysics'],
        assignedClasses: ['Grade 11-A', 'Grade 12-B'],
      },
      {
        userId: teacherUser2._id,
        employeeId: 'EMP-002',
        department: 'Mathematics',
        designation: 'Senior Mathematics Professor',
        qualification: 'M.Sc. Applied Mathematics (Stanford)',
        experienceYears: 9,
        joiningDate: '2020-01-10',
        monthlySalary: 6800,
        paidSalaryTotal: 54400,
        pendingSalaryBalance: 0,
        attendanceRate: 97.4,
        subjects: ['AP Calculus BC', 'Linear Algebra'],
        assignedClasses: ['Grade 12-B'],
      },
      {
        userId: teacherUser3._id,
        employeeId: 'EMP-003',
        department: 'Humanities',
        designation: 'Department Chair of Literature',
        qualification: 'M.A. English Literature (Oxford)',
        experienceYears: 15,
        joiningDate: '2016-09-01',
        monthlySalary: 7200,
        paidSalaryTotal: 57600,
        pendingSalaryBalance: 0,
        attendanceRate: 99.1,
        subjects: ['World Literature', 'Creative Writing'],
        assignedClasses: ['Grade 11-A', 'Grade 10-C'],
      },
      {
        userId: teacherUser4._id,
        employeeId: 'EMP-004',
        department: 'Technology',
        designation: 'Lead Computer Science Instructor',
        qualification: 'B.S. Computer Engineering (UC Berkeley)',
        experienceYears: 7,
        joiningDate: '2021-08-20',
        monthlySalary: 7000,
        paidSalaryTotal: 49000,
        pendingSalaryBalance: 0,
        attendanceRate: 96.8,
        subjects: ['Computer Science Principles', 'Data Structures'],
        assignedClasses: ['Grade 11-A'],
      },
    ]);

    // 3. Seed Classes & Subjects
    await Class.create([
      { name: 'Grade 11-A', gradeLevel: 'Grade 11', sections: ['A', 'B'], roomNumber: 'Lab 204', capacity: 40 },
      { name: 'Grade 12-B', gradeLevel: 'Grade 12', sections: ['A', 'B'], roomNumber: 'Room 302', capacity: 35 },
    ]);

    await Subject.create([
      { name: 'Advanced Physics', code: 'PHY-301', department: 'Science', credits: 4, type: 'Lab' },
      { name: 'AP Calculus BC', code: 'MAT-402', department: 'Mathematics', credits: 4, type: 'Core' },
      { name: 'World Literature', code: 'ENG-201', department: 'Humanities', credits: 3, type: 'Core' },
      { name: 'Computer Science Principles', code: 'CSC-105', department: 'Technology', credits: 4, type: 'Elective' },
    ]);

    // 4. Seed Homework, Exams & Results
    await Homework.create([
      { title: 'Electromagnetism Lab Report', subject: 'Advanced Physics', className: 'Grade 11-A', teacherName: teacherUser.name, dueDate: new Date('2026-08-10'), totalPoints: 100, description: 'Complete lab analysis for magnetic field equations.' },
      { title: 'Integration by Parts Problem Set', subject: 'AP Calculus BC', className: 'Grade 12-B', teacherName: 'Prof. Marcus Vance', dueDate: new Date('2026-08-12'), totalPoints: 50, description: 'Solve problems 1 through 25 on page 142.' },
    ]);

    const exam1 = await Exam.create({
      name: 'Mid-Term Physics Exam',
      term: 'Mid-Term',
      subject: 'Advanced Physics',
      className: 'Grade 11-A',
      examDate: new Date('2026-08-15'),
      maxMarks: 100,
      room: 'Hall A',
    });

    await Result.create([
      { examId: exam1._id, studentId: studentUser._id, studentName: studentUser.name, rollNumber: '101', subject: 'Advanced Physics', marksObtained: 94, maxMarks: 100, grade: 'A', remarks: 'Exceptional laboratory & analytical skills' },
      { examId: exam1._id, studentId: studentUser._id, studentName: studentUser.name, rollNumber: '101', subject: 'AP Calculus BC', marksObtained: 91, maxMarks: 100, grade: 'A-', remarks: 'Great problem solving' },
    ]);

    // 5. Seed Invoices & Salary Slips
    await FeeInvoice.create({
      invoiceNumber: 'INV-2026-001',
      studentName: studentUser.name,
      rollNumber: '101',
      title: 'Term 1 Tuition Fee',
      amount: 4500,
      dueDate: new Date('2026-08-30'),
      status: 'Paid',
      paymentMethod: 'Credit Card',
    });

    await Salary.create({
      teacherId: teacherUser._id,
      teacherName: teacherUser.name,
      employeeId: 'EMP-001',
      month: 'July 2026',
      year: 2026,
      baseSalary: 7500,
      allowances: 500,
      deductions: 200,
      netSalary: 7800,
      paidAmount: 7800,
      pendingAmount: 0,
      status: 'Paid',
      paymentDate: new Date('2026-07-31'),
    });

    // 6. Seed Notices, Library & Transport
    await Notice.create([
      { title: 'Annual Sports Meet 2026 Registration Open', content: 'Track and field events registration is open.', category: 'Event', targetAudience: ['all'], postedBy: 'Sports Department', date: new Date('2026-08-04') },
      { title: 'Parent-Teacher Conference Schedule', content: 'Virtual slots available for booking.', category: 'Academic', targetAudience: ['parent'], postedBy: 'Administration', date: new Date('2026-08-02') },
    ]);

    await LibraryBook.create([
      { title: 'Principles of Quantum Physics', author: 'Dr. Richard Feynman', isbn: '978-0143105824', category: 'Physics', copiesTotal: 12, copiesAvailable: 8, shelfLocation: 'Shelf 3-A' },
      { title: 'Calculus: Early Transcendentals', author: 'James Stewart', isbn: '978-1285741550', category: 'Mathematics', copiesTotal: 20, copiesAvailable: 15, shelfLocation: 'Shelf 4-B' },
    ]);

    await TransportRoute.create({
      routeNumber: 'R-101',
      routeName: 'North Metro Express',
      vehicleNumber: 'BUS-4021',
      driverName: 'Robert Vance',
      driverPhone: '+1 (555) 789-0123',
      capacity: 45,
      monthlyFee: 120,
      stops: ['Main Station', 'Oak Street', 'North Park', 'Campus Gate'],
    });

    console.log('MongoDB Database successfully seeded with 100% real records!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding MongoDB database:', error.message);
    process.exit(1);
  }
};

seedData();
