const Notice = require('../models/Notice');
const Event = require('../models/Event');
const LeaveRequest = require('../models/LeaveRequest');
const APIFeatures = require('../utils/apiFeatures');

// --- NOTICE CONTROLLERS ---

exports.getNotices = async (req, res, next) => {
  try {
    const features = new APIFeatures(Notice.find(), req.query)
      .search(['title', 'content', 'category', 'postedBy', 'noticeType', 'status', 'priority'])
      .filter()
      .sort()
      .paginate();
    const notices = await features.query;
    res.status(200).json({ success: true, count: notices.length, data: notices });
  } catch (error) {
    next(error);
  }
};

exports.createNotice = async (req, res, next) => {
  try {
    const newNotice = await Notice.create(req.body);
    res.status(201).json({ success: true, message: 'Notice published successfully', data: newNotice });
  } catch (error) {
    next(error);
  }
};

exports.updateNotice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Notice.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }
    res.status(200).json({ success: true, message: 'Notice updated', data: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteNotice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Notice.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }
    res.status(200).json({ success: true, message: 'Notice deleted', id });
  } catch (error) {
    next(error);
  }
};

// --- EVENT CONTROLLERS ---

exports.getEvents = async (req, res, next) => {
  try {
    const features = new APIFeatures(Event.find(), req.query)
      .search(['title', 'category', 'location', 'description'])
      .filter()
      .sort()
      .paginate();
    const events = await features.query;
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    next(error);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const newEvent = await Event.create(req.body);
    res.status(201).json({ success: true, message: 'Event scheduled', data: newEvent });
  } catch (error) {
    next(error);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Event.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, message: 'Event updated', data: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Event.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, message: 'Event deleted', id });
  } catch (error) {
    next(error);
  }
};

// --- LEAVE REQUEST CONTROLLERS ---

exports.getLeaveRequests = async (req, res, next) => {
  try {
    const features = new APIFeatures(LeaveRequest.find(), req.query)
      .search(['applicantName', 'role', 'leaveType', 'reason', 'status'])
      .filter()
      .sort()
      .paginate();
    const leaves = await features.query;
    res.status(200).json({ success: true, count: leaves.length, data: leaves });
  } catch (error) {
    next(error);
  }
};

exports.createLeaveRequest = async (req, res, next) => {
  try {
    const newLeave = await LeaveRequest.create(req.body);
    res.status(201).json({ success: true, message: 'Leave request submitted', data: newLeave });
  } catch (error) {
    next(error);
  }
};

exports.updateLeaveStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await LeaveRequest.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }
    res.status(200).json({ success: true, message: `Leave request ${status}`, data: updated });
  } catch (error) {
    next(error);
  }
};
