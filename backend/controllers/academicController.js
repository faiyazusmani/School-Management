const Class = require('../models/Class');
const Section = require('../models/Section');
const Subject = require('../models/Subject');
const Timetable = require('../models/Timetable');
const APIFeatures = require('../utils/apiFeatures');

// --- CLASS CONTROLLERS ---

exports.getClasses = async (req, res, next) => {
  try {
    const features = new APIFeatures(Class.find().populate('classTeacher', 'name email'), req.query)
      .search(['name', 'gradeLevel', 'roomNumber'])
      .filter()
      .sort()
      .paginate();

    const classes = await features.query;
    const total = await Class.countDocuments();

    res.status(200).json({ success: true, count: classes.length, total, data: classes });
  } catch (error) {
    next(error);
  }
};

exports.createClass = async (req, res, next) => {
  try {
    const { name, gradeLevel, roomNumber, capacity } = req.body;
    const newClass = await Class.create({ name, gradeLevel, roomNumber, capacity });
    res.status(201).json({ success: true, message: 'Class created', data: newClass });
  } catch (error) {
    next(error);
  }
};

exports.updateClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Class.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }
    res.status(200).json({ success: true, message: 'Class updated', data: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Class.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }
    res.status(200).json({ success: true, message: 'Class deleted', id });
  } catch (error) {
    next(error);
  }
};

// --- SUBJECT CONTROLLERS ---

exports.getSubjects = async (req, res, next) => {
  try {
    const features = new APIFeatures(Subject.find(), req.query)
      .search(['name', 'code', 'department', 'type'])
      .filter()
      .sort()
      .paginate();

    const subjects = await features.query;
    const total = await Subject.countDocuments();

    res.status(200).json({ success: true, count: subjects.length, total, data: subjects });
  } catch (error) {
    next(error);
  }
};

exports.createSubject = async (req, res, next) => {
  try {
    const { name, code, department, credits, type } = req.body;
    const newSub = await Subject.create({ name, code, department, credits, type });
    res.status(201).json({ success: true, message: 'Subject created', data: newSub });
  } catch (error) {
    next(error);
  }
};

exports.updateSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Subject.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }
    res.status(200).json({ success: true, message: 'Subject updated', data: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Subject.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }
    res.status(200).json({ success: true, message: 'Subject deleted', id });
  } catch (error) {
    next(error);
  }
};

// --- TIMETABLE CONTROLLERS ---

exports.getTimetable = async (req, res, next) => {
  try {
    const timetables = await Timetable.find().sort({ period: 1 });
    res.status(200).json({ success: true, count: timetables.length, data: timetables });
  } catch (error) {
    next(error);
  }
};

exports.createTimetableSlot = async (req, res, next) => {
  try {
    const slot = await Timetable.create(req.body);
    res.status(201).json({ success: true, message: 'Timetable slot created', data: slot });
  } catch (error) {
    next(error);
  }
};
