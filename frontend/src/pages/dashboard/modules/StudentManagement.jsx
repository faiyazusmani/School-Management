import React, { useEffect, useState, useRef } from 'react';
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
import { CreditCard, FileText, ExternalLink, Camera, Upload, Image as ImageIcon } from 'lucide-react';
import { compressImage, safeSetItem } from '../../../utils/imageCompressor';

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
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    gradeLevel: 'Grade 11',
    section: 'A',
    avatar: '',
  });

  const mockStudents = [
    {
      _id: 'st_1',
      id: 'st_1',
      name: 'Ankit',
      email: 'ghjhjkl@gmail.com',
      rollNumber: '23456',
      admissionNumber: 'ADM-2026-6451',
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
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    let savedLocal = [];
    try {
      savedLocal = JSON.parse(localStorage.getItem('edumanage_students') || '[]');
    } catch (e) {}

    let fetchedData = mockStudents;
    try {
      const res = await studentAPI.getAll();
      if (res.success && res.data && res.data.length > 0) {
        fetchedData = res.data;
      }
    } catch (err) {}

    const combined = [...savedLocal, ...fetchedData];
    const normalized = combined.map((s) => {
      const customAv = s.email ? localStorage.getItem(`edumanage_avatar_${s.email}`) : null;
      return {
        ...s,
        avatar: customAv || s.avatar,
      };
    });

    const unique = normalized.filter(
      (s, idx, self) => s && (s._id || s.id || s.email) && self.findIndex((x) => (x.email && s.email && x.email.toLowerCase() === s.email.toLowerCase()) || (x._id || x.id) === (s._id || s.id)) === idx
    );

    setStudents(unique);
    setLoading(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressedBase64 = await compressImage(file, 300, 300, 0.7);
      setFormData((prev) => ({ ...prev, avatar: compressedBase64 }));
      toast.success('Photo compressed! Click Save to apply.');
    }
  };

  const saveStudentsToStorage = (list) => {
    safeSetItem('edumanage_students', JSON.stringify(list));
    window.dispatchEvent(new Event('storage'));
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.rollNumber) {
      toast.error('Please complete all required fields');
      return;
    }

    try {
      const compressedAvatar = formData.avatar ? await compressImage(formData.avatar, 300, 300, 0.7) : formData.avatar;
      const finalFormData = { ...formData, avatar: compressedAvatar };

      if (finalFormData.avatar && finalFormData.email) {
        safeSetItem(`edumanage_avatar_${finalFormData.email}`, finalFormData.avatar);
      }

      let updatedList = [];
      if (editingStudent) {
        try {
          await studentAPI.update(editingStudent._id || editingStudent.id, finalFormData);
        } catch (e) {}

        updatedList = students.map((s) =>
          (s._id || s.id) === (editingStudent._id || editingStudent.id) ? { ...s, ...finalFormData } : s
        );
        setStudents(updatedList);
        saveStudentsToStorage(updatedList);
        toast.success('Student profile & photo updated successfully.');
        setEditingStudent(null);
      } else {
        let newSt = {
          _id: `st_${Date.now()}`,
          id: `st_${Date.now()}`,
          admissionNumber: `ADM-2026-${Math.floor(Math.random() * 899 + 100)}`,
          attendanceRate: 100,
          pendingFees: 0,
          status: 'active',
          avatar: finalFormData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(finalFormData.name)}&background=6366f1&color=fff&size=200`,
          ...finalFormData,
        };
        try {
          const res = await studentAPI.create(finalFormData);
          if (res && res.data) newSt = { ...newSt, ...res.data };
        } catch (e) {}

        updatedList = [newSt, ...students];
        setStudents(updatedList);
        saveStudentsToStorage(updatedList);

        // Save to registered profiles for dashboard search & feed
        try {
          const profiles = JSON.parse(localStorage.getItem('edumanage_registered_profiles') || '[]');
          const updatedProfiles = [{ ...newSt, role: 'student' }, ...profiles];
          safeSetItem('edumanage_registered_profiles', JSON.stringify(updatedProfiles));
          window.dispatchEvent(new Event('storage'));
        } catch (e) {}

        toast.success(`Student ${finalFormData.name} registered & photo saved`);
        setIsAddModalOpen(false);
      }
      setFormData({ name: '', email: '', rollNumber: '', gradeLevel: 'Grade 11', section: 'A', avatar: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to save student record');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStudent) return;
    try {
      try {
        await studentAPI.delete(deletingStudent._id || deletingStudent.id);
      } catch (e) {}
      const updatedList = students.filter((s) => (s._id || s.id) !== (deletingStudent._id || deletingStudent.id));
      setStudents(updatedList);
      saveStudentsToStorage(updatedList);
      toast.success(`Student ${deletingStudent.name} deleted`);
      setDeletingStudent(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete student');
    }
  };

  const columns = [
    {
      header: 'Photo',
      cell: (row) => {
        const customAv = row.email ? localStorage.getItem(`edumanage_avatar_${row.email}`) : null;
        const displayAvatar = customAv || row.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=6366f1&color=fff&size=100`;
        return (
          <img
            src={displayAvatar}
            alt={row.name}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=6366f1&color=fff&size=100`;
            }}
            className="w-10 h-10 rounded-xl object-cover border border-slate-800 bg-slate-950"
          />
        );
      },
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
      header: 'Grade & Sec',
      cell: (row) => (
        <Badge variant="purple">
          {row.gradeLevel} – {row.section}
        </Badge>
      ),
    },
    {
      header: 'Attendance',
      cell: (row) => (
        <span className="font-bold text-emerald-400">
          {row.attendanceRate || 98}%
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dashboard/students/${row._id || row.id}`)}
            title="View Full Profile & Edit Photo"
          >
            View
          </Button>

          <button
            onClick={() => setIdCardStudent(row)}
            title="Print ID Card"
            className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
          >
            <CreditCard className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setReportCardStudent(row)}
            title="Generate Report Card"
            className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
          >
            <FileText className="w-3.5 h-3.5" />
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditingStudent(row);
              setFormData({
                name: row.name || '',
                email: row.email || '',
                rollNumber: row.rollNumber || '',
                gradeLevel: row.gradeLevel || 'Grade 11',
                section: row.section || 'A',
                avatar: row.avatar || '',
              });
            }}
          >
            Edit
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeletingStudent(row)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hidden File Input for Student Photo Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      <DataTable
        title="Student Roster Management"
        subtitle="Manage student enrollments, academic grades, attendance, and printable ID cards"
        columns={columns}
        data={students}
        loading={loading}
        filterKey="gradeLevel"
        filterOptions={['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']}
        emptyStateTitle="No students registered."
        onAdd={() => {
          setEditingStudent(null);
          setFormData({ name: '', email: '', rollNumber: '', gradeLevel: 'Grade 11', section: 'A', avatar: '' });
          setIsAddModalOpen(true);
        }}
      />

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingStudent}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingStudent(null);
        }}
        title={editingStudent ? 'Edit Student Details' : 'Register New Student'}
      >
        <form onSubmit={handleSaveStudent} className="space-y-4">
          <Input
            label="Full Name *"
            placeholder="Aarav Sharma"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email Address *"
            type="email"
            placeholder="aarav@student.edu"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Roll Number *"
              placeholder="101"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              required
            />
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Grade Level</label>
              <select
                value={formData.gradeLevel}
                onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="Nursery">Nursery</option>
                <option value="LKG">LKG</option>
                <option value="UKG">UKG</option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
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

          {/* Photo Upload & URL field */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase text-slate-400">Student Profile Photo</label>
            <div className="flex gap-2">
              <Input
                icon={ImageIcon}
                placeholder="Paste Image URL or click Upload"
                value={formData.avatar}
                onChange={async (e) => {
                  const val = e.target.value;
                  const compressed = await compressImage(val, 300, 300, 0.7);
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
                setEditingStudent(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingStudent ? 'Save Changes' : 'Register Student'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Student Modal */}
      <Modal
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(null)}
        title="Confirm Student Deletion"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to delete student <b>"{deletingStudent?.name}"</b>?
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

      {/* Printable ID Card Modal */}
      {idCardStudent && (
        <IDCardModal
          student={idCardStudent}
          isOpen={!!idCardStudent}
          onClose={() => setIdCardStudent(null)}
        />
      )}

      {/* Printable Report Card Modal */}
      {reportCardStudent && (
        <ReportCardModal
          student={reportCardStudent}
          isOpen={!!reportCardStudent}
          onClose={() => setReportCardStudent(null)}
        />
      )}
    </div>
  );
};
