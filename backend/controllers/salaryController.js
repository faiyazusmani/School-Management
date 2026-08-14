const Salary = require('../models/Salary');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Get all teacher salary records with Search, Filter, Pagination & Analytics
// @route   GET /api/salary
// @access  Private (super_admin, teacher)
exports.getSalaries = async (req, res, next) => {
  try {
    const features = new APIFeatures(Salary.find(), req.query)
      .search(['teacherName', 'employeeId', 'month'])
      .filter()
      .sort()
      .paginate();

    const salaries = await features.query;
    const total = await Salary.countDocuments();

    // Payroll Analytics Calculations
    const totalPayrollBudget = salaries.reduce((acc, s) => acc + (Number(s.netSalary) || 0), 0);
    const paidSalaryTotal = salaries.reduce((acc, s) => acc + (Number(s.paidAmount) || 0), 0);
    const pendingSalaryBalance = Math.max(totalPayrollBudget - paidSalaryTotal, 0);
    const disbursementRate = totalPayrollBudget > 0 ? Number(((paidSalaryTotal / totalPayrollBudget) * 100).toFixed(1)) : 100;

    res.status(200).json({
      success: true,
      count: salaries.length,
      total,
      analytics: {
        totalPayrollBudget,
        paidSalaryTotal,
        pendingSalaryBalance,
        disbursementRate,
      },
      data: salaries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Issue / Create Teacher Salary
// @route   POST /api/salary
// @access  Private (super_admin)
exports.createSalary = async (req, res, next) => {
  try {
    const { teacherName, employeeId, month, baseSalary, allowances, deductions, paidAmount } = req.body;
    const base = Number(baseSalary) || 5000;
    const allow = Number(allowances) || 0;
    const ded = Number(deductions) || 0;
    const net = base + allow - ded;
    const paid = Number(paidAmount) || 0;
    const pending = Math.max(net - paid, 0);

    let status = 'Pending';
    if (paid >= net) status = 'Paid';
    else if (paid > 0) status = 'Partial';

    const salaryRecord = await Salary.create({
      teacherId: req.body.teacherId || '60d5ecb8b5c9c22b8c8b4567',
      teacherName,
      employeeId,
      month: month || 'August 2026',
      baseSalary: base,
      allowances: allow,
      deductions: ded,
      netSalary: net,
      paidAmount: paid,
      pendingAmount: pending,
      status,
      paymentDate: paid > 0 ? new Date() : null,
    });

    res.status(201).json({
      success: true,
      message: 'Salary record issued successfully',
      data: salaryRecord,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Salary Payment Record
// @route   PUT /api/salary/:id
// @access  Private (super_admin)
exports.updateSalary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.baseSalary !== undefined || updateData.allowances !== undefined || updateData.deductions !== undefined) {
      const baseSalary = Number(updateData.baseSalary) || 0;
      const allowances = Number(updateData.allowances) || 0;
      const deductions = Number(updateData.deductions) || 0;
      updateData.netSalary = baseSalary + allowances - deductions;
    }
    if (updateData.status === 'Paid' && !updateData.paymentDate) {
      updateData.paymentDate = new Date();
      updateData.paidAmount = updateData.netSalary || req.body.netSalary;
      updateData.pendingAmount = 0;
    }

    const updated = await Salary.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Salary record not found' });
    }
    res.status(200).json({ success: true, message: 'Salary record updated successfully', data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Salary Record
// @route   DELETE /api/salary/:id
// @access  Private (super_admin)
exports.deleteSalary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Salary.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Salary record not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Salary record deleted',
      id,
    });
  } catch (error) {
    next(error);
  }
};
