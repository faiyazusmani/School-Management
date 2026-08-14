import React, { useEffect, useState } from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { apiCall } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { toast } from '../../../components/ui/toast';
import { BookOpen, Users, Home, Eye, Edit3, Trash2 } from 'lucide-react';

export const ClassSectionManagement = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [viewingClass, setViewingClass] = useState(null);
  const [deletingClass, setDeletingClass] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    gradeLevel: 'Grade 11',
    sections: 'A, B',
    classTeacher: 'Dr. Sarah Connor',
    room: 'Lab 204',
    totalStudents: 38,
  });

  const { token } = useAuth();

  const mockClasses = [
    {
      _id: 'c_1',
      id: 'c_1',
      name: 'Grade 11-A (Science)',
      gradeLevel: 'Grade 11',
      sections: ['A', 'B'],
      classTeacher: 'Dr. Sarah Connor',
      room: 'Science Wing - Lab 204',
      totalStudents: 38,
    },
    {
      _id: 'c_2',
      id: 'c_2',
      name: 'Grade 12-B (Mathematics)',
      gradeLevel: 'Grade 12',
      sections: ['A', 'B', 'C'],
      classTeacher: 'Prof. Marcus Vance',
      room: 'Math Building - Room 102',
      totalStudents: 42,
    },
    {
      _id: 'c_3',
      id: 'c_3',
      name: 'Grade 10-C (Humanities)',
      gradeLevel: 'Grade 10',
      sections: ['A', 'C'],
      classTeacher: 'Elena Rostova',
      room: 'Arts Hall - Room 305',
      totalStudents: 35,
    },
    {
      _id: 'c_4',
      id: 'c_4',
      name: 'Grade 9-A (Technology)',
      gradeLevel: 'Grade 9',
      sections: ['A'],
      classTeacher: 'David Chen',
      room: 'Computer Lab 1',
      totalStudents: 30,
    },
  ];

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await apiCall('/academic/classes', 'GET', null, token);
      if (res.success && res.data && res.data.length > 0) {
        setClasses(res.data);
      } else {
        setClasses(mockClasses);
      }
    } catch (err) {
      setClasses(mockClasses);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClass = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const sectionsArr = typeof formData.sections === 'string'
      ? formData.sections.split(',').map((s) => s.trim()).filter(Boolean)
      : formData.sections;

    const payload = {
      ...formData,
      sections: sectionsArr.length > 0 ? sectionsArr : ['A'],
    };

    try {
      if (editingClass) {
        setClasses((prev) =>
          prev.map((c) =>
            (c._id || c.id) === (editingClass._id || editingClass.id) ? { ...c, ...payload } : c
          )
        );
        toast.success(`Class ${formData.name} updated successfully!`);
        setEditingClass(null);
      } else {
        const newRecord = {
          _id: `c_${Date.now()}`,
          id: `c_${Date.now()}`,
          ...payload,
        };
        setClasses((prev) => [newRecord, ...prev]);
        toast.success(`Class ${formData.name} created successfully!`);
        setIsAddModalOpen(false);
      }
      resetForm();
    } catch (err) {
      toast.error(err.message || 'Failed to save class');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deletingClass) return;
    setClasses((prev) => prev.filter((c) => (c._id || c.id) !== (deletingClass._id || deletingClass.id)));
    toast.success('Class allocation removed successfully');
    setDeletingClass(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      gradeLevel: 'Grade 11',
      sections: 'A, B',
      classTeacher: 'Dr. Sarah Connor',
      room: 'Lab 204',
      totalStudents: 38,
    });
  };

  const columns = [
    {
      header: 'Class & Grade Name',
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-100 block text-xs">{row.name}</span>
          <span className="text-[10px] text-indigo-400 font-mono font-semibold">{row.gradeLevel || 'Grade Level'}</span>
        </div>
      ),
    },
    {
      header: 'Sections Allocated',
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {(Array.isArray(row.sections) ? row.sections : ['A']).map((sec, i) => (
            <Badge key={i} variant="purple">Sec {sec}</Badge>
          ))}
        </div>
      ),
    },
    {
      header: 'Class Homeroom Faculty',
      cell: (row) => <span className="font-semibold text-slate-200 text-xs">{row.classTeacher || 'Unassigned'}</span>,
    },
    {
      header: 'Assigned Room',
      cell: (row) => <span className="font-mono text-xs text-slate-300">{row.room || 'Room 101'}</span>,
    },
    {
      header: 'Enrolled Capacity',
      cell: (row) => <span className="font-bold text-emerald-400 text-xs">{row.totalStudents || 30} Students</span>,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            onClick={() => setViewingClass(row)}
            title="View Details"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setEditingClass(row);
              setFormData({
                name: row.name || '',
                gradeLevel: row.gradeLevel || 'Grade 11',
                sections: Array.isArray(row.sections) ? row.sections.join(', ') : 'A, B',
                classTeacher: row.classTeacher || 'Dr. Sarah Connor',
                room: row.room || 'Lab 204',
                totalStudents: row.totalStudents || 35,
              });
            }}
            title="Edit Class"
            className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeletingClass(row)}
            title="Delete Class"
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
      {/* Data Table */}
      <DataTable
        title="Class & Section Management"
        subtitle="Configure grade levels, assigned homeroom faculty, and section allocations"
        columns={columns}
        data={classes}
        loading={loading}
        onAdd={() => {
          resetForm();
          setEditingClass(null);
          setIsAddModalOpen(true);
        }}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingClass}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingClass(null);
        }}
        title={editingClass ? 'Edit Class Allocation' : 'Create New Class & Section'}
      >
        <form onSubmit={handleSaveClass} className="space-y-4">
          <Input
            label="Class Title Name *"
            placeholder="Grade 11-A (Science)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            <Input
              label="Allocated Sections (comma-separated)"
              placeholder="A, B, C"
              value={formData.sections}
              onChange={(e) => setFormData({ ...formData, sections: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Class Homeroom Teacher"
              placeholder="Dr. Sarah Connor"
              value={formData.classTeacher}
              onChange={(e) => setFormData({ ...formData, classTeacher: e.target.value })}
            />
            <Input
              label="Room Number / Hall"
              placeholder="Science Wing - Lab 204"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            />
          </div>

          <Input
            label="Total Enrolled Capacity"
            type="number"
            value={formData.totalStudents}
            onChange={(e) => setFormData({ ...formData, totalStudents: Number(e.target.value) })}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingClass(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingClass ? 'Save Changes' : 'Create Class'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Detail Modal */}
      <Modal isOpen={!!viewingClass} onClose={() => setViewingClass(null)} title="Classroom & Homeroom Profile">
        {viewingClass && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="purple">{viewingClass.gradeLevel || 'Grade 11'}</Badge>
              <span className="font-bold text-emerald-400 text-xs">{viewingClass.totalStudents || 35} Students Enrolled</span>
            </div>
            <h2 className="text-lg font-bold text-white">{viewingClass.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div><b>Homeroom Faculty:</b> {viewingClass.classTeacher || 'Unassigned'}</div>
              <div><b>Classroom Location:</b> {viewingClass.room || 'Room 101'}</div>
              <div className="col-span-2">
                <b>Allocated Sections:</b>{' '}
                {(Array.isArray(viewingClass.sections) ? viewingClass.sections : ['A']).join(', ')}
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setViewingClass(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deletingClass} onClose={() => setDeletingClass(null)} title="Confirm Remove Class">
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to remove class allocation for <b>"{deletingClass?.name}"</b>?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingClass(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteConfirm}>
              Confirm Remove
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
