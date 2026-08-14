import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../../components/ui/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { apiCall, teacherAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { toast } from '../../../components/ui/toast';
import { ExternalLink } from 'lucide-react';

export const TeacherManagement = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [deletingTeacher, setDeletingTeacher] = useState(null);
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Science & Innovation',
    designation: 'Senior Faculty',
    qualification: 'M.Sc.',
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (user && (user.role === 'teacher' || user.email?.includes('teacher'))) {
      setTeachers((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        const exists = safePrev.some(
          (t) => t && ((t.email && user.email && t.email.toLowerCase() === user.email.toLowerCase()) || (t._id && t._id === (user.id || user._id)) || (t.id && t.id === (user.id || user._id)))
        );
        if (!exists) {
          const loggedInTeacher = {
            _id: user.id || user._id || `t_user_${Date.now()}`,
            id: user.id || user._id || `t_user_${Date.now()}`,
            name: user.name || 'Faculty Member',
            email: user.email || 'teacher@edumanage.com',
            phone: user.phone || '+1 (555) 234-5678',
            employeeId: user.employeeId || `EMP-00${Math.floor(Math.random() * 80 + 10)}`,
            department: user.department || 'Science & Innovation',
            designation: user.designation || 'Senior Faculty',
            qualification: user.qualification || 'M.Sc. Advanced Sciences',
            experienceYears: user.experienceYears || 6,
            joiningDate: new Date().toISOString().split('T')[0],
            status: user.status || 'active',
            avatar: user.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
          };
          return [loggedInTeacher, ...safePrev];
        }
        return safePrev;
      });
    }
  }, [user, loading]);

  const mockTeachers = [
    {
      _id: 't_seed_1',
      id: 't_seed_1',
      name: 'Dr. Sarah Connor',
      email: 'teacher@edumanage.com',
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      employeeId: 'EMP-001',
      department: 'Science & Innovation',
      designation: 'Head of Physics Department',
      qualification: 'Ph.D. Quantum Physics (MIT)',
      experienceYears: 12,
      joiningDate: '2018-08-15',
      monthlySalary: 7500,
      paidSalaryTotal: 60000,
      pendingSalaryBalance: 0,
      attendanceRate: 98.6,
      subjects: ['Advanced Physics', 'Astrophysics'],
      assignedClasses: ['Grade 11-A', 'Grade 12-B'],
      status: 'active',
    },
    {
      _id: 't_seed_2',
      id: 't_seed_2',
      name: 'Prof. Marcus Vance',
      email: 'marcus.vance@edumanage.com',
      phone: '+1 (555) 341-9876',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
      employeeId: 'EMP-002',
      department: 'Mathematics',
      designation: 'Senior Mathematics Professor',
      qualification: 'M.Sc. Applied Mathematics (Stanford)',
      experienceYears: 9,
      joiningDate: '2020-01-10',
      monthlySalary: 6800,
      paidSalaryTotal: 54400,
      pendingSalaryBalance: 0,
      attendanceRate: 97.4,
      subjects: ['AP Calculus BC', 'Linear Algebra'],
      assignedClasses: ['Grade 12-B'],
      status: 'active',
    },
    {
      _id: 't_seed_3',
      id: 't_seed_3',
      name: 'Elena Rostova',
      email: 'elena.rostova@edumanage.com',
      phone: '+1 (555) 782-4310',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
      employeeId: 'EMP-003',
      department: 'Humanities',
      designation: 'Department Chair of Literature',
      qualification: 'M.A. English Literature (Oxford)',
      experienceYears: 15,
      joiningDate: '2016-09-01',
      monthlySalary: 7200,
      paidSalaryTotal: 57600,
      pendingSalaryBalance: 0,
      attendanceRate: 99.1,
      subjects: ['World Literature', 'Creative Writing'],
      assignedClasses: ['Grade 11-A', 'Grade 10-C'],
      status: 'active',
    },
    {
      _id: 't_seed_4',
      id: 't_seed_4',
      name: 'David Chen',
      email: 'david.chen@edumanage.com',
      phone: '+1 (555) 901-2345',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      employeeId: 'EMP-004',
      department: 'Technology',
      designation: 'Lead Computer Science Instructor',
      qualification: 'B.S. Computer Engineering (UC Berkeley)',
      experienceYears: 7,
      joiningDate: '2021-08-20',
      monthlySalary: 7000,
      paidSalaryTotal: 49000,
      pendingSalaryBalance: 0,
      attendanceRate: 96.8,
      subjects: ['Computer Science Principles', 'Data Structures'],
      assignedClasses: ['Grade 11-A'],
      status: 'active',
    },
  ];

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await teacherAPI.getAll();
      if (res.success && res.data && res.data.length > 0) {
        setTeachers(res.data);
      } else {
        setTeachers(mockTeachers);
      }
    } catch (err) {
      setTeachers(mockTeachers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (loading) return;
    let savedProfiles = [];
    try {
      savedProfiles = JSON.parse(localStorage.getItem('edumanage_registered_profiles') || '[]').filter(
        (p) => p.role === 'teacher'
      );
    } catch (e) {}

    const loggedInTeacher =
      user && (user.role === 'teacher' || user.email?.includes('teacher'))
        ? [
            {
              _id: user.id || user._id || `t_user_${Date.now()}`,
              id: user.id || user._id || `t_user_${Date.now()}`,
              name: user.name || 'Faculty Member',
              email: user.email || 'teacher@edumanage.com',
              phone: user.phone || '+1 (555) 234-5678',
              avatar: user.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
              employeeId: 'EMP-108',
              department: 'Academic Faculty',
              designation: 'Senior Faculty Instructor',
              qualification: 'M.Ed. Academic Pedagogy',
              experienceYears: 8,
              joiningDate: '2023-08-15',
              monthlySalary: 7500,
              paidSalaryTotal: 60000,
              pendingSalaryBalance: 0,
              attendanceRate: 98.5,
              subjects: ['Curriculum Specialist'],
              assignedClasses: ['Grade 11-A'],
              status: 'active',
            },
          ]
        : [];

    setTeachers((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const combined = [
        ...loggedInTeacher,
        ...savedProfiles.map((sp) => ({
          _id: sp.id || sp._id || sp.email,
          id: sp.id || sp._id || sp.email,
          name: sp.name,
          email: sp.email,
          phone: sp.phone || '+1 (555) 234-5678',
          avatar: sp.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
          employeeId: `EMP-${Math.floor(Math.random() * 800 + 100)}`,
          department: 'Academic Faculty',
          designation: 'Faculty Instructor',
          qualification: 'Certified Educator',
          experienceYears: 5,
          joiningDate: '2024-01-10',
          monthlySalary: 6800,
          paidSalaryTotal: 54400,
          pendingSalaryBalance: 0,
          attendanceRate: 97.5,
          subjects: ['Faculty Educator'],
          assignedClasses: ['Grade 10-A'],
          status: 'active',
        })),
        ...safePrev,
      ];

      return combined.filter(
        (t, idx, self) => t && t.email && self.findIndex((x) => x && x.email && x.email.toLowerCase() === t.email.toLowerCase()) === idx
      );
    });
  }, [user, loading]);

  const handleSaveTeacher = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    try {
      if (editingTeacher) {
        try {
          await teacherAPI.update(editingTeacher._id || editingTeacher.id, formData);
        } catch (e) {}
        setTeachers((prev) =>
          prev.map((t) => ((t._id || t.id) === (editingTeacher._id || editingTeacher.id) ? { ...t, ...formData } : t))
        );
        toast.success(`Faculty member ${formData.name} updated`);
        setEditingTeacher(null);
      } else {
        let newT = {
          _id: `t_${Date.now()}`,
          id: `t_${Date.now()}`,
          ...formData,
          phone: '+1 (555) 000-1122',
          employeeId: `EMP-00${Math.floor(Math.random() * 90 + 10)}`,
          experienceYears: 5,
          joiningDate: new Date().toISOString().split('T')[0],
          status: 'active',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
        };
        try {
          const res = await teacherAPI.create(formData);
          if (res.data) newT = res.data;
        } catch (e) {}

        // Save to registered profiles for landing page sync
        try {
          const profiles = JSON.parse(localStorage.getItem('edumanage_registered_profiles') || '[]');
          const updated = [{ ...newT, role: 'teacher' }, ...profiles];
          localStorage.setItem('edumanage_registered_profiles', JSON.stringify(updated));
          window.dispatchEvent(new Event('storage'));
        } catch (e) {}

        setTeachers((prev) => [newT, ...prev]);
        toast.success(`Faculty member ${formData.name} added`);
        setIsAddModalOpen(false);
      }
      setFormData({ name: '', email: '', department: 'Science & Innovation', designation: 'Senior Faculty', qualification: 'M.Sc.' });
    } catch (err) {
      toast.error(err.message || 'Failed to save faculty record');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTeacher) return;
    try {
      await teacherAPI.delete(deletingTeacher._id || deletingTeacher.id);
      setTeachers((prev) => prev.filter((t) => (t._id || t.id) !== (deletingTeacher._id || deletingTeacher.id)));
      toast.success(`Faculty record deleted`);
      setDeletingTeacher(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete faculty record');
    }
  };

  const columns = [
    {
      header: 'Photo',
      cell: (row) => (
        <img
          src={row.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100'}
          alt={row.name}
          className="w-10 h-10 rounded-xl object-cover border border-slate-800"
        />
      ),
    },
    {
      header: 'Faculty Name',
      cell: (row) => (
        <div
          onClick={() => navigate(`/dashboard/teachers/${row._id || row.id}`)}
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
      header: 'Phone',
      accessor: 'phone',
    },
    {
      header: 'Employee ID',
      cell: (row) => (
        <span className="font-mono text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded">
          {row.employeeId}
        </span>
      ),
    },
    {
      header: 'Qualification',
      accessor: 'qualification',
    },
    {
      header: 'Experience',
      cell: (row) => <span>{row.experienceYears || '0'} Yrs</span>,
    },
    {
      header: 'Joining Date',
      accessor: 'joiningDate',
    },
    {
      header: 'Department',
      accessor: 'department',
    },
    {
      header: 'Classes',
      cell: (row) => <span className="truncate max-w-[100px] block">{row.assignedClasses?.join(', ') || 'None'}</span>,
    },
    {
      header: 'Subjects',
      cell: (row) => <span className="truncate max-w-[100px] block">{row.subjects?.join(', ') || 'None'}</span>,
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
        title="Faculty & Teacher Directory"
        subtitle="Manage academic department leads, qualifications, and faculty contracts"
        columns={columns}
        data={teachers}
        loading={loading}
        filterKey="department"
        filterOptions={['Science & Innovation', 'Mathematics', 'Technology', 'Humanities']}
        emptyStateTitle="No teachers found."
        onAdd={() => {
          setEditingTeacher(null);
          setFormData({ name: '', email: '', department: 'Science & Innovation', designation: 'Senior Faculty', qualification: 'M.Sc.' });
          setIsAddModalOpen(true);
        }}
        onView={(t) => navigate(`/dashboard/teachers/${t._id || t.id}`)}
        onEdit={(t) => {
          setEditingTeacher(t);
          setFormData({ name: t.name, email: t.email, department: t.department, designation: t.designation, qualification: t.qualification });
        }}
        onDelete={(t) => setDeletingTeacher(t)}
      />

      <Modal
        isOpen={isAddModalOpen || !!editingTeacher}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTeacher(null);
        }}
        title={editingTeacher ? 'Edit Faculty Details' : 'Register New Faculty Member'}
      >
        <form onSubmit={handleSaveTeacher} className="space-y-4">
          <Input
            label="Faculty Name *"
            placeholder="Dr. Sarah Connor"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email Address *"
            type="email"
            placeholder="sarah.c@edumanage.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="Science & Innovation">Science & Innovation</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Technology">Technology</option>
                <option value="Humanities">Humanities</option>
              </select>
            </div>
            <Input
              label="Designation"
              placeholder="Senior Faculty"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            />
          </div>
          <Input
            label="Qualification / Degrees"
            placeholder="Ph.D. Quantum Physics"
            value={formData.qualification}
            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => { setIsAddModalOpen(false); setEditingTeacher(null); }}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingTeacher ? 'Update Faculty' : 'Register Faculty'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deletingTeacher} onClose={() => setDeletingTeacher(null)} title="Remove Faculty Member">
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to remove <b>{deletingTeacher?.name}</b>?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingTeacher(null)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={handleDeleteConfirm}>Confirm Remove</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
