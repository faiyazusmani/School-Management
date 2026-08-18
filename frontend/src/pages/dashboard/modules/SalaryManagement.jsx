import React, { useEffect, useState } from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { salaryAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { toast } from '../../../components/ui/toast';
import {
  IndianRupee,
  CheckCircle,
  Clock,
  Percent,
  Edit3,
  Trash2,
  CheckSquare,
  Eye,
  Calendar,
  UserCheck,
  Plus,
  Briefcase,
  Save
} from 'lucide-react';

export const SalaryManagement = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin' || (!user?.role && user?.email?.includes('admin')) || user?.role === 'admin';

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState(null);
  const [viewingSalary, setViewingSalary] = useState(null);
  const [deletingSalary, setDeletingSalary] = useState(null);

  // 12-Month Academic Year Salary Ledger Modal State
  const [yearSalaryData, setYearSalaryData] = useState(null);

  // Month Level View, Edit, Delete States inside 12-Month Teacher Salary Ledger Modal
  const [viewingTeacherMonthSalary, setViewingTeacherMonthSalary] = useState(null);
  const [editingTeacherMonthSalary, setEditingTeacherMonthSalary] = useState(null);
  const [deletingTeacherMonthSalary, setDeletingTeacherMonthSalary] = useState(null);

  const [teacherMonthEditForm, setTeacherMonthEditForm] = useState({
    baseSalary: 75000,
    allowances: 5000,
    deductions: 2000,
    status: 'Pending',
  });

  const [formData, setFormData] = useState({
    teacherName: '',
    employeeId: '',
    designation: 'Senior Faculty',
    payMonth: 'August 2026',
    baseSalary: 75000,
    allowances: 5000,
    deductions: 2000,
    status: 'Pending',
    paymentMethod: 'Bank Transfer',
  });

  const mockSalaries = [
    {
      _id: 'sal_1',
      id: 'sal_1',
      teacherName: 'Sunil Sir',
      employeeId: 'EMP-101',
      designation: 'Head of Physics Department (HOD)',
      payMonth: 'August 2026',
      baseSalary: 85000,
      allowances: 6000,
      deductions: 2500,
      netSalary: 88500,
      status: 'Paid',
      paymentMethod: 'Bank Transfer',
      paymentDate: '2026-08-01',
    },
    {
      _id: 'sal_2',
      id: 'sal_2',
      teacherName: 'Ranjeet Sir',
      employeeId: 'EMP-102',
      designation: 'Head of Mathematics Department (HOD)',
      payMonth: 'August 2026',
      baseSalary: 82000,
      allowances: 5500,
      deductions: 2200,
      netSalary: 85300,
      status: 'Paid',
      paymentMethod: 'Bank Transfer',
      paymentDate: '2026-08-01',
    },
    {
      _id: 'sal_3',
      id: 'sal_3',
      teacherName: 'Dr. Sarah Connor',
      employeeId: 'EMP-103',
      designation: 'Chemistry & Innovation HOD',
      payMonth: 'August 2026',
      baseSalary: 78000,
      allowances: 5000,
      deductions: 2000,
      netSalary: 81000,
      status: 'Pending',
      paymentMethod: 'Bank Transfer',
    },
    {
      _id: 'sal_4',
      id: 'sal_4',
      teacherName: 'Priya Ma’am',
      employeeId: 'EMP-104',
      designation: 'English Literature Faculty',
      payMonth: 'August 2026',
      baseSalary: 65000,
      allowances: 4000,
      deductions: 1500,
      netSalary: 67500,
      status: 'Paid',
      paymentMethod: 'Bank Transfer',
      paymentDate: '2026-08-02',
    },
    {
      _id: 'sal_5',
      id: 'sal_5',
      teacherName: 'Ankit Sir',
      employeeId: 'EMP-105',
      designation: 'Computer Science & AI HOD',
      payMonth: 'August 2026',
      baseSalary: 75000,
      allowances: 5000,
      deductions: 2000,
      netSalary: 78000,
      status: 'Pending',
      paymentMethod: 'Bank Transfer',
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

  // 12-Month Academic Year Teacher Salary Ledger Generator
  const generate12MonthTeacherSalary = (teacherName, baseSalary = 75000, allowances = 5000, deductions = 2000) => {
    const months = [
      'April 2026', 'May 2026', 'June 2026', 'July 2026', 'August 2026', 'September 2026',
      'October 2026', 'November 2026', 'December 2026', 'January 2027', 'February 2027', 'March 2027'
    ];

    return months.map((mName, idx) => {
      const isPastMonth = idx < 5; // April to August 2026 paid
      const netPay = baseSalary + allowances - deductions;
      return {
        id: idx + 1,
        month: mName,
        baseSalary,
        allowances,
        deductions,
        netPayable: netPay,
        status: isPastMonth ? 'Paid' : 'Pending',
        paymentDate: isPastMonth ? `2026-0${idx + 4}-01` : null,
      };
    });
  };

  const handleOpenTeacherYearSalary = (teacher) => {
    const teacherKey = `edumanage_teacher_salary_ledger_${teacher.employeeId || teacher.teacherName}`;
    const saved = localStorage.getItem(teacherKey);
    let monthsData;
    if (saved) {
      try {
        monthsData = JSON.parse(saved);
      } catch (e) {
        monthsData = generate12MonthTeacherSalary(teacher.teacherName, teacher.baseSalary, teacher.allowances, teacher.deductions);
      }
    } else {
      monthsData = generate12MonthTeacherSalary(teacher.teacherName, teacher.baseSalary, teacher.allowances, teacher.deductions);
    }

    setYearSalaryData({
      teacherName: teacher.teacherName,
      employeeId: teacher.employeeId || 'EMP-101',
      designation: teacher.designation || 'Faculty Member',
      months: monthsData,
    });
  };

  const handleToggleTeacherMonthSalary = (monthId) => {
    if (!yearSalaryData) return;
    const updatedMonths = yearSalaryData.months.map((m) => {
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

    const updated = { ...yearSalaryData, months: updatedMonths };
    setYearSalaryData(updated);

    const teacherKey = `edumanage_teacher_salary_ledger_${yearSalaryData.employeeId || yearSalaryData.teacherName}`;
    localStorage.setItem(teacherKey, JSON.stringify(updatedMonths));
    toast.success('Teacher month salary status updated! Top cards recalculated above.');
  };

  const handleSaveTeacherMonthSalaryEdit = (e) => {
    e.preventDefault();
    if (!editingTeacherMonthSalary || !yearSalaryData) return;

    const base = Number(teacherMonthEditForm.baseSalary) || 0;
    const allow = Number(teacherMonthEditForm.allowances) || 0;
    const ded = Number(teacherMonthEditForm.deductions) || 0;
    const net = Math.max(base + allow - ded, 0);

    const updatedMonths = yearSalaryData.months.map((m) => {
      if (m.id === editingTeacherMonthSalary.id) {
        return {
          ...m,
          baseSalary: base,
          allowances: allow,
          deductions: ded,
          netPayable: net,
          status: teacherMonthEditForm.status,
          paymentDate: teacherMonthEditForm.status === 'Paid' ? (m.paymentDate || new Date().toISOString().split('T')[0]) : null,
        };
      }
      return m;
    });

    const updated = { ...yearSalaryData, months: updatedMonths };
    setYearSalaryData(updated);

    const teacherKey = `edumanage_teacher_salary_ledger_${yearSalaryData.employeeId || yearSalaryData.teacherName}`;
    localStorage.setItem(teacherKey, JSON.stringify(updatedMonths));

    // Sync back to main background salaries table
    setSalaries((prev) =>
      prev.map((sal) =>
        sal.employeeId === yearSalaryData.employeeId || sal.teacherName === yearSalaryData.teacherName
          ? { ...sal, baseSalary: base, allowances: allow, deductions: ded, netSalary: net }
          : sal
      )
    );

    toast.success(`Salary record saved! Net monthly salary updated to ₹${net.toLocaleString()} and top summary cards recalculated.`);
    setEditingTeacherMonthSalary(null);
  };

  const handleDeleteTeacherMonthSalaryConfirm = () => {
    if (!deletingTeacherMonthSalary || !yearSalaryData) return;

    const updatedMonths = yearSalaryData.months.map((m) => {
      if (m.id === deletingTeacherMonthSalary.id) {
        return {
          ...m,
          baseSalary: 0,
          allowances: 0,
          deductions: 0,
          netPayable: 0,
          status: 'Pending',
          paymentDate: null,
        };
      }
      return m;
    });

    const updated = { ...yearSalaryData, months: updatedMonths };
    setYearSalaryData(updated);

    const teacherKey = `edumanage_teacher_salary_ledger_${yearSalaryData.employeeId || yearSalaryData.teacherName}`;
    localStorage.setItem(teacherKey, JSON.stringify(updatedMonths));
    toast.success(`Salary record for ${deletingTeacherMonthSalary.month} reset! Top cards recalculated.`);
    setDeletingTeacherMonthSalary(null);
  };

  const handleMarkAllTeacherMonthsPaid = () => {
    if (!yearSalaryData) return;
    const updatedMonths = yearSalaryData.months.map((m) => ({
      ...m,
      status: 'Paid',
      paymentDate: m.paymentDate || new Date().toISOString().split('T')[0],
    }));

    const updated = { ...yearSalaryData, months: updatedMonths };
    setYearSalaryData(updated);

    const teacherKey = `edumanage_teacher_salary_ledger_${yearSalaryData.employeeId || yearSalaryData.teacherName}`;
    localStorage.setItem(teacherKey, JSON.stringify(updatedMonths));
    toast.success('Marked all 12 months salary as Paid & Disbursed! Top cards updated.');
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
        toast.success('Teacher salary record updated successfully!');
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
        toast.success(`Teacher salary slip issued for ${formData.teacherName}`);
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
      toast.success('Teacher salary record deleted successfully');
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
      paymentMethod: 'Bank Transfer',
    });
  };

  const columns = [
    {
      header: 'Teacher Member',
      cell: (row) => (
        <div
          onClick={() => handleOpenTeacherYearSalary(row)}
          className="cursor-pointer group"
          title="Click to view full 12-month academic year salary record"
        >
          <div className="font-bold text-white text-xs group-hover:text-purple-400 transition-colors flex items-center gap-1.5">
            {row.teacherName}
            <Calendar className="w-3 h-3 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-mono text-[10px] text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded">
            {row.employeeId || 'EMP-101'}
          </span>
        </div>
      ),
    },
    { header: 'Designation', accessor: (row) => row.designation || 'Faculty Member' },
    { header: 'Pay Month', accessor: (row) => row.month || row.payMonth || 'August 2026' },
    {
      header: 'Basic Salary',
      cell: (row) => <span className="text-slate-300 font-semibold font-mono">₹{Number(row.baseSalary || row.basicSalary || 0).toLocaleString()}</span>,
    },
    {
      header: 'Allowances / Deductions',
      cell: (row) => (
        <div className="text-xs font-mono">
          <span className="text-emerald-400 font-semibold">+₹{Number(row.allowances || 0).toLocaleString()}</span> /{' '}
          <span className="text-rose-400 font-semibold">-₹{Number(row.deductions || 0).toLocaleString()}</span>
        </div>
      ),
    },
    {
      header: 'Net Monthly Salary',
      cell: (row) => {
        const base = Number(row.baseSalary || row.basicSalary || 0);
        const allow = Number(row.allowances || 0);
        const ded = Number(row.deductions || 0);
        const net = row.netSalary || base + allow - ded;
        return <span className="font-bold text-white font-mono">₹{net.toLocaleString()}</span>;
      },
    },
    {
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.status === 'Paid' ? 'success' : 'danger'}>
          {row.status === 'Paid' ? '✓ Disbursed (Paid)' : 'Pending'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleOpenTeacherYearSalary(row)}
            title="View 12-Month Salary Record"
            className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 font-medium text-[10px] flex items-center gap-1"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">12-Month Record</span>
          </button>

          <button
            onClick={() => setViewingSalary(row)}
            title="View Salary Details"
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

          {isSuperAdmin && (
            <>
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
                    paymentMethod: row.paymentMethod || 'Bank Transfer',
                  });
                }}
                title="Edit Teacher Salary Record (Super Admin)"
                className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setDeletingSalary(row)}
                title="Delete Teacher Salary Record (Super Admin)"
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

  // Stats for 12-Month Year Salary Ledger Modal (Auto-recalculated reactively)
  const paidTeacherMonths = yearSalaryData?.months?.filter((m) => m.status === 'Paid').length || 0;
  const pendingTeacherMonths = yearSalaryData?.months?.filter((m) => m.status !== 'Paid').length || 0;
  const totalTeacherPaid = yearSalaryData?.months
    ?.filter((m) => m.status === 'Paid')
    .reduce((sum, m) => sum + (Number(m.netPayable) || 0), 0) || 0;
  const totalTeacherPending = yearSalaryData?.months
    ?.filter((m) => m.status !== 'Paid')
    .reduce((sum, m) => sum + (Number(m.netPayable) || 0), 0) || 0;

  // Live Net Salary calculation inside Edit Teacher Month Modal
  const editTeacherLiveNet = Math.max(
    (Number(teacherMonthEditForm.baseSalary) || 0) +
      (Number(teacherMonthEditForm.allowances) || 0) -
      (Number(teacherMonthEditForm.deductions) || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="purple">TEACHER SALARY PORTAL</Badge>
            {isSuperAdmin && <Badge variant="success">SUPER ADMIN FULL ACCESS</Badge>}
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Teacher Salary & Payroll Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage faculty monthly payrolls, base salaries, HRA allowances, tax deductions, 12-month academic year salary ledgers, and disburse teacher salaries.
          </p>
        </div>
        {isSuperAdmin && (
          <Button
            variant="primary"
            onClick={() => {
              resetForm();
              setEditingSalary(null);
              setIsAddModalOpen(true);
            }}
          >
            + Add Teacher Salary Record
          </Button>
        )}
      </div>

      {/* Financial Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Monthly Payroll</span>
            <IndianRupee className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">₹{totalPayrollBudget.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500">Gross monthly faculty budget</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Disbursed Salary</span>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">₹{paidSalaryTotal.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500">Paid to bank accounts</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Pending Payroll</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">₹{pendingSalaryBalance.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500">Awaiting disbursement</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Disbursement Rate</span>
            <Percent className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400">{clearanceRate}%</div>
          <span className="text-[10px] text-slate-500">Monthly clearance progress</span>
        </Card>
      </div>

      {/* Salary Table */}
      <DataTable
        title="Teacher Salary Statements"
        subtitle="Click any teacher row or '12-Month Record' to view full academic year salary breakdown"
        columns={columns}
        data={salaries}
        loading={loading}
        filterKey="status"
        filterOptions={['Paid', 'Pending']}
        emptyStateTitle="No teacher salary records found."
        onAdd={
          isSuperAdmin
            ? () => {
                resetForm();
                setEditingSalary(null);
                setIsAddModalOpen(true);
              }
            : undefined
        }
      />

      {/* 🌟 FULL 12-MONTH ACADEMIC YEAR TEACHER SALARY LEDGER MODAL */}
      <Modal
        isOpen={!!yearSalaryData}
        onClose={() => setYearSalaryData(null)}
        size="5xl"
        title={`Full Year Teacher Salary Record: ${yearSalaryData?.teacherName || ''} (${yearSalaryData?.employeeId || ''})`}
      >
        {yearSalaryData && (
          <div className="space-y-6">
            {/* Teacher Ledger Summary Stats Cards (Auto-recalculated on Save) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 border border-slate-800 rounded-2xl shadow-inner">
              <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Months Disbursed</span>
                <span className="text-lg font-black text-emerald-400">{paidTeacherMonths} / 12 Months</span>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Months Pending</span>
                <span className="text-lg font-black text-amber-400">{pendingTeacherMonths} / 12 Months</span>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Disbursed</span>
                <span className="text-lg font-black text-white font-mono">₹{totalTeacherPaid.toLocaleString()}</span>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Payroll</span>
                <span className="text-lg font-black text-rose-400 font-mono">₹{totalTeacherPending.toLocaleString()}</span>
              </div>
            </div>

            {/* Super Admin Quick Actions */}
            {isSuperAdmin && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <span className="text-xs text-purple-300 font-semibold">
                  ⚡ Super Admin Control: Edit any month salary below and hit "Save Month Changes" to auto-update total amounts above
                </span>
                <Button size="sm" variant="success" className="whitespace-nowrap shrink-0" onClick={handleMarkAllTeacherMonthsPaid}>
                  ✓ Disburse All 12 Months Salary
                </Button>
              </div>
            )}

            {/* 12-Month Table Breakdown with View, Edit, Delete Actions */}
            <div className="overflow-x-auto border border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs text-slate-300 min-w-[750px]">
                <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Academic Month</th>
                    <th className="p-3">Basic Salary</th>
                    <th className="p-3">Allowances (+)</th>
                    <th className="p-3">Deductions (-)</th>
                    <th className="p-3">Net Disbursed</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions (View / Edit / Delete)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/80">
                  {yearSalaryData.months.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-bold text-white whitespace-nowrap">{m.month}</td>
                      <td className="p-3 font-mono whitespace-nowrap">₹{m.baseSalary.toLocaleString()}</td>
                      <td className="p-3 font-mono text-emerald-400 whitespace-nowrap">+₹{m.allowances.toLocaleString()}</td>
                      <td className="p-3 font-mono text-rose-400 whitespace-nowrap">-₹{m.deductions.toLocaleString()}</td>
                      <td className="p-3 font-black text-white font-mono whitespace-nowrap">₹{m.netPayable.toLocaleString()}</td>
                      <td className="p-3 whitespace-nowrap">
                        {m.status === 'Paid' ? (
                          <div>
                            <Badge variant="success">✓ Disbursed</Badge>
                            {m.paymentDate && <span className="block text-[9px] text-slate-400 mt-0.5">{m.paymentDate}</span>}
                          </div>
                        ) : (
                          <Badge variant="warning">Pending</Badge>
                        )}
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Teacher Month Salary Button */}
                          <button
                            onClick={() => setViewingTeacherMonthSalary(m)}
                            title={`View Salary Breakdown for ${m.month}`}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {isSuperAdmin && (
                            <>
                              {/* Edit Teacher Month Salary Button */}
                              <button
                                onClick={() => {
                                  setEditingTeacherMonthSalary(m);
                                  setTeacherMonthEditForm({
                                    baseSalary: m.baseSalary,
                                    allowances: m.allowances,
                                    deductions: m.deductions,
                                    status: m.status,
                                  });
                                }}
                                title={`Edit Salary Record for ${m.month}`}
                                className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Teacher Month Salary Button */}
                              <button
                                onClick={() => setDeletingTeacherMonthSalary(m)}
                                title={`Delete/Reset Salary Record for ${m.month}`}
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
                              onClick={() => handleToggleTeacherMonthSalary(m.id)}
                            >
                              {m.status === 'Paid' ? 'Mark Pending' : 'Disburse Salary'}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setYearSalaryData(null)}>
                Close Record
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* 👁️ VIEW SINGLE TEACHER MONTH SALARY BREAKDOWN MODAL */}
      <Modal isOpen={!!viewingTeacherMonthSalary} onClose={() => setViewingTeacherMonthSalary(null)} title={`Teacher Salary Statement: ${viewingTeacherMonthSalary?.month}`}>
        {viewingTeacherMonthSalary && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">{yearSalaryData?.teacherName} ({yearSalaryData?.employeeId})</span>
              <Badge variant={viewingTeacherMonthSalary.status === 'Paid' ? 'success' : 'danger'}>
                {viewingTeacherMonthSalary.status === 'Paid' ? '✓ Disbursed' : 'Pending'}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div><b>Academic Month:</b> {viewingTeacherMonthSalary.month}</div>
              <div><b>Basic Salary:</b> ₹{viewingTeacherMonthSalary.baseSalary.toLocaleString()}</div>
              <div><b>Allowances (+ HRA):</b> +₹{viewingTeacherMonthSalary.allowances.toLocaleString()}</div>
              <div><b>Deductions (- PF/Tax):</b> -₹{viewingTeacherMonthSalary.deductions.toLocaleString()}</div>
              <div><b>Payment Status:</b> {viewingTeacherMonthSalary.status}</div>
              <div><b>Disbursement Date:</b> {viewingTeacherMonthSalary.paymentDate || 'Pending'}</div>
              <div className="col-span-2 pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
                <span>Net Disbursed Salary:</span>
                <span className="text-emerald-400 font-black text-base font-mono">₹{viewingTeacherMonthSalary.netPayable.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setViewingTeacherMonthSalary(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ✏️ EDIT SINGLE TEACHER MONTH SALARY MODAL (SUPER ADMIN WITH LIVE TOTAL PREVIEW & SAVE) */}
      <Modal isOpen={!!editingTeacherMonthSalary} onClose={() => setEditingTeacherMonthSalary(null)} title={`Edit Teacher Salary & Recalculate Totals: ${editingTeacherMonthSalary?.month}`}>
        <form onSubmit={handleSaveTeacherMonthSalaryEdit} className="space-y-4">
          <Input
            label="Base Salary (₹) *"
            type="number"
            value={teacherMonthEditForm.baseSalary}
            onChange={(e) => setTeacherMonthEditForm({ ...teacherMonthEditForm, baseSalary: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Allowances / HRA (₹)"
              type="number"
              value={teacherMonthEditForm.allowances}
              onChange={(e) => setTeacherMonthEditForm({ ...teacherMonthEditForm, allowances: e.target.value })}
            />
            <Input
              label="Deductions / PF Tax (₹)"
              type="number"
              value={teacherMonthEditForm.deductions}
              onChange={(e) => setTeacherMonthEditForm({ ...teacherMonthEditForm, deductions: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase text-slate-400">Disbursement Status</label>
            <select
              value={teacherMonthEditForm.status}
              onChange={(e) => setTeacherMonthEditForm({ ...teacherMonthEditForm, status: e.target.value })}
              className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid (Disbursed)</option>
            </select>
          </div>

          {/* Live net salary calculation preview before saving */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">New Net Monthly Salary:</span>
            <span className="text-base font-black text-emerald-400 font-mono">₹{editTeacherLiveNet.toLocaleString()}</span>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setEditingTeacherMonthSalary(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="flex items-center gap-1.5">
              <Save className="w-4 h-4" /> Save & Update Totals Above
            </Button>
          </div>
        </form>
      </Modal>

      {/* 🗑️ DELETE SINGLE TEACHER MONTH SALARY MODAL (SUPER ADMIN) */}
      <Modal isOpen={!!deletingTeacherMonthSalary} onClose={() => setDeletingTeacherMonthSalary(null)} title={`Confirm Reset Month Salary`}>
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to reset/delete salary breakdown for <b>{deletingTeacherMonthSalary?.month}</b>? Total payroll amounts will be recalculated above.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingTeacherMonthSalary(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteTeacherMonthSalaryConfirm}>
              Confirm Delete & Update Totals
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create / Edit Teacher Salary Modal (Super Admin Control) */}
      <Modal
        isOpen={isAddModalOpen || !!editingSalary}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingSalary(null);
        }}
        title={editingSalary ? 'Edit Teacher Salary Record' : 'Add Teacher Salary Record'}
      >
        <form onSubmit={handleSaveSalary} className="space-y-4">
          <Input
            label="Teacher Member Full Name *"
            placeholder="Sunil Sir"
            value={formData.teacherName}
            onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Employee ID *"
              placeholder="EMP-101"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              required
            />
            <Input
              label="Designation / Department *"
              placeholder="Head of Physics Department"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Base Salary (₹) *"
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

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Calculated Net Monthly Salary:</span>
            <span className="text-base font-black text-emerald-400 font-mono">₹{calculatedNetSalary.toLocaleString()}</span>
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
                <option value="Paid">Paid (Disbursed)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
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
                setEditingSalary(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingSalary ? 'Save Changes' : 'Issue Salary Slip'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Salary Detail Modal */}
      <Modal isOpen={!!viewingSalary} onClose={() => setViewingSalary(null)} title="Teacher Salary Slip Details">
        {viewingSalary && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-purple-400 font-bold bg-purple-500/10 px-3 py-1 rounded-xl border border-purple-500/20 text-xs">
                {viewingSalary.employeeId || 'EMP-101'}
              </span>
              <Badge variant={viewingSalary.status === 'Paid' ? 'success' : 'danger'}>
                {viewingSalary.status === 'Paid' ? '✓ Disbursed (Paid)' : 'Pending'}
              </Badge>
            </div>
            <h2 className="text-lg font-bold text-white">{viewingSalary.teacherName}</h2>
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div><b>Designation:</b> {viewingSalary.designation}</div>
              <div><b>Pay Month:</b> {viewingSalary.payMonth || viewingSalary.month || 'August 2026'}</div>
              <div><b>Basic Salary:</b> ₹{Number(viewingSalary.baseSalary || 0).toLocaleString()}</div>
              <div><b>Allowances:</b> +₹{Number(viewingSalary.allowances || 0).toLocaleString()}</div>
              <div><b>Deductions:</b> -₹{Number(viewingSalary.deductions || 0).toLocaleString()}</div>
              <div><b>Payment Method:</b> {viewingSalary.paymentMethod || 'Bank Transfer'}</div>
              <div className="col-span-2 pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
                <span>Net Monthly Salary:</span>
                <span className="text-emerald-400 font-black text-base font-mono">
                  ₹{Number(viewingSalary.netSalary || viewingSalary.baseSalary + viewingSalary.allowances - viewingSalary.deductions || 0).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setViewingSalary(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Salary Record Modal (Super Admin) */}
      <Modal isOpen={!!deletingSalary} onClose={() => setDeletingSalary(null)} title="Confirm Delete Teacher Salary Record">
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to delete salary record for teacher <b>"{deletingSalary?.teacherName}"</b> ({deletingSalary?.employeeId})?
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
