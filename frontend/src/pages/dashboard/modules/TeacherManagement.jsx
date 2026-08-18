import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../../components/ui/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { apiCall, teacherAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { toast } from '../../../components/ui/toast';
import { ExternalLink, Camera, Upload, Image as ImageIcon } from 'lucide-react';
import { compressImage, safeSetItem } from '../../../utils/imageCompressor';

export const TeacherManagement = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [deletingTeacher, setDeletingTeacher] = useState(null);
  const { user, token } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Science & Innovation',
    designation: 'Senior Faculty',
    qualification: 'M.Sc.',
    avatar: '',
  });

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
      monthlySalary: 75000,
      paidSalaryTotal: 600000,
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
      monthlySalary: 68000,
      paidSalaryTotal: 544000,
      pendingSalaryBalance: 0,
      attendanceRate: 97.4,
      subjects: ['AP Calculus BC', 'Linear Algebra'],
      assignedClasses: ['Grade 12-B'],
      status: 'active',
    },
  ];

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    let savedLocal = [];
    try {
      savedLocal = JSON.parse(localStorage.getItem('edumanage_teachers') || '[]');
    } catch (e) {}

    let fetchedData = mockTeachers;
    try {
      const res = await teacherAPI.getAll();
      if (res.success && res.data && res.data.length > 0) {
        fetchedData = res.data;
      }
    } catch (err) {}

    const combined = [...savedLocal, ...fetchedData];
    const normalized = combined.map((t) => {
      const customAv = t.email ? localStorage.getItem(`edumanage_avatar_${t.email}`) : null;
      return {
        ...t,
        avatar: customAv || t.avatar,
      };
    });

    const unique = normalized.filter(
      (t, idx, self) => t && (t._id || t.id || t.email) && self.findIndex((x) => (x.email && t.email && x.email.toLowerCase() === t.email.toLowerCase()) || (x._id || x.id) === (t._id || t.id)) === idx
    );

    setTeachers(unique);
    setLoading(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressedBase64 = await compressImage(file, 250, 250, 0.6);
      setFormData((prev) => ({ ...prev, avatar: compressedBase64 }));
      toast.success('Faculty photo compressed & ready! Click Save to apply.');
    }
  };

  const saveTeachersToStorage = (list) => {
    safeSetItem('edumanage_teachers', JSON.stringify(list));
    window.dispatchEvent(new Event('storage'));
  };

  const handleSaveTeacher = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Please fill in name and email');
      return;
    }

    try {
      const compressedAvatar = formData.avatar ? await compressImage(formData.avatar, 250, 250, 0.6) : formData.avatar;
      const finalData = { ...formData, avatar: compressedAvatar };

      if (finalData.avatar && finalData.email) {
        safeSetItem(`edumanage_avatar_${finalData.email}`, finalData.avatar);
      }

      let updatedList = [];
      if (editingTeacher) {
        try {
          await teacherAPI.update(editingTeacher._id || editingTeacher.id, finalData);
        } catch (e) {}

        updatedList = teachers.map((t) =>
          (t._id || t.id) === (editingTeacher._id || editingTeacher.id) ? { ...t, ...finalData } : t
        );
        setTeachers(updatedList);
        saveTeachersToStorage(updatedList);
        toast.success('Faculty profile & photo updated successfully.');
        setEditingTeacher(null);
      } else {
        let newTeacher = {
          _id: `t_${Date.now()}`,
          id: `t_${Date.now()}`,
          employeeId: `EMP-2026-${Math.floor(Math.random() * 899 + 100)}`,
          experienceYears: 5,
          attendanceRate: 99.0,
          monthlySalary: 70000,
          status: 'active',
          avatar: finalData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(finalData.name)}&background=8b5cf6&color=fff&size=200`,
          ...finalData,
        };
        try {
          const res = await teacherAPI.create(finalData);
          if (res && res.data) newTeacher = { ...newTeacher, ...res.data };
        } catch (e) {}

        updatedList = [newTeacher, ...teachers];
        setTeachers(updatedList);
        saveTeachersToStorage(updatedList);

        // Save to registered profiles for dashboard search & feed
        try {
          const profiles = JSON.parse(localStorage.getItem('edumanage_registered_profiles') || '[]');
          const updatedProfiles = [{ ...newTeacher, role: 'teacher' }, ...profiles];
          safeSetItem('edumanage_registered_profiles', JSON.stringify(updatedProfiles));
          window.dispatchEvent(new Event('storage'));
        } catch (e) {}

        toast.success(`Faculty member ${finalData.name} registered & photo saved`);
        setIsAddModalOpen(false);
      }
      setFormData({ name: '', email: '', department: 'Science & Innovation', designation: 'Senior Faculty', qualification: 'M.Sc.', avatar: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to save teacher record');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTeacher) return;
    try {
      try {
        await teacherAPI.delete(deletingTeacher._id || deletingTeacher.id);
      } catch (e) {}
      const updatedList = teachers.filter((t) => (t._id || t.id) !== (deletingTeacher._id || deletingTeacher.id));
      setTeachers(updatedList);
      saveTeachersToStorage(updatedList);
      toast.success(`Teacher ${deletingTeacher.name} deleted`);
      setDeletingTeacher(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete teacher');
    }
  };

  const columns = [
    {
      header: 'Photo',
      cell: (row) => {
        const customAv = row.email ? localStorage.getItem(`edumanage_avatar_${row.email}`) : null;
        const displayAvatar = customAv || row.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=8b5cf6&color=fff&size=100`;
        return (
          <img
            src={displayAvatar}
            alt={row.name}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=8b5cf6&color=fff&size=100`;
            }}
            className="w-10 h-10 rounded-xl object-cover border border-slate-800 bg-slate-950"
          />
        );
      },
    },
    {
      header: 'Teacher Name',
      cell: (row) => (
        <div
          onClick={() => navigate(`/dashboard/teachers/${row._id || row.id}`)}
          className="cursor-pointer group text-left"
        >
          <span className="font-bold text-slate-100 group-hover:text-purple-400 flex items-center gap-1.5 transition-colors">
            {row.name} <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-purple-400" />
          </span>
          <span className="text-[11px] text-slate-400 block">{row.email}</span>
        </div>
      ),
    },
    {
      header: 'Employee ID',
      cell: (row) => (
        <span className="font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded font-bold">
          {row.employeeId || 'EMP-001'}
        </span>
      ),
    },
    {
      header: 'Department',
      cell: (row) => <Badge variant="purple">{row.department}</Badge>,
    },
    {
      header: 'Designation',
      accessor: 'designation',
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dashboard/teachers/${row._id || row.id}`)}
            title="View Faculty Profile & Edit Photo"
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditingTeacher(row);
              setFormData({
                name: row.name || '',
                email: row.email || '',
                department: row.department || 'Science & Innovation',
                designation: row.designation || 'Senior Faculty',
                qualification: row.qualification || 'M.Sc.',
                avatar: row.avatar || '',
              });
            }}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeletingTeacher(row)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hidden File Input for Faculty Photo Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      <DataTable
        title="Teacher & Faculty Management"
        subtitle="Manage faculty credentials, academic departments, assigned classes, and payroll records"
        columns={columns}
        data={teachers}
        loading={loading}
        filterKey="department"
        filterOptions={['Science & Innovation', 'Mathematics', 'Humanities', 'Technology']}
        emptyStateTitle="No faculty members registered."
        onAdd={() => {
          setEditingTeacher(null);
          setFormData({ name: '', email: '', department: 'Science & Innovation', designation: 'Senior Faculty', qualification: 'M.Sc.', avatar: '' });
          setIsAddModalOpen(true);
        }}
      />

      {/* Add / Edit Teacher Modal */}
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
            label="Full Name *"
            placeholder="Dr. Sarah Connor"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email Address *"
            type="email"
            placeholder="sarah.connor@edumanage.com"
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
                <option value="Commerce & Management">Commerce & Management</option>
              </select>
            </div>
            <Input
              label="Designation"
              placeholder="Head of Physics Department"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            />
          </div>

          {/* Photo Upload & URL field */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase text-slate-400">Faculty Profile Photo</label>
            <div className="flex gap-2">
              <Input
                icon={ImageIcon}
                placeholder="Paste Image URL or click Upload"
                value={formData.avatar}
                onChange={async (e) => {
                  const val = e.target.value;
                  const compressed = await compressImage(val, 250, 250, 0.6);
                  setFormData({ ...formData, avatar: compressed });
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" /> Upload File
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingTeacher(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingTeacher ? 'Save Changes' : 'Register Faculty Member'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Teacher Modal */}
      <Modal
        isOpen={!!deletingTeacher}
        onClose={() => setDeletingTeacher(null)}
        title="Confirm Teacher Deletion"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to delete teacher <b>"{deletingTeacher?.name}"</b>?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingTeacher(null)}>
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
