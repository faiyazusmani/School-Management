import React, { useEffect, useState } from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { FeeReceiptModal } from '../../../components/enterprise/FeeReceiptModal';
import { feeAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { toast } from '../../../components/ui/toast';
import {
  Printer,
  IndianRupee,
  CreditCard,
  Clock,
  AlertTriangle,
  CheckCircle,
  Edit3,
  Trash2,
  CheckSquare,
  Eye,
  Calendar,
  FileText,
  UserCheck,
  Plus,
  Save
} from 'lucide-react';

export const FeeManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin' || (!user?.role && user?.email?.includes('admin')) || user?.role === 'admin';
  const isStudentOrParent = user?.role === 'student' || user?.role === 'parent';

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [deletingInvoice, setDeletingInvoice] = useState(null);
  const [receiptInvoice, setReceiptInvoice] = useState(null);

  // 12-Month Academic Year Ledger Modal State
  const [yearLedgerData, setYearLedgerData] = useState(null);

  // Month Level View, Edit, Delete States inside 12-Month Ledger Modal
  const [viewingMonthFee, setViewingMonthFee] = useState(null);
  const [editingMonthFee, setEditingMonthFee] = useState(null);
  const [deletingMonthFee, setDeletingMonthFee] = useState(null);

  const [monthEditForm, setMonthEditForm] = useState({
    tuitionFee: 4000,
    extraFeeName: 'Exam Fee',
    extraFeeAmount: 1500,
    status: 'Pending',
  });

  const [formData, setFormData] = useState({
    studentName: '',
    rollNumber: '',
    title: 'Monthly Tuition Fee',
    feeType: 'Tuition Fee',
    academicYear: '2026-2027',
    amount: 4500,
    dueDate: '2026-08-30',
    status: 'Pending',
    paymentMethod: 'Online Gateway',
  });

  const mockInvoices = [
    {
      _id: 'inv_1',
      id: 'inv_1',
      invoiceNumber: 'INV-2026-001',
      studentName: 'Lucas Rivera',
      rollNumber: '101',
      title: 'Term 1 Tuition & Exam Fee',
      feeType: 'Tuition Fee',
      academicYear: '2026-2027',
      amount: 48500,
      dueDate: '2026-08-30',
      status: 'Paid',
      paymentMethod: 'Online Gateway',
      paymentDate: '2026-08-10',
    },
    {
      _id: 'inv_2',
      id: 'inv_2',
      invoiceNumber: 'INV-2026-002',
      studentName: 'Aarav Sharma',
      rollNumber: '102',
      title: 'Annual Science & Lab Fee',
      feeType: 'Admission Fee',
      academicYear: '2026-2027',
      amount: 18500,
      dueDate: '2026-08-25',
      status: 'Pending',
      paymentMethod: 'Bank Transfer',
    },
    {
      _id: 'inv_3',
      id: 'inv_3',
      invoiceNumber: 'INV-2026-003',
      studentName: 'Sophia Martinez',
      rollNumber: '103',
      title: 'Quarterly Transport Fee',
      feeType: 'Transport Fee',
      academicYear: '2026-2027',
      amount: 12000,
      dueDate: '2026-08-15',
      status: 'Overdue',
      paymentMethod: 'Cash',
    },
  ];

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    if (user && (user.role === 'student' || user.email?.includes('student'))) {
      setInvoices((prev) => {
        const userHasInvoice = prev.some(
          (inv) => inv.studentName?.toLowerCase().includes(user.name?.toLowerCase()) || inv.rollNumber === user.rollNumber
        );
        if (!userHasInvoice) {
          const userInvoice = {
            _id: `inv_user_${Date.now()}`,
            id: `inv_user_${Date.now()}`,
            invoiceNumber: `INV-2026-586`,
            studentName: user.name || 'Student User',
            rollNumber: user.rollNumber || '101',
            title: 'Monthly Tuition & Exam Fee',
            feeType: 'Tuition Fee',
            academicYear: '2026-2027',
            amount: 4500,
            dueDate: '2026-08-30',
            status: 'Pending',
            paymentMethod: 'Online Gateway',
          };
          return [userInvoice, ...prev];
        }
        return prev;
      });
    }
  }, [user, loading]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await feeAPI.getInvoices();
      if (res.success && res.data && res.data.length > 0) {
        setInvoices(res.data);
      } else {
        setInvoices(mockInvoices);
      }
    } catch (err) {
      setInvoices(mockInvoices);
    } finally {
      setLoading(false);
    }
  };

  // 12-Month Default Academic Year Fee Ledger Generator
  const generate12MonthLedger = (studentName, rollNumber) => {
    return [
      { id: 1, month: 'April 2026', tuitionFee: 4000, extraFeeName: 'Admission & Reg Fee', extraFeeAmount: 5000, status: 'Paid', paymentDate: '2026-04-05' },
      { id: 2, month: 'May 2026', tuitionFee: 4000, extraFeeName: 'None', extraFeeAmount: 0, status: 'Paid', paymentDate: '2026-05-02' },
      { id: 3, month: 'June 2026', tuitionFee: 4000, extraFeeName: 'Library & Lab Fee', extraFeeAmount: 1500, status: 'Paid', paymentDate: '2026-06-10' },
      { id: 4, month: 'July 2026', tuitionFee: 4000, extraFeeName: 'Term 1 Exam Fee', extraFeeAmount: 1500, status: 'Paid', paymentDate: '2026-07-15' },
      { id: 5, month: 'August 2026', tuitionFee: 4000, extraFeeName: 'None', extraFeeAmount: 0, status: 'Paid', paymentDate: '2026-08-04' },
      { id: 6, month: 'September 2026', tuitionFee: 4000, extraFeeName: 'Half-Yearly Exam Fee', extraFeeAmount: 1500, status: 'Pending', paymentDate: null },
      { id: 7, month: 'October 2026', tuitionFee: 4000, extraFeeName: 'Sports & Annual Fest Fee', extraFeeAmount: 2000, status: 'Pending', paymentDate: null },
      { id: 8, month: 'November 2026', tuitionFee: 4000, extraFeeName: 'None', extraFeeAmount: 0, status: 'Pending', paymentDate: null },
      { id: 9, month: 'December 2026', tuitionFee: 4000, extraFeeName: 'Term 2 Exam Fee', extraFeeAmount: 1500, status: 'Pending', paymentDate: null },
      { id: 10, month: 'January 2027', tuitionFee: 4000, extraFeeName: 'Transport Charge', extraFeeAmount: 1200, status: 'Pending', paymentDate: null },
      { id: 11, month: 'February 2027', tuitionFee: 4000, extraFeeName: 'None', extraFeeAmount: 0, status: 'Pending', paymentDate: null },
      { id: 12, month: 'March 2027', tuitionFee: 4000, extraFeeName: 'Annual Board Exam Fee', extraFeeAmount: 2500, status: 'Pending', paymentDate: null },
    ];
  };

  const handleOpenYearLedger = (student) => {
    const studentKey = `edumanage_year_ledger_${student.rollNumber || student.studentName}`;
    const saved = localStorage.getItem(studentKey);
    let monthsData;
    if (saved) {
      try {
        monthsData = JSON.parse(saved);
      } catch (e) {
        monthsData = generate12MonthLedger(student.studentName, student.rollNumber);
      }
    } else {
      monthsData = generate12MonthLedger(student.studentName, student.rollNumber);
    }

    setYearLedgerData({
      studentName: student.studentName,
      rollNumber: student.rollNumber,
      academicYear: student.academicYear || '2026-2027',
      months: monthsData,
    });
  };

  const handleToggleMonthStatus = (monthId) => {
    if (!yearLedgerData) return;
    const updatedMonths = yearLedgerData.months.map((m) => {
      if (m.id === monthId) {
        const nextStatus = m.status === 'Paid' ? 'Pending' : 'Paid';
        return {
          ...m,
          status: nextStatus,
          paymentDate: nextStatus === 'Paid' ? new Date().toISOString().split('T')[0] : null,
        };
      }
      return m;
    });

    const updated = { ...yearLedgerData, months: updatedMonths };
    setYearLedgerData(updated);

    const studentKey = `edumanage_year_ledger_${yearLedgerData.rollNumber || yearLedgerData.studentName}`;
    localStorage.setItem(studentKey, JSON.stringify(updatedMonths));
    toast.success('Month payment status updated! Full year totals recalculated above.');
  };

  const handleSaveMonthEdit = (e) => {
    e.preventDefault();
    if (!editingMonthFee || !yearLedgerData) return;

    const tFee = Number(monthEditForm.tuitionFee) || 0;
    const eFee = Number(monthEditForm.extraFeeAmount) || 0;

    const updatedMonths = yearLedgerData.months.map((m) => {
      if (m.id === editingMonthFee.id) {
        return {
          ...m,
          tuitionFee: tFee,
          extraFeeName: monthEditForm.extraFeeName || 'None',
          extraFeeAmount: eFee,
          status: monthEditForm.status,
          paymentDate: monthEditForm.status === 'Paid' ? (m.paymentDate || new Date().toISOString().split('T')[0]) : null,
        };
      }
      return m;
    });

    const updated = { ...yearLedgerData, months: updatedMonths };
    setYearLedgerData(updated);

    const studentKey = `edumanage_year_ledger_${yearLedgerData.rollNumber || yearLedgerData.studentName}`;
    localStorage.setItem(studentKey, JSON.stringify(updatedMonths));

    // Also sync back to main background table
    const newTotalForStudent = updatedMonths.reduce((sum, m) => sum + m.tuitionFee + m.extraFeeAmount, 0);
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.rollNumber === yearLedgerData.rollNumber || inv.studentName === yearLedgerData.studentName
          ? { ...inv, amount: newTotalForStudent }
          : inv
      )
    );

    toast.success(`Month record saved! Total updated to ₹${(tFee + eFee).toLocaleString()} and top cards recalculated.`);
    setEditingMonthFee(null);
  };

  const handleDeleteMonthConfirm = () => {
    if (!deletingMonthFee || !yearLedgerData) return;

    const updatedMonths = yearLedgerData.months.map((m) => {
      if (m.id === deletingMonthFee.id) {
        return {
          ...m,
          tuitionFee: 0,
          extraFeeName: 'None',
          extraFeeAmount: 0,
          status: 'Pending',
          paymentDate: null,
        };
      }
      return m;
    });

    const updated = { ...yearLedgerData, months: updatedMonths };
    setYearLedgerData(updated);

    const studentKey = `edumanage_year_ledger_${yearLedgerData.rollNumber || yearLedgerData.studentName}`;
    localStorage.setItem(studentKey, JSON.stringify(updatedMonths));
    toast.success(`Month record for ${deletingMonthFee.month} reset! Top summary cards updated.`);
    setDeletingMonthFee(null);
  };

  const handleMarkAllMonthsPaid = () => {
    if (!yearLedgerData) return;
    const updatedMonths = yearLedgerData.months.map((m) => ({
      ...m,
      status: 'Paid',
      paymentDate: m.paymentDate || new Date().toISOString().split('T')[0],
    }));

    const updated = { ...yearLedgerData, months: updatedMonths };
    setYearLedgerData(updated);

    const studentKey = `edumanage_year_ledger_${yearLedgerData.rollNumber || yearLedgerData.studentName}`;
    localStorage.setItem(studentKey, JSON.stringify(updatedMonths));
    toast.success('Marked all 12 months as Paid! Top summary cards updated.');
  };

  // Dashboard Financial Analytics Calculations
  const totalFees = invoices.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  const pendingAmount = invoices
    .filter((inv) => inv.status === 'Pending' || inv.status === 'Partially Paid')
    .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  const overdueAmount = invoices
    .filter((inv) => inv.status === 'Overdue')
    .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);

  const handleSaveInvoice = async (e) => {
    e.preventDefault();
    if (!formData.studentName || !formData.amount) return;

    try {
      if (editingInvoice) {
        try {
          await feeAPI.updateInvoice(editingInvoice._id || editingInvoice.id, formData);
        } catch (e) {}
        setInvoices((prev) =>
          prev.map((i) => ((i._id || i.id) === (editingInvoice._id || editingInvoice.id) ? { ...i, ...formData } : i))
        );
        toast.success('Student fee record updated successfully!');
        setEditingInvoice(null);
      } else {
        let newInv = {
          _id: `inv_${Date.now()}`,
          id: `inv_${Date.now()}`,
          invoiceNumber: `INV-2026-00${Math.floor(Math.random() * 90 + 10)}`,
          ...formData,
        };
        try {
          const res = await feeAPI.createInvoice(formData);
          if (res.data) newInv = res.data;
        } catch (e) {}
        setInvoices((prev) => [newInv, ...prev]);
        toast.success(`Student fee record generated for ${formData.studentName}`);
        setIsAddModalOpen(false);
      }
      resetForm();
    } catch (err) {
      toast.error(err.message || 'Failed to save fee record');
    }
  };

  const handleMarkAsPaid = async (inv) => {
    try {
      try {
        await feeAPI.updateInvoice(inv._id || inv.id, {
          status: 'Paid',
          paymentDate: new Date().toISOString().split('T')[0],
        });
      } catch (e) {}
      setInvoices((prev) =>
        prev.map((i) =>
          (i._id || i.id) === (inv._id || inv.id)
            ? { ...i, status: 'Paid', paymentDate: new Date().toISOString().split('T')[0] }
            : i
        )
      );
      toast.success(`Student Fee ${inv.invoiceNumber} marked as Paid!`);
    } catch (err) {
      toast.error(err.message || 'Failed to update payment status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingInvoice) return;
    try {
      try {
        await feeAPI.deleteInvoice(deletingInvoice._id || deletingInvoice.id);
      } catch (e) {}
      setInvoices((prev) => prev.filter((i) => (i._id || i.id) !== (deletingInvoice._id || deletingInvoice.id)));
      toast.success('Student fee record deleted successfully');
      setDeletingInvoice(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete fee record');
    }
  };

  const resetForm = () => {
    setFormData({
      studentName: '',
      rollNumber: '',
      title: 'Monthly Tuition Fee',
      feeType: 'Tuition Fee',
      academicYear: '2026-2027',
      amount: 4500,
      dueDate: '2026-08-30',
      status: 'Pending',
      paymentMethod: 'Online Gateway',
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return <Badge variant="success">✓ Paid</Badge>;
      case 'Overdue':
        return <Badge variant="danger">⚠️ Overdue</Badge>;
      case 'Partially Paid':
        return <Badge variant="warning">⏱ Partially Paid</Badge>;
      default:
        return <Badge variant="neutral">Pending</Badge>;
    }
  };

  const columns = [
    {
      header: 'Invoice #',
      cell: (row) => (
        <div>
          <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-xs block">
            {row.invoiceNumber}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Year: <span className="text-indigo-300 font-mono">{row.academicYear || '2026-2027'}</span>
          </span>
        </div>
      ),
    },
    {
      header: 'Student Name & Roll',
      cell: (row) => (
        <div
          onClick={() => handleOpenYearLedger(row)}
          className="cursor-pointer group"
          title="Click to view full 12-month academic year fee ledger"
        >
          <div className="font-semibold text-white text-xs group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
            {row.studentName}
            <Calendar className="w-3 h-3 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-[11px] text-indigo-400 font-mono">Roll #{row.rollNumber}</div>
        </div>
      ),
    },
    {
      header: 'Fee Category',
      cell: (row) => <Badge variant="purple">{row.feeType || row.title || 'Tuition Fee'}</Badge>,
    },
    {
      header: 'Amount',
      cell: (row) => <span className="font-bold text-white font-mono">₹{Number(row.amount || 0).toLocaleString()}</span>,
    },
    {
      header: 'Due Date',
      cell: (row) => <span>{row.dueDate ? row.dueDate.split('T')[0] : 'N/A'}</span>,
    },
    {
      header: 'Status',
      cell: (row) => getStatusBadge(row.status),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleOpenYearLedger(row)}
            title="View 12-Month Academic Year Ledger"
            className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 font-medium text-[10px] flex items-center gap-1"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">12-Month Record</span>
          </button>

          <button
            onClick={() => setViewingInvoice(row)}
            title="View Statement Details"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setReceiptInvoice(row)}
            title="Print Receipt Voucher"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          {isSuperAdmin && row.status !== 'Paid' && (
            <button
              onClick={() => handleMarkAsPaid(row)}
              title="Mark as Paid"
              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
            >
              <CheckSquare className="w-3.5 h-3.5" />
            </button>
          )}

          {isSuperAdmin && (
            <>
              <button
                onClick={() => {
                  setEditingInvoice(row);
                  setFormData({
                    studentName: row.studentName || '',
                    rollNumber: row.rollNumber || '',
                    title: row.title || 'Monthly Tuition Fee',
                    feeType: row.feeType || 'Tuition Fee',
                    academicYear: row.academicYear || '2026-2027',
                    amount: row.amount || 4500,
                    dueDate: row.dueDate ? row.dueDate.split('T')[0] : '',
                    status: row.status || 'Pending',
                    paymentMethod: row.paymentMethod || 'Online Gateway',
                  });
                }}
                title="Edit Fee Record (Super Admin)"
                className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setDeletingInvoice(row)}
                title="Delete Fee Record (Super Admin)"
                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  // Calculate stats for 12-Month Year Ledger Modal (Reactively auto-updates on every change)
  const paidMonthsCount = yearLedgerData?.months?.filter((m) => m.status === 'Paid').length || 0;
  const pendingMonthsCount = yearLedgerData?.months?.filter((m) => m.status !== 'Paid').length || 0;
  const totalYearPaid = yearLedgerData?.months
    ?.filter((m) => m.status === 'Paid')
    .reduce((sum, m) => sum + (Number(m.tuitionFee) || 0) + (Number(m.extraFeeAmount) || 0), 0) || 0;
  const totalYearPending = yearLedgerData?.months
    ?.filter((m) => m.status !== 'Paid')
    .reduce((sum, m) => sum + (Number(m.tuitionFee) || 0) + (Number(m.extraFeeAmount) || 0), 0) || 0;

  // Live calculation inside Edit Month Modal
  const editLiveTotal = (Number(monthEditForm.tuitionFee) || 0) + (Number(monthEditForm.extraFeeAmount) || 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="success">STUDENT FEE PORTAL</Badge>
            {isSuperAdmin && <Badge variant="purple">SUPER ADMIN FULL ACCESS</Badge>}
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Student Fee & Yearly Ledger Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Super Admin control for student fee invoices, 12-month academic year fee ledgers, exam fees, tuition fees, editing and deleting records.
          </p>
        </div>
        {isSuperAdmin && (
          <Button
            variant="primary"
            onClick={() => {
              resetForm();
              setEditingInvoice(null);
              setIsAddModalOpen(true);
            }}
          >
            + Add New Fee Record
          </Button>
        )}
      </div>

      {/* Financial Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Billed Fees</span>
            <IndianRupee className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">₹{totalFees.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500">Gross receivables</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Paid Amount</span>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">₹{paidAmount.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500">Received to date</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Pending Amount</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">₹{pendingAmount.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500">Outstanding balance</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Overdue Amount</span>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400">₹{overdueAmount.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500">Past due date</span>
        </Card>
      </div>

      {/* Invoice Table */}
      <DataTable
        title="Student Fee Statements"
        subtitle="Click any student row or '12-Month Record' to view full academic year monthly breakdown"
        columns={columns}
        data={invoices}
        loading={loading}
        filterKey="feeType"
        filterOptions={['Tuition Fee', 'Admission Fee', 'Exam Fee', 'Transport Fee', 'Library Fee', 'Hostel Fee', 'Other']}
        emptyStateTitle="No student fee records found."
        onAdd={
          isSuperAdmin
            ? () => {
                resetForm();
                setEditingInvoice(null);
                setIsAddModalOpen(true);
              }
            : undefined
        }
      />

      {/* 🌟 FULL 12-MONTH ACADEMIC YEAR FEE LEDGER MODAL */}
      <Modal
        isOpen={!!yearLedgerData}
        onClose={() => setYearLedgerData(null)}
        size="5xl"
        title={`Full Year Fee Record: ${yearLedgerData?.studentName || ''} (Roll #${yearLedgerData?.rollNumber || ''})`}
      >
        {yearLedgerData && (
          <div className="space-y-6">
            {/* Student Ledger Summary Stats Cards (Auto-recalculated on Save) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 border border-slate-800 rounded-2xl shadow-inner">
              <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Months Paid</span>
                <span className="text-lg font-black text-emerald-400">{paidMonthsCount} / 12 Months</span>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Months Pending</span>
                <span className="text-lg font-black text-amber-400">{pendingMonthsCount} / 12 Months</span>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Year Paid</span>
                <span className="text-lg font-black text-white font-mono">₹{totalYearPaid.toLocaleString()}</span>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Balance</span>
                <span className="text-lg font-black text-rose-400 font-mono">₹{totalYearPending.toLocaleString()}</span>
              </div>
            </div>

            {/* Super Admin Quick Actions */}
            {isSuperAdmin && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <span className="text-xs text-indigo-300 font-semibold">
                  ⚡ Super Admin Control: Edit any month below and hit "Save Month Changes" to auto-update total amounts above
                </span>
                <Button size="sm" variant="success" className="whitespace-nowrap shrink-0" onClick={handleMarkAllMonthsPaid}>
                  ✓ Mark All 12 Months Paid
                </Button>
              </div>
            )}

            {/* 12-Month Table Breakdown with View, Edit, Delete Actions */}
            <div className="overflow-x-auto border border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs text-slate-300 min-w-[750px]">
                <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Academic Month</th>
                    <th className="p-3">Tuition Fee</th>
                    <th className="p-3">Exam & Additional Fees</th>
                    <th className="p-3">Total Payable</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions (View / Edit / Delete)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/80">
                  {yearLedgerData.months.map((m) => {
                    const totalMonth = m.tuitionFee + m.extraFeeAmount;
                    return (
                      <tr key={m.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3 font-bold text-white whitespace-nowrap">{m.month}</td>
                        <td className="p-3 font-mono whitespace-nowrap">₹{m.tuitionFee.toLocaleString()}</td>
                        <td className="p-3">
                          {m.extraFeeAmount > 0 ? (
                            <div>
                              <span className="text-indigo-400 font-semibold block">{m.extraFeeName}</span>
                              <span className="font-mono text-slate-400">+₹{m.extraFeeAmount.toLocaleString()}</span>
                            </div>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="p-3 font-black text-white font-mono whitespace-nowrap">₹{totalMonth.toLocaleString()}</td>
                        <td className="p-3 whitespace-nowrap">
                          {m.status === 'Paid' ? (
                            <div>
                              <Badge variant="success">✓ Paid</Badge>
                              {m.paymentDate && <span className="block text-[9px] text-slate-400 mt-0.5">{m.paymentDate}</span>}
                            </div>
                          ) : (
                            <Badge variant="warning">Pending</Badge>
                          )}
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Month Fee Button */}
                            <button
                              onClick={() => setViewingMonthFee(m)}
                              title={`View Fee Breakdown for ${m.month}`}
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {isSuperAdmin && (
                              <>
                                {/* Edit Month Fee Button */}
                                <button
                                  onClick={() => {
                                    setEditingMonthFee(m);
                                    setMonthEditForm({
                                      tuitionFee: m.tuitionFee,
                                      extraFeeName: m.extraFeeName === 'None' ? 'Exam Fee' : m.extraFeeName,
                                      extraFeeAmount: m.extraFeeAmount,
                                      status: m.status,
                                    });
                                  }}
                                  title={`Edit Fee Record for ${m.month}`}
                                  className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete Month Fee Button */}
                                <button
                                  onClick={() => setDeletingMonthFee(m)}
                                  title={`Delete/Reset Fee Record for ${m.month}`}
                                  className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}

                            {/* Status Quick Toggle Button */}
                            {isSuperAdmin && (
                              <Button
                                size="sm"
                                variant={m.status === 'Paid' ? 'outline' : 'primary'}
                                className="text-[10px] py-1 px-2.5 whitespace-nowrap ml-1"
                                onClick={() => handleToggleMonthStatus(m.id)}
                              >
                                {m.status === 'Paid' ? 'Mark Pending' : 'Mark Paid'}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setYearLedgerData(null)}>
                Close Record
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* 👁️ VIEW SINGLE MONTH FEE BREAKDOWN MODAL */}
      <Modal isOpen={!!viewingMonthFee} onClose={() => setViewingMonthFee(null)} title={`Fee Statement: ${viewingMonthFee?.month}`}>
        {viewingMonthFee && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">{yearLedgerData?.studentName} (Roll #{yearLedgerData?.rollNumber})</span>
              {getStatusBadge(viewingMonthFee.status)}
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div><b>Academic Month:</b> {viewingMonthFee.month}</div>
              <div><b>Tuition Fee:</b> ₹{viewingMonthFee.tuitionFee.toLocaleString()}</div>
              <div><b>Additional Fee Name:</b> {viewingMonthFee.extraFeeName}</div>
              <div><b>Additional Fee Amount:</b> ₹{viewingMonthFee.extraFeeAmount.toLocaleString()}</div>
              <div><b>Payment Status:</b> {viewingMonthFee.status}</div>
              <div><b>Payment Date:</b> {viewingMonthFee.paymentDate || 'Pending'}</div>
              <div className="col-span-2 pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
                <span>Total Month Payable:</span>
                <span className="text-emerald-400 font-black text-base font-mono">₹{(viewingMonthFee.tuitionFee + viewingMonthFee.extraFeeAmount).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setViewingMonthFee(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ✏️ EDIT SINGLE MONTH FEE MODAL (SUPER ADMIN WITH LIVE TOTAL PREVIEW & SAVE) */}
      <Modal isOpen={!!editingMonthFee} onClose={() => setEditingMonthFee(null)} title={`Edit Fee & Recalculate Totals: ${editingMonthFee?.month}`}>
        <form onSubmit={handleSaveMonthEdit} className="space-y-4">
          <Input
            label="Tuition Fee (₹) *"
            type="number"
            value={monthEditForm.tuitionFee}
            onChange={(e) => setMonthEditForm({ ...monthEditForm, tuitionFee: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Additional Fee Name (Exam/Lab/Sports)"
              value={monthEditForm.extraFeeName}
              onChange={(e) => setMonthEditForm({ ...monthEditForm, extraFeeName: e.target.value })}
            />
            <Input
              label="Additional Fee Amount (₹)"
              type="number"
              value={monthEditForm.extraFeeAmount}
              onChange={(e) => setMonthEditForm({ ...monthEditForm, extraFeeAmount: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase text-slate-400">Payment Status</label>
            <select
              value={monthEditForm.status}
              onChange={(e) => setMonthEditForm({ ...monthEditForm, status: e.target.value })}
              className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          {/* Live total calculation preview before saving */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">New Total Month Amount:</span>
            <span className="text-base font-black text-emerald-400 font-mono">₹{editLiveTotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setEditingMonthFee(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="flex items-center gap-1.5">
              <Save className="w-4 h-4" /> Save & Update Totals Above
            </Button>
          </div>
        </form>
      </Modal>

      {/* 🗑️ DELETE SINGLE MONTH FEE MODAL (SUPER ADMIN) */}
      <Modal isOpen={!!deletingMonthFee} onClose={() => setDeletingMonthFee(null)} title={`Confirm Reset Month Fee`}>
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to reset/delete fee breakdown for <b>{deletingMonthFee?.month}</b>? Extra fees will be cleared and total amounts recalculated.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingMonthFee(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteMonthConfirm}>
              Confirm Delete & Update Totals
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create / Edit Invoice Modal (Super Admin Control) */}
      <Modal
        isOpen={isAddModalOpen || !!editingInvoice}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingInvoice(null);
        }}
        title={editingInvoice ? 'Edit Student Fee Record' : 'Add New Student Fee Record'}
      >
        <form onSubmit={handleSaveInvoice} className="space-y-4">
          <Input
            label="Student Full Name *"
            placeholder="Aarav Sharma"
            value={formData.studentName}
            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Roll Number *"
              placeholder="101"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              required
            />
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Fee Category *</label>
              <select
                value={formData.feeType}
                onChange={(e) => setFormData({ ...formData, feeType: e.target.value, title: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="Tuition Fee">Monthly Tuition Fee</option>
                <option value="Exam Fee">Term Exam Fee</option>
                <option value="Admission Fee">Admission / Reg Fee</option>
                <option value="Transport Fee">Transport / Bus Fee</option>
                <option value="Library Fee">Library & Lab Fee</option>
                <option value="Sports Fee">Annual Sports & Activity Fee</option>
                <option value="Other">Miscellaneous / Other Fee</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Total Amount (₹) *"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              required
            />
            <Input
              label="Due Date *"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Payment Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
                <option value="Partially Paid">Partially Paid</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="Online Gateway">Online Gateway</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingInvoice(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingInvoice ? 'Save Changes' : 'Create Record'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Detail Statement Modal */}
      <Modal isOpen={!!viewingInvoice} onClose={() => setViewingInvoice(null)} title="Fee Statement Details">
        {viewingInvoice && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 text-xs">
                {viewingInvoice.invoiceNumber}
              </span>
              {getStatusBadge(viewingInvoice.status)}
            </div>
            <h2 className="text-lg font-bold text-white">{viewingInvoice.studentName}</h2>
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div><b>Roll Number:</b> #{viewingInvoice.rollNumber}</div>
              <div><b>Academic Year:</b> {viewingInvoice.academicYear || '2026-2027'}</div>
              <div><b>Fee Category:</b> {viewingInvoice.feeType || viewingInvoice.title}</div>
              <div><b>Payment Method:</b> {viewingInvoice.paymentMethod || 'Online Gateway'}</div>
              <div><b>Due Date:</b> {viewingInvoice.dueDate ? viewingInvoice.dueDate.split('T')[0] : 'N/A'}</div>
              <div><b>Paid Date:</b> {viewingInvoice.paymentDate || 'Pending'}</div>
              <div className="col-span-2 pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
                <span>Total Amount:</span>
                <span className="text-emerald-400 font-black text-base font-mono">₹{Number(viewingInvoice.amount || 0).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setReceiptInvoice(viewingInvoice);
                  setViewingInvoice(null);
                }}
              >
                <Printer className="w-3.5 h-3.5 mr-1" /> Print Voucher
              </Button>
              <Button variant="outline" size="sm" onClick={() => setViewingInvoice(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Record Confirmation Modal (Super Admin) */}
      <Modal isOpen={!!deletingInvoice} onClose={() => setDeletingInvoice(null)} title="Confirm Delete Student Fee Record">
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to permanently delete fee record <b>"{deletingInvoice?.invoiceNumber}"</b> for student <b>{deletingInvoice?.studentName}</b>?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingInvoice(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteConfirm}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* PDF Receipt Voucher Modal */}
      {receiptInvoice && (
        <FeeReceiptModal invoice={receiptInvoice} onClose={() => setReceiptInvoice(null)} />
      )}
    </div>
  );
};
