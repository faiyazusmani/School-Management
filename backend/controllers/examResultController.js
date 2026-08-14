const Exam = require('../models/Exam');
const Result = require('../models/Result');
const StudentProfile = require('../models/StudentProfile');
const APIFeatures = require('../utils/apiFeatures');

// --- EXAM CONTROLLERS ---

exports.getExams = async (req, res, next) => {
  try {
    const features = new APIFeatures(Exam.find(), req.query)
      .search(['name', 'term', 'subject', 'className'])
      .filter()
      .sort()
      .paginate();
    const exams = await features.query;
    res.status(200).json({ success: true, count: exams.length, data: exams });
  } catch (error) {
    next(error);
  }
};

exports.createExam = async (req, res, next) => {
  try {
    const newExam = await Exam.create(req.body);
    res.status(201).json({ success: true, message: 'Exam scheduled', data: newExam });
  } catch (error) {
    next(error);
  }
};

exports.updateExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Exam.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    res.status(200).json({ success: true, message: 'Exam record updated', data: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Exam.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    res.status(200).json({ success: true, message: 'Exam record removed', id });
  } catch (error) {
    next(error);
  }
};

// --- RESULT CONTROLLERS ---

exports.getResults = async (req, res, next) => {
  try {
    const features = new APIFeatures(Result.find(), req.query)
      .search(['studentName', 'rollNumber', 'subject', 'grade'])
      .filter()
      .sort()
      .paginate();
    const results = await features.query;
    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    next(error);
  }
};

exports.createResult = async (req, res, next) => {
  try {
    const { studentName, rollNumber, subject, marksObtained, maxMarks, remarks } = req.body;
    const score = Number(marksObtained);
    let grade = 'F';
    if (score >= 90) grade = 'A';
    else if (score >= 80) grade = 'B';
    else if (score >= 70) grade = 'C';
    else if (score >= 60) grade = 'D';

    // Find studentId user dynamically using rollNumber
    let studentUserId = req.body.studentId;
    if (!studentUserId && rollNumber) {
      const student = await StudentProfile.findOne({ rollNumber });
      if (student) studentUserId = student.userId;
    }

    const resultRecord = await Result.create({
      examId: req.body.examId || '60d5ecb8b5c9c22b8c8b4567',
      studentId: studentUserId || req.user?._id,
      studentName: studentName || 'Student',
      rollNumber: rollNumber || '',
      subject: subject || 'General Studies',
      marksObtained: score,
      maxMarks: maxMarks || 100,
      grade,
      remarks: remarks || 'Good performance',
    });

    res.status(201).json({ success: true, message: 'Result entered successfully', data: resultRecord });
  } catch (error) {
    next(error);
  }
};

exports.updateResult = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Result.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Result record not found' });
    }
    res.status(200).json({ success: true, message: 'Result updated', data: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteResult = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Result.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }
    res.status(200).json({ success: true, message: 'Result deleted', id });
  } catch (error) {
    next(error);
  }
};
