import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../../components/ui/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { IDCardModal } from '../../../components/enterprise/IDCardModal';
import { ReportCardModal } from '../../../components/enterprise/ReportCardModal';
import { apiCall, studentAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { toast } from '../../../components/ui/toast';
import { CreditCard, FileText, ExternalLink } from 'lucide-react';

export const StudentManagement = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [idCardStudent, setIdCardStudent] = useState(null);
  const [reportCardStudent, setReportCardStudent] = useState(null);
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    gradeLevel: 'Grade 11',
    section: 'A',
  });

  const mockStudents = [
    {
      _id: 'st_1',
      id: 'st_1',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@student.edu',
      rollNumber: '101',
      admissionNumber: 'ADM-2026-101',
      gradeLevel: 'Grade 12',
      section: 'A',
      attendanceRate: 98.8,
      pendingFees: 0,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    },
    {
      _id: 'st_2',
      id: 'st_2',
      name: 'Ananya Verma',
      email: 'ananya.verma@student.edu',
      rollNumber: '102',
      admissionNumber: 'ADM-2026-102',
      gradeLevel: 'Grade 11',
      section: 'A',
      attendanceRate: 97.5,
      pendingFees: 0,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    },
    {
      _id: 'st_3',
      id: 'st_3',
      name: 'Rohan Gupta',
      email: 'rohan.gupta@student.edu',
      rollNumber: '103',
      admissionNumber: 'ADM-2026-103',
      gradeLevel: 'Grade 11',
      section: 'B',
      attendanceRate: 96.9,
      pendingFees: 18500,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    },
    {
      _id: 'st_4',
      id: 'st_4',
      name: 'Priya Patel',
      email: 'priya.patel@student.edu',
      rollNumber: '104',
      admissionNumber: 'ADM-2026-104',
      gradeLevel: 'Grade 10',
      section: 'A',
      attendanceRate: 95.4,
      pendingFees: 0,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    },
    {
      _id: 'st_5',
      id: 'st_5',
      name: 'Kabir Mehta',
      email: 'kabir.mehta@student.edu',
      rollNumber: '105',
      admissionNumber: 'ADM-2026-105',
      gradeLevel: 'Grade 12',
      section: 'B',
      attendanceRate: 94.8,
      pendingFees: 0,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    },
    {
      _id: 'st_6',
      id: 'st_6',
      name: 'Sneha Reddy',
      email: 'sneha.reddy@student.edu',
      rollNumber: '106',
      admissionNumber: 'ADM-2026-106',
      gradeLevel: 'Grade 9',
      section: 'A',
      attendanceRate: 96.5,
      pendingFees: 0,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    },
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    let savedProfiles = [];
    try {
      savedProfiles = JSON.parse(localStorage.getItem('edumanage_registered_profiles') || '[]').filter(
        (p) => p.role === 'student'
      );
    } catch (e) {}

    const loggedInStudent =
      user && (user.role === 'student' || user.email?.includes('student'))
        ? [
            {
              _id: user.id || user._id || `st_user_${Date.now()}`,
              id: user.id || user._id || `st_user_${Date.now()}`,
              name: user.name || 'Student Account',
              email: user.email || 'student@edumanage.com',
              rollNumber: user.rollNumber || '108',
              admissionNumber: user.admissionNumber || `ADM-2026-${Math.floor(Math.random() * 800 + 100)}`,
              gradeLevel: user.gradeLevel || 'Grade 11',
              section: user.section || 'A',
              attendanceRate: 98.2,
              pendingFees: 0,
              status: 'active',
              avatar: user.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
            },
          ]
        : [];

    setStudents((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const combined = [
        ...loggedInStudent,
        ...savedProfiles.map((sp) => ({
          _id: sp.id || sp._id || sp.email,
          id: sp.id || sp._id || sp.email,
          name: sp.name,
          email: sp.email,
          rollNumber: sp.rollNumber || `${Math.floor(Math.random() * 50 + 110)}`,
          admissionNumber: `ADM-2026-${Math.floor(Math.random() * 800 + 100)}`,
          gradeLevel: sp.gradeLevel || 'Grade 11',
          section: 'A',
          attendanceRate: 97.8,
          pendingFees: 0,
          status: 'active',
          avatar: sp.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
        })),
        ...safePrev,
      ];

      return combined.filter(
        (s, idx, self) => s && s.email && self.findIndex((x) => x && x.email && x.email.toLowerCase() === s.email.toLowerCase()) === idx
      );
    });
  }, [user, loading]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await studentAPI.getAll();
      if (res.success && res.data && res.data.length > 0) {
        setStudents(res.data);
      } else {
        setStudents(mockStudents);
      }
    } catch (err) {
      setStudents(mockStudents);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.rollNumber) {
      toast.error('Please complete all required fields');
      return;
    }

    try {
      if (editingStudent) {
        try {
          await studentAPI.update(editingStudent._id || editingStudent.id, formData);
        } catch (e) {}
        setStudents((prev) =>
          prev.map((s) => ((s._id || s.id) === (editingStudent._id || editingStudent.id) ? { ...s, ...formData } : s))
        );
        toast.success('Student updated successfully.');
        setEditingStudent(null);
      } else {
        let newSt = {
          _id: `st_${Date.now()}`,
          id: `st_${Date.now()}`,
          admissionNumber: `ADM-2026-${Math.floor(Math.random() * 899 + 100)}`,
          attendanceRate: 100,
          pendingFees: 0,
          status: 'active',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          ...formData,
        };
        try {
          const res = await studentAPI.create(formData);
          if (res.data) newSt = res.data;
        } catch (e) {}
        
        // Save to registered profiles for landing page sync
        try {
          const profiles = JSON.parse(localStorage.getItem('edumanage_registered_profiles') || '[]');
          const updated = [{ ...newSt, role: 'student' }, ...profiles];
          localStorage.setItem('edumanage_registered_profiles', JSON.stringify(updated));
          window.dispatchEvent(new Event('storage'));
        } catch (e) {}

        setStudents((prev) => [newSt, ...prev]);
        toast.success(`Student ${formData.name} registered successfully`);
        setIsAddModalOpen(false);
      }
      setFormData({ name: '', email: '', rollNumber: '', gradeLevel: 'Grade 11', section: 'A' });
    } catch (err) {
      toast.error(err.message || 'Failed to save student record');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStudent) return;
    try {
      await studentAPI.delete(deletingStudent._id || deletingStudent.id);
      setStudents((prev) => prev.filter((s) => (s._id || s.id) !== (deletingStudent._id || deletingStudent.id)));
      toast.success(`Student ${deletingStudent.name} deleted`);
      setDeletingStudent(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete student');
    }
  };

  const columns = [
    {
      header: 'Photo',
      cell: (row) => (
        <img
          src={row.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
          alt={row.name}
          className="w-10 h-10 rounded-xl object-cover border border-slate-800"
        />
      ),
    },
    {
      header: 'Student Name',
      cell: (row) => (
        <div
          onClick={() => navigate(`/dashboard/students/${row._id || row.id}`)}
          className="cursor-pointer group text-left"
        >
          <span className="font-bold text-slate-100 group-hover:text-indigo-400 flex items-center gap-1.5 transition-colors">
            {row.name} <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-indigo-400" />
          </span>
          <span className="text-[11px] text-slate-400 block">{row.email}</span>
        </div>
      ),
    },
    {
      header: 'Student ID',
      cell: (row) => (
        <span className="font-mono text-slate-400 text-xs">{row._id || row.id}</span>
      ),
    },
    {
      header: 'Admission #',
      accessor: 'admissionNumber',
    },
    {
      header: 'Roll #',
      cell: (row) => (
        <span className="font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded font-bold">
          #{row.rollNumber}
        </span>
      ),
    },
    {
      header: 'Class',
      accessor: 'gradeLevel',
    },
    {
      header: 'Section',
      accessor: 'section',
    },
    {
      header: 'Attendance %',
      cell: (row) => (
        <span className="font-bold text-slate-200">{row.attendanceRate || '0'}%</span>
      ),
    },
    {
      header: 'Fee Due',
      cell: (row) => (
        <span className={`font-bold ${row.pendingFees > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
          ₹{row.pendingFees || '0'}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : 'danger'}>
          {row.status || 'active'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Student Management Directory"
        subtitle="Manage student enrollments, academic profiles, and grade sections"
        columns={columns}
        data={students}
        loading={loading}
        filterKey="gradeLevel"
        filterOptions={['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']}
        emptyStateTitle="No students found."
        onAdd={() => {
          setEditingStudent(null);
          setFormData({ name: '', email: '', rollNumber: '', gradeLevel: 'Grade 11', section: 'A' });
          setIsAddModalOpen(true);
        }}
        onView={(st) => navigate(`/dashboard/students/${st._id || st.id}`)}
        onEdit={(st) => {
          setEditingStudent(st);
          setFormData({ name: st.name, email: st.email, rollNumber: st.rollNumber, gradeLevel: st.gradeLevel, section: st.section });
        }}
        onDelete={(st) => setDeletingStudent(st)}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingStudent}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingStudent(null);
        }}
        title={editingStudent ? 'Edit Student Details' : 'Enroll New Student'}
      >
        <form onSubmit={handleSaveStudent} className="space-y-4">
          <Input
            label="Student Full Name *"
            placeholder="e.g. Alex Rivera"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email Address *"
            type="email"
            placeholder="alex.r@student.edu"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Roll Number / Student ID *"
            placeholder="101"
            value={formData.rollNumber}
            onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Grade Level</label>
              <select
                value={formData.gradeLevel}
                onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Section</label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingStudent(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingStudent ? 'Save Changes' : 'Enroll Student'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(null)}
        title="Confirm Delete Student"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to remove <b>{deletingStudent?.name}</b> (Roll #{deletingStudent?.rollNumber})?
            This action will archive their record.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingStudent(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteConfirm}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* ID Card Generator Modal */}
      <IDCardModal
        isOpen={!!idCardStudent}
        onClose={() => setIdCardStudent(null)}
        student={idCardStudent}
      />

      {/* Report Card Generator Modal */}
      <ReportCardModal
        isOpen={!!reportCardStudent}
        onClose={() => setReportCardStudent(null)}
        student={reportCardStudent}
      />
    </div>
  );
};
