const LibraryBook = require('../models/LibraryBook');
const TransportRoute = require('../models/TransportRoute');
const APIFeatures = require('../utils/apiFeatures');

// --- LIBRARY BOOK CONTROLLERS ---

exports.getBooks = async (req, res, next) => {
  try {
    const features = new APIFeatures(LibraryBook.find(), req.query)
      .search(['title', 'author', 'isbn', 'category'])
      .filter()
      .sort()
      .paginate();
    const books = await features.query;
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error) {
    next(error);
  }
};

exports.createBook = async (req, res, next) => {
  try {
    const total = Number(req.body.copiesTotal) || 10;
    let available = Number(req.body.copiesAvailable);
    if (isNaN(available)) available = total;
    if (available > total) available = total;

    let status = 'Available';
    if (available === 0) status = 'Out of Stock';
    else if (available <= 2) status = 'Low Stock';

    const newBook = await LibraryBook.create({
      ...req.body,
      copiesTotal: total,
      copiesAvailable: available,
      status,
    });
    res.status(201).json({ success: true, message: 'Book cataloged successfully', data: newBook });
  } catch (error) {
    next(error);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.copiesTotal !== undefined || updateData.copiesAvailable !== undefined) {
      const existing = await LibraryBook.findById(id);
      const total = updateData.copiesTotal !== undefined ? Number(updateData.copiesTotal) : existing?.copiesTotal || 10;
      let available = updateData.copiesAvailable !== undefined ? Number(updateData.copiesAvailable) : existing?.copiesAvailable || 8;
      if (available > total) available = total;
      updateData.copiesTotal = total;
      updateData.copiesAvailable = available;

      if (available === 0) updateData.status = 'Out of Stock';
      else if (available <= 2) updateData.status = 'Low Stock';
      else updateData.status = 'Available';
    }

    const updated = await LibraryBook.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.status(200).json({ success: true, message: 'Book record updated', data: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await LibraryBook.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.status(200).json({ success: true, message: 'Book record removed', id });
  } catch (error) {
    next(error);
  }
};

// --- TRANSPORT ROUTE CONTROLLERS ---

exports.getTransportRoutes = async (req, res, next) => {
  try {
    const features = new APIFeatures(TransportRoute.find(), req.query)
      .search(['routeNumber', 'routeName', 'vehicleNumber', 'driverName'])
      .filter()
      .sort()
      .paginate();
    const routes = await features.query;
    res.status(200).json({ success: true, count: routes.length, data: routes });
  } catch (error) {
    next(error);
  }
};

exports.createTransportRoute = async (req, res, next) => {
  try {
    const newRoute = await TransportRoute.create(req.body);
    res.status(201).json({ success: true, message: 'Transport route created', data: newRoute });
  } catch (error) {
    next(error);
  }
};

exports.updateTransportRoute = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await TransportRoute.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }
    res.status(200).json({ success: true, message: 'Transport route updated', data: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteTransportRoute = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await TransportRoute.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }
    res.status(200).json({ success: true, message: 'Transport route deleted', id });
  } catch (error) {
    next(error);
  }
};
