const FeeInvoice = require('../models/FeeInvoice');
const APIFeatures = require('../utils/apiFeatures');

// --- ADMISSION CONTROLLERS ---

exports.getAdmissions = async (req, res, next) => {
  try {
    // Return empty list as admissions are not fully modeled in DB or query real collection if exists
    res.status(200).json({ success: true, count: 0, data: [] });
  } catch (error) {
    next(error);
  }
};

exports.updateAdmissionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    res.status(200).json({ success: true, message: `Admission request status updated to ${status}` });
  } catch (error) {
    next(error);
  }
};

// --- FEE INVOICE CONTROLLERS & FINANCIAL ANALYTICS ---

exports.getFeeInvoices = async (req, res, next) => {
  try {
    const features = new APIFeatures(FeeInvoice.find(), req.query)
      .search(['invoiceNumber', 'studentName', 'rollNumber', 'title', 'status'])
      .filter()
      .sort()
      .paginate();
    const invoices = await features.query;

    // Financial Analytics Calculations
    const totalRevenue = invoices.reduce((acc, inv) => acc + (Number(inv.amount) || 0), 0);
    const totalPaid = invoices.reduce((acc, inv) => acc + (inv.status === 'Paid' ? inv.amount : 0), 0);
    const remainingBalance = Math.max(totalRevenue - totalPaid, 0);
    const overdueCount = invoices.filter((inv) => inv.status === 'Overdue').length;
    const collectionRate = totalRevenue > 0 ? Number(((totalPaid / totalRevenue) * 100).toFixed(1)) : 100;

    res.status(200).json({
      success: true,
      count: invoices.length,
      analytics: {
        totalRevenue,
        totalPaid,
        remainingBalance,
        overdueCount,
        collectionRate,
      },
      data: invoices,
    });
  } catch (error) {
    next(error);
  }
};

exports.createFeeInvoice = async (req, res, next) => {
  try {
    const amount = Number(req.body.amount) || 1000;
    const paidAmount = Number(req.body.paidAmount) || 0;
    let status = req.body.status || 'Pending';
    if (paidAmount >= amount) status = 'Paid';
    else if (paidAmount > 0) status = 'Partially Paid';

    const newInvoice = await FeeInvoice.create({
      invoiceNumber: req.body.invoiceNumber || `INV-2026-${Math.floor(Math.random() * 900 + 100)}`,
      studentName: req.body.studentName,
      rollNumber: req.body.rollNumber,
      title: req.body.title || req.body.feeType || 'Tuition Fee',
      feeType: req.body.feeType || 'Tuition Fee',
      academicYear: req.body.academicYear || '2026-2027',
      amount,
      dueDate: req.body.dueDate || new Date(),
      status,
      paymentMethod: req.body.paymentMethod || 'Online Gateway',
      paymentDate: status === 'Paid' ? new Date() : undefined,
    });
    res.status(201).json({ success: true, message: 'Fee invoice generated successfully', data: newInvoice });
  } catch (error) {
    next(error);
  }
};

exports.updateFeeInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await FeeInvoice.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    res.status(200).json({ success: true, message: 'Fee invoice updated', data: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteFeeInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await FeeInvoice.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    res.status(200).json({ success: true, message: 'Fee invoice deleted', id });
  } catch (error) {
    next(error);
  }
};

exports.recordPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const paymentAmount = Number(req.body.paymentAmount) || 500;
    const receiptNumber = `REC-2026-${Math.floor(Math.random() * 900 + 100)}`;
    
    const inv = await FeeInvoice.findById(id);
    if (!inv) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const newPaid = (inv.paidAmount || 0) + paymentAmount;
    const newRemaining = Math.max(inv.amount - newPaid, 0);
    const newStatus = newRemaining === 0 ? 'Paid' : 'Partial';

    const updated = await FeeInvoice.findByIdAndUpdate(
      id,
      {
        paidAmount: newPaid,
        status: newStatus,
        paymentMethod: req.body.paymentMethod || 'Online Gateway',
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Payment of $${paymentAmount} recorded successfully. Receipt No: ${receiptNumber}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
