import React, { useEffect, useState } from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { salaryAPI } from '../../../services/api';
import { toast } from '../../../components/ui/toast';
import { IndianRupee, CheckCircle, Clock, Percent, Edit3, Trash2, CheckSquare, Eye } from 'lucide-react';

export const SalaryManagement = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState(null);
  const [viewingSalary, setViewingSalary] = useState(null);
  const [deletingSalary, setDeletingSalary] = useState(null);

  const [formData, setFormData] = useState({
    teacherName: '',
    employeeId: '',
    designation: 'Senior Faculty',
    payMonth: 'August 2026',
    baseSalary: 75000,
    allowances: 5000,
    deductions: 2000,
    status: 'Pending',
  });

  const mockSalaries = [
    {
      _id: 'sal_1',
      id: 'sal_1',
      teacherName: 'Dr. Sarah Connor',
      employeeId: 'EMP-001',
      designation: 'Head of Physics Department',
      payMonth: 'August 2026',
      baseSalary: 75000,
      allowances: 5000,
      deductions: 2000,
      netSalary: 78000,
      status: 'Pending',
    },
    {
      _id: 'sal_2',
      id: 'sal_2',
      teacherName: 'Prof. Marcus Vance',
      employeeId: 'EMP-002',
      designation: 'Senior Mathematics Professor',
      payMonth: 'August 2026',
      baseSalary: 68000,
      allowances: 4000,
      deductions: 1500,
      netSalary: 70500,
      status: 'Paid',
    },
    {
      _id: 'sal_3',
      id: 'sal_3',
      teacherName: 'Elena Rostova',
      employeeId: 'EMP-003',
      designation: 'Department Chair of Literature',
      payMonth: 'August 2026',
      baseSalary: 72000,
      allowances: 4500,
      deductions: 1800,
      netSalary: 74700,
      status: 'Paid',
    },
  ];

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const res = await salaryAPI.getAll();
      if (res.success && res.data && res.data.length > 0) {
        setSalaries(res.data);
      } else {
        setSalaries(mockSalaries);
      }
    } catch (err) {
      setSalaries(mockSalaries);
    } finally {
      setLoading(false);
    }
  };

  // Automatic calculation
  const calculatedNetSalary = Math.max(
    (Number(formData.baseSalary) || 0) + (Number(formData.allowances) || 0) - (Number(formData.deductions) || 0),
    0
  );

  // Analytics totals
  const totalPayrollBudget = salaries.reduce(
    (sum, s) => sum + (Number(s.netSalary) || (Number(s.baseSalary) || 0) + (Number(s.allowances) || 0) - (Number(s.deductions) || 0)),
    0
  );
  const paidSalaryTotal = salaries
    .filter((s) => s.status === 'Paid')
    .reduce((sum, s) => sum + (Number(s.netSalary) || (Number(s.baseSalary) || 0) + (Number(s.allowances) || 0) - (Number(s.deductions) || 0)), 0);
  const pendingSalaryBalance = Math.max(totalPayrollBudget - paidSalaryTotal, 0);
  const clearanceRate = totalPayrollBudget > 0 ? ((paidSalaryTotal / totalPayrollBudget) * 100).toFixed(1) : '100.0';

  const handleSaveSalary = async (e) => {
    e.preventDefault();
    if (!formData.teacherName || !formData.employeeId) return;

    try {
      if (editingSalary) {
        try {
          await salaryAPI.update(editingSalary._id || editingSalary.id, {
            ...formData,
            netSalary: calculatedNetSalary,
          });
        } catch (e) {}
        setSalaries((prev) =>
          prev.map((s) =>
            (s._id || s.id) === (editingSalary._id || editingSalary.id)
              ? { ...s, ...formData, netSalary: calculatedNetSalary }
              : s
          )
        );
        toast.success('Salary payroll record updated successfully!');
        setEditingSalary(null);
      } else {
        let newS = {
          _id: `sal_${Date.now()}`,
          id: `sal_${Date.now()}`,
          ...formData,
          netSalary: calculatedNetSalary,
        };
        try {
          const res = await salaryAPI.create({
            ...formData,
            netSalary: calculatedNetSalary,
          });
          if (res.data) newS = res.data;
        } catch (e) {}
        setSalaries((prev) => [newS, ...prev]);
        toast.success(`Salary slip issued for ${formData.teacherName}`);
        setIsAddModalOpen(false);
      }
      resetForm();
    } catch (err) {
      toast.error(err.message || 'Failed to save salary record');
    }
  };

  const handleMarkSalaryPaid = async (sal) => {
    try {
      try {
        await salaryAPI.update(sal._id || sal.id, {
          status: 'Paid',
          paymentDate: new Date().toISOString().split('T')[0],
        });
      } catch (e) {}
      setSalaries((prev) =>
        prev.map((s) =>
          (s._id || s.id) === (sal._id || sal.id)
            ? { ...s, status: 'Paid', paymentDate: new Date().toISOString().split('T')[0] }
            : s
        )
      );
      toast.success(`Salary for ${sal.teacherName} marked as Paid!`);
    } catch (err) {
      toast.error(err.message || 'Failed to update salary status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSalary) return;
    try {
      try {
        await salaryAPI.delete(deletingSalary._id || deletingSalary.id);
      } catch (e) {}
      setSalaries((prev) => prev.filter((s) => (s._id || s.id) !== (deletingSalary._id || deletingSalary.id)));
      toast.success('Salary record deleted successfully');
      setDeletingSalary(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete salary record');
    }
  };

  const resetForm = () => {
    setFormData({
      teacherName: '',
      employeeId: '',
      designation: 'Senior Faculty',
      payMonth: 'August 2026',
      baseSalary: 75000,
      allowances: 5000,
      deductions: 2000,
      status: 'Pending',
    });
  };

  const columns = [
    {
      header: 'Faculty Member',
      cell: (row) => (
        <div>
          <div className="font-bold text-white text-xs">{row.teacherName}</div>
          <span className="font-mono text-[10px] text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded">
            {row.employeeId || 'EMP-001'}
          </span>
        </div>
      ),
    },
    { header: 'Designation', accessor: (row) => row.designation || 'Faculty' },
    { header: 'Pay Month', accessor: (row) => row.month || row.payMonth || 'August 2026' },
    {
      header: 'Basic Salary',
      cell: (row) => <span className="text-slate-300 font-semibold">₹{Number(row.baseSalary || row.basicSalary || 0).toLocaleString()}</span>,
    },
    {
      header: 'Allowances / Deductions',
      cell: (row) => (
        <div className="text-xs">
          <span className="text-emerald-400 font-semibold">+₹{Number(row.allowances || 0).toLocaleString()}</span> /{' '}
          <span className="text-rose-400 font-semibold">-₹{Number(row.deductions || 0).toLocaleString()}</span>
        </div>
      ),
    },
    {
      header: 'Net Salary',
      cell: (row) => {
        const base = Number(row.baseSalary || row.basicSalary || 0);
        const allow = Number(row.allowances || 0);
        const ded = Number(row.deductions || 0);
        const net = row.netSalary || base + allow - ded;
        return <span className="font-bold text-white">₹{net.toLocaleString()}</span>;
      },
    },
    {
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.status === 'Paid' ? 'success' : 'danger'}>
          {row.status || 'Pending'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewingSalary(row)}
            title="View Details"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {row.status !== 'Paid' && (
            <button
              onClick={() => handleMarkSalaryPaid(row)}
              title="Mark Salary as Paid"
              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
            >
              <CheckSquare className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => {
              setEditingSalary(row);
              setFormData({
                teacherName: row.teacherName || '',
                employeeId: row.employeeId || '',
                designation: row.designation || 'Senior Faculty',
                payMonth: row.month || row.payMonth || 'August 2026',
                baseSalary: row.baseSalary || row.basicSalary || 75000,
                allowances: row.allowances || 0,
                deductions: row.deductions || 0,
                status: row.status || 'Pending',
              });
            }}
            title="Edit Payroll"
            className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeletingSalary(row)}
            title="Delete Payroll"
            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Faculty Salary & Payroll Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure basic salaries in INR (₹), automatically compute Net Salary = Basic + Allowances - Deductions, and manage payroll clearance
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setEditingSalary(null);
            setIsAddModalOpen(true);
          }}
        >
          + Add Payroll Record
        </Button>
      </div>

      {/* Payroll Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Payroll Budget</span>
            <IndianRupee className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">₹{totalPayrollBudget.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500">Gross monthly budget</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Paid Salary Total</span>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">₹{paidSalaryTotal.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500">Disbursed to faculty</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Pending Salary Balance</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">₹{pendingSalaryBalance.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500">Awaiting clearance</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-indigo-950/40 border-indigo-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-indigo-300">Clearance Rate</span>
            <Percent className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white">{clearanceRate}%</div>
          <span className="text-[10px] text-indigo-300 font-semibold">Payroll Clearance Rate</span>
        </Card>
      </div>

      {/* Salary History Table */}
      <DataTable
        title="Faculty Payroll Directory"
        subtitle="Manage teacher salary structures, compensation formulas, and payment clearance"
        columns={columns}
        data={salaries}
        loading={loading}
        filterKey="status"
        filterOptions={['Paid', 'Pending']}
        emptyStateTitle="No salary records found."
        onAdd={() => {
          resetForm();
          setEditingSalary(null);
          setIsAddModalOpen(true);
        }}
      />

      {/* Add / Edit Salary Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingSalary}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingSalary(null);
        }}
        title={editingSalary ? 'Edit Payroll Record' : 'Add Faculty Payroll Record'}
      >
        <form onSubmit={handleSaveSalary} className="space-y-4">
          <Input
            label="Teacher Name *"
            placeholder="Amit Sharma"
            value={formData.teacherName}
            onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Employee ID *"
              placeholder="EMP-001"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              required
            />
            <Input
              label="Designation"
              placeholder="Senior Faculty"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Pay Month"
              placeholder="August 2026"
              value={formData.payMonth}
              onChange={(e) => setFormData({ ...formData, payMonth: e.target.value })}
            />
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Payment Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Basic Salary (₹) *"
              type="number"
              value={formData.baseSalary}
              onChange={(e) => setFormData({ ...formData, baseSalary: Number(e.target.value) })}
              required
            />
            <Input
              label="Allowances (₹)"
              type="number"
              value={formData.allowances}
              onChange={(e) => setFormData({ ...formData, allowances: Number(e.target.value) })}
            />
            <Input
              label="Deductions (₹)"
              type="number"
              value={formData.deductions}
              onChange={(e) => setFormData({ ...formData, deductions: Number(e.target.value) })}
            />
          </div>

          <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl flex items-center justify-between text-xs">
            <span className="text-indigo-300 font-semibold">Calculated Net Salary:</span>
            <span className="font-extrabold text-white text-base">₹{calculatedNetSalary.toLocaleString()}</span>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingSalary(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingSalary ? 'Save Changes' : 'Issue Payroll Slip'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Salary Detail Modal */}
      <Modal isOpen={!!viewingSalary} onClose={() => setViewingSalary(null)} title="Faculty Payroll Slip Summary">
        {viewingSalary && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-purple-400 font-bold bg-purple-500/10 px-3 py-1 rounded-xl border border-purple-500/20 text-xs">
                {viewingSalary.employeeId || 'EMP-001'}
              </span>
              <Badge variant={viewingSalary.status === 'Paid' ? 'success' : 'danger'}>
                {viewingSalary.status || 'Pending'}
              </Badge>
            </div>
            <h2 className="text-lg font-bold text-white">{viewingSalary.teacherName}</h2>
            <p className="text-xs text-slate-400">{viewingSalary.designation || 'Faculty Member'}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div><b>Pay Month:</b> {viewingSalary.month || viewingSalary.payMonth || 'August 2026'}</div>
              <div><b>Basic Salary:</b> ₹{Number(viewingSalary.baseSalary || viewingSalary.basicSalary || 0).toLocaleString()}</div>
              <div><b>Allowances:</b> +₹{Number(viewingSalary.allowances || 0).toLocaleString()}</div>
              <div><b>Deductions:</b> -₹{Number(viewingSalary.deductions || 0).toLocaleString()}</div>
              <div className="col-span-2 pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
                <span>Net Disbursed Salary:</span>
                <span className="text-emerald-400 font-black text-base">
                  ₹{(
                    viewingSalary.netSalary ||
                    Number(viewingSalary.baseSalary || viewingSalary.basicSalary || 0) +
                      Number(viewingSalary.allowances || 0) -
                      Number(viewingSalary.deductions || 0)
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              {viewingSalary.status !== 'Paid' && (
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => {
                    handleMarkSalaryPaid(viewingSalary);
                    setViewingSalary(null);
                  }}
                >
                  Mark as Paid
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setViewingSalary(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Salary Modal */}
      <Modal isOpen={!!deletingSalary} onClose={() => setDeletingSalary(null)} title="Confirm Delete Payroll Record">
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to delete the payroll record for <b>{deletingSalary?.teacherName}</b> ({deletingSalary?.employeeId})?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingSalary(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteConfirm}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
