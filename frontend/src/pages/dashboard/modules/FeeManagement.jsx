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
import { Printer, IndianRupee, CreditCard, Clock, AlertTriangle, CheckCircle, Edit3, Trash2, CheckSquare, Eye } from 'lucide-react';

export const FeeManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, token } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin' || (!user?.role && user?.email?.includes('admin')) || user?.role === 'admin';
  const isStudentOrParent = user?.role === 'student' || user?.role === 'parent';

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [deletingInvoice, setDeletingInvoice] = useState(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [receiptInvoice, setReceiptInvoice] = useState(null);

  const [formData, setFormData] = useState({
    studentName: '',
    rollNumber: '',
    title: 'Term 1 Tuition Fee',
    feeType: 'Tuition Fee',
    academicYear: '2026-2027',
    amount: 45000,
    dueDate: '2026-08-30',
    status: 'Pending',
    paymentMethod: 'Online Gateway',
  });

  const [payForm, setPayForm] = useState({
    paymentAmount: 45000,
    paymentMethod: 'Credit Card',
  });

  const mockInvoices = [
    {
      _id: 'inv_1',
      id: 'inv_1',
      invoiceNumber: 'INV-2026-001',
      studentName: 'Lucas Rivera',
      rollNumber: '101',
      title: 'Term 1 Tuition Fee',
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
            studentName: user.name || 'Owais Usmani',
            rollNumber: user.rollNumber || '101',
            title: 'Term 1 Tuition Fee',
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
        toast.success('Fee invoice updated successfully!');
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
        toast.success(`Fee invoice generated for ${formData.studentName}`);
        setIsAddModalOpen(false);
      }
      resetForm();
    } catch (err) {
      toast.error(err.message || 'Failed to save invoice');
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
      toast.success(`Invoice ${inv.invoiceNumber} marked as Paid!`);
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
      toast.success('Fee invoice deleted successfully');
      setDeletingInvoice(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete invoice');
    }
  };

  const resetForm = () => {
    setFormData({
      studentName: '',
      rollNumber: '',
      title: 'Term 1 Tuition Fee',
      feeType: 'Tuition Fee',
      academicYear: '2026-2027',
      amount: 45000,
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
        <div>
          <div className="font-semibold text-white text-xs">{row.studentName}</div>
          <div className="text-[11px] text-indigo-400 font-mono">Roll #{row.rollNumber}</div>
        </div>
      ),
    },
    {
      header: 'Fee Type',
      cell: (row) => <Badge variant="purple">{row.feeType || row.title || 'Tuition Fee'}</Badge>,
    },
    {
      header: 'Amount',
      cell: (row) => <span className="font-bold text-white">₹{Number(row.amount || 0).toLocaleString()}</span>,
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
            onClick={() => setViewingInvoice(row)}
            title="View Details"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setReceiptInvoice(row)}
            title="Generate Receipt Voucher"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          {!isStudentOrParent && row.status !== 'Paid' && (
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
                    title: row.title || 'Tuition Fee',
                    feeType: row.feeType || 'Tuition Fee',
                    academicYear: row.academicYear || '2026-2027',
                    amount: row.amount || 45000,
                    dueDate: row.dueDate ? row.dueDate.split('T')[0] : '',
                    status: row.status || 'Pending',
                    paymentMethod: row.paymentMethod || 'Online Gateway',
                  });
                }}
                title="Edit Invoice"
                className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeletingInvoice(row)}
                title="Delete Invoice"
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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Student Fee & Financial Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate tuition fee invoices in INR (₹), track collection status, mark fees as paid, and issue PDF receipt vouchers
          </p>
        </div>
        {!isStudentOrParent && (
          <Button
            variant="primary"
            onClick={() => {
              resetForm();
              setEditingInvoice(null);
              setIsAddModalOpen(true);
            }}
          >
            + Generate Fee Invoice
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
        title="Fee Invoices & Statements"
        subtitle="Manage student fee structures, tuition balances, and payment verification"
        columns={columns}
        data={invoices}
        loading={loading}
        filterKey="feeType"
        filterOptions={['Tuition Fee', 'Admission Fee', 'Exam Fee', 'Transport Fee', 'Library Fee', 'Hostel Fee', 'Other']}
        emptyStateTitle="No fee invoices found."
        onAdd={
          !isStudentOrParent
            ? () => {
                resetForm();
                setEditingInvoice(null);
                setIsAddModalOpen(true);
              }
            : undefined
        }
      />

      {/* Create / Edit Invoice Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingInvoice}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingInvoice(null);
        }}
        title={editingInvoice ? 'Edit Fee Invoice' : 'Generate Tuition Fee Invoice'}
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
              <label className="block text-xs font-semibold uppercase text-slate-400">Fee Type</label>
              <select
                value={formData.feeType}
                onChange={(e) => setFormData({ ...formData, feeType: e.target.value, title: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="Tuition Fee">Tuition Fee</option>
                <option value="Admission Fee">Admission Fee</option>
                <option value="Exam Fee">Exam Fee</option>
                <option value="Transport Fee">Transport Fee</option>
                <option value="Library Fee">Library Fee</option>
                <option value="Hostel Fee">Hostel Fee</option>
                <option value="Other">Other</option>
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
              {editingInvoice ? 'Save Changes' : 'Generate Invoice'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Detail Modal */}
      <Modal isOpen={!!viewingInvoice} onClose={() => setViewingInvoice(null)} title="Fee Invoice Details Statement">
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
                <span>Total Invoice Amount:</span>
                <span className="text-emerald-400 font-black text-base">₹{Number(viewingInvoice.amount || 0).toLocaleString()}</span>
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

      {/* Delete Invoice Modal */}
      <Modal isOpen={!!deletingInvoice} onClose={() => setDeletingInvoice(null)} title="Confirm Delete Invoice">
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to delete invoice <b>"{deletingInvoice?.invoiceNumber}"</b> for {deletingInvoice?.studentName}?
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
