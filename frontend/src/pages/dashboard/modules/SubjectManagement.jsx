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
import { BookOpen, Award, Layers, Eye, Edit3, Trash2 } from 'lucide-react';

export const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [viewingSubject, setViewingSubject] = useState(null);
  const [deletingSubject, setDeletingSubject] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    department: 'Science',
    credits: 4,
    type: 'Core',
    description: 'Advanced theoretical and practical concepts.',
  });

  const { user, token } = useAuth();
  const isStudentOrParent = user?.role === 'student' || user?.role === 'parent';

  const mockSubjects = [
    {
      _id: 'sub_1',
      id: 'sub_1',
      code: 'PHY-301',
      name: 'Advanced Quantum Physics',
      department: 'Science & Innovation',
      credits: 4,
      type: 'Core',
      description: 'Study of wave mechanics, quantum states, and particle physics.',
    },
    {
      _id: 'sub_2',
      id: 'sub_2',
      code: 'MTH-402',
      name: 'AP Calculus BC & Linear Algebra',
      department: 'Mathematics',
      credits: 4,
      type: 'Core',
      description: 'Multivariable differential calculus, matrix theory, and vector spaces.',
    },
    {
      _id: 'sub_3',
      id: 'sub_3',
      code: 'CS-105',
      name: 'Data Structures & Algorithms in Java',
      department: 'Technology',
      credits: 3,
      type: 'Lab',
      description: 'Hands-on programming with linked lists, binary trees, dynamic programming, and complexity analysis.',
    },
    {
      _id: 'sub_4',
      id: 'sub_4',
      code: 'ENG-201',
      name: 'World Literature & Rhetoric',
      department: 'Humanities',
      credits: 3,
      type: 'Elective',
      description: 'Analysis of classical and modern world literature masterpieces.',
    },
  ];

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await apiCall('/academic/subjects', 'GET', null, token);
      if (res.success && res.data && res.data.length > 0) {
        setSubjects(res.data);
      } else {
        setSubjects(mockSubjects);
      }
    } catch (err) {
      setSubjects(mockSubjects);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSubject = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    try {
      if (editingSubject) {
        setSubjects((prev) =>
          prev.map((s) =>
            (s._id || s.id) === (editingSubject._id || editingSubject.id) ? { ...s, ...formData } : s
          )
        );
        toast.success(`Subject ${formData.name} updated successfully!`);
        setEditingSubject(null);
      } else {
        const newRecord = {
          _id: `sub_${Date.now()}`,
          id: `sub_${Date.now()}`,
          ...formData,
        };
        setSubjects((prev) => [newRecord, ...prev]);
        toast.success(`Subject ${formData.name} cataloged successfully!`);
        setIsAddModalOpen(false);
      }
      resetForm();
    } catch (err) {
      toast.error(err.message || 'Failed to save subject');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deletingSubject) return;
    setSubjects((prev) => prev.filter((s) => (s._id || s.id) !== (deletingSubject._id || deletingSubject.id)));
    toast.success('Subject removed from catalog');
    setDeletingSubject(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      department: 'Science',
      credits: 4,
      type: 'Core',
      description: 'Advanced theoretical and practical concepts.',
    });
  };

  const columns = [
    {
      header: 'Subject Code',
      cell: (row) => (
        <span className="font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 text-xs font-bold">
          {row.code}
        </span>
      ),
    },
    {
      header: 'Subject Title & Overview',
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-100 block text-xs">{row.name}</span>
          <span className="text-[11px] text-slate-400 line-clamp-1">{row.description || 'Curriculum Course'}</span>
        </div>
      ),
    },
    {
      header: 'Department',
      cell: (row) => <Badge variant="purple">{row.department || 'Science'}</Badge>,
    },
    {
      header: 'Credits',
      cell: (row) => <span className="font-semibold text-emerald-400 text-xs">{row.credits} Credits</span>,
    },
    {
      header: 'Subject Type',
      cell: (row) => <Badge variant={row.type === 'Lab' ? 'purple' : row.type === 'Elective' ? 'warning' : 'default'}>{row.type}</Badge>,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            onClick={() => setViewingSubject(row)}
            title="View Details"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setEditingSubject(row);
              setFormData({
                name: row.name || '',
                code: row.code || '',
                department: row.department || 'Science',
                credits: row.credits || 4,
                type: row.type || 'Core',
                description: row.description || '',
              });
            }}
            title="Edit Subject"
            className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeletingSubject(row)}
            title="Delete Subject"
            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const activeColumns = isStudentOrParent
    ? columns.filter((col) => col.header !== 'Actions')
    : columns;

  return (
    <div className="space-y-6">
      {/* Data Table */}
      <DataTable
        title="Subject & Curriculum Catalog"
        subtitle="Configure academic subjects, course codes, and credit hours"
        columns={activeColumns}
        data={subjects}
        loading={loading}
        filterKey="department"
        filterOptions={['Science & Innovation', 'Mathematics', 'Technology', 'Humanities']}
        emptyStateTitle="No subjects found in catalog."
        onAdd={!isStudentOrParent ? () => {
          resetForm();
          setEditingSubject(null);
          setIsAddModalOpen(true);
        } : undefined}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingSubject}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingSubject(null);
        }}
        title={editingSubject ? 'Edit Subject Details' : 'Catalog New Subject'}
      >
        <form onSubmit={handleSaveSubject} className="space-y-4">
          <Input
            label="Subject Title *"
            placeholder="Advanced Quantum Physics"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Course Code *"
              placeholder="PHY-301"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Credit Hours"
              type="number"
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
            />
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Subject Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="Core">Core</option>
                <option value="Lab">Lab</option>
                <option value="Elective">Elective</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase text-slate-400">Curriculum Syllabus Summary</label>
            <textarea
              rows={3}
              placeholder="Course description and learning objectives..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs rounded-xl p-3 bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingSubject(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingSubject ? 'Save Changes' : 'Catalog Subject'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Detail Modal */}
      <Modal isOpen={!!viewingSubject} onClose={() => setViewingSubject(null)} title="Subject Syllabus & Curriculum Profile">
        {viewingSubject && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1 rounded-xl border border-indigo-500/20 text-xs">
                {viewingSubject.code}
              </span>
              <Badge variant="purple">{viewingSubject.department}</Badge>
            </div>
            <h2 className="text-lg font-bold text-white">{viewingSubject.name}</h2>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
              <p className="leading-relaxed">{viewingSubject.description || 'Comprehensive syllabus covered in academic term.'}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
              <div><b>Credits Allocation:</b> {viewingSubject.credits} Academic Credits</div>
              <div><b>Course Type:</b> {viewingSubject.type || 'Core'}</div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setViewingSubject(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deletingSubject} onClose={() => setDeletingSubject(null)} title="Confirm Remove Subject">
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to remove <b>"{viewingSubject?.name || deletingSubject?.name}"</b> ({deletingSubject?.code}) from the curriculum catalog?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingSubject(null)}>
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
