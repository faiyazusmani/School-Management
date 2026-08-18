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
import { BookOpen, Award, Layers, Eye, Edit3, Trash2, Code, Atom, Calculator, Globe, Briefcase, Activity } from 'lucide-react';

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
    department: 'Science & Innovation',
    credits: 4,
    type: 'Core',
    description: 'Comprehensive curriculum covering theoretical and practical syllabus.',
  });

  const { user, token } = useAuth();
  const isStudentOrParent = user?.role === 'student' || user?.role === 'parent';

  const mockSubjects = [
    // Science & Innovation
    {
      _id: 'sub_1',
      id: 'sub_1',
      code: 'PHY-301',
      name: 'Advanced Quantum Physics',
      department: 'Science & Innovation',
      credits: 4,
      type: 'Core',
      description: 'Study of wave mechanics, quantum states, thermodynamic systems, and particle physics.',
    },
    {
      _id: 'sub_2',
      id: 'sub_2',
      code: 'CHE-102',
      name: 'Organic & Inorganic Chemistry',
      department: 'Science & Innovation',
      credits: 4,
      type: 'Lab',
      description: 'Chemical bonding, reaction kinetics, organic synthesis, and laboratory analytical techniques.',
    },
    {
      _id: 'sub_3',
      id: 'sub_3',
      code: 'BIO-103',
      name: 'Biology, Genetics & Biotechnology',
      department: 'Science & Innovation',
      credits: 4,
      type: 'Core',
      description: 'Cellular biology, DNA sequencing, human anatomy, ecosystems, and genetic engineering.',
    },
    {
      _id: 'sub_4',
      id: 'sub_4',
      code: 'EVS-104',
      name: 'Environmental Science & Ecology',
      department: 'Science & Innovation',
      credits: 3,
      type: 'Core',
      description: 'Climate change analysis, biodiversity preservation, renewable energy, and ecological balance.',
    },

    // Mathematics
    {
      _id: 'sub_5',
      id: 'sub_5',
      code: 'MTH-402',
      name: 'AP Calculus BC & Linear Algebra',
      department: 'Mathematics',
      credits: 4,
      type: 'Core',
      description: 'Multivariable differential calculus, matrix theory, vector spaces, and differential equations.',
    },
    {
      _id: 'sub_6',
      id: 'sub_6',
      code: 'MTH-101',
      name: 'Foundation Mathematics & Geometry',
      department: 'Mathematics',
      credits: 4,
      type: 'Core',
      description: 'Algebraic equations, coordinate geometry, trigonometry, and mathematical problem-solving.',
    },
    {
      _id: 'sub_7',
      id: 'sub_7',
      code: 'MTH-201',
      name: 'Applied Statistics & Probability',
      department: 'Mathematics',
      credits: 3,
      type: 'Core',
      description: 'Data analysis, probability distributions, statistical inference, and regression models.',
    },

    // Technology & CS
    {
      _id: 'sub_8',
      id: 'sub_8',
      code: 'CS-105',
      name: 'Data Structures & Algorithms in Java',
      department: 'Technology',
      credits: 4,
      type: 'Lab',
      description: 'Hands-on programming with linked lists, binary trees, dynamic programming, and complexity analysis.',
    },
    {
      _id: 'sub_9',
      id: 'sub_9',
      code: 'AI-201',
      name: 'Artificial Intelligence & Robotics',
      department: 'Technology',
      credits: 4,
      type: 'Lab',
      description: 'Machine learning fundamentals, neural networks, computer vision, and autonomous robotics.',
    },
    {
      _id: 'sub_10',
      id: 'sub_10',
      code: 'CS-301',
      name: 'Full Stack Web Development & Cyber Security',
      department: 'Technology',
      credits: 3,
      type: 'Lab',
      description: 'Modern Web development using React, Node.js, databases, encryption, and network security.',
    },

    // Languages & Humanities
    {
      _id: 'sub_11',
      id: 'sub_11',
      code: 'ENG-201',
      name: 'World Literature & Rhetoric',
      department: 'Humanities',
      credits: 3,
      type: 'Elective',
      description: 'Analysis of classical and modern world literature masterpieces, creative writing, and public speaking.',
    },
    {
      _id: 'sub_12',
      id: 'sub_12',
      code: 'ENG-101',
      name: 'English Language & Communication',
      department: 'Humanities',
      credits: 3,
      type: 'Core',
      description: 'Grammar mastery, essay composition, verbal communication, and critical reading skills.',
    },
    {
      _id: 'sub_13',
      id: 'sub_13',
      code: 'HIN-101',
      name: 'Hindi Language & Sahitya',
      department: 'Humanities',
      credits: 3,
      type: 'Core',
      description: 'Hindi grammar, prose, poetry, literary critique, and formal composition.',
    },
    {
      _id: 'sub_14',
      id: 'sub_14',
      code: 'SAN-101',
      name: 'Sanskrit & Cultural Heritage',
      department: 'Humanities',
      credits: 3,
      type: 'Elective',
      description: 'Classical Sanskrit grammar, Vedic literature, ancient philosophy, and shloka chanting.',
    },
    {
      _id: 'sub_15',
      id: 'sub_15',
      code: 'HIS-101',
      name: 'Indian & World History',
      department: 'Humanities',
      credits: 3,
      type: 'Core',
      description: 'Historical civilizations, Indian independence movement, world wars, and modern geopolitics.',
    },
    {
      _id: 'sub_16',
      id: 'sub_16',
      code: 'GEO-101',
      name: 'Physical Geography & Cartography',
      department: 'Humanities',
      credits: 3,
      type: 'Core',
      description: 'Earth landforms, meteorology, map reading, GIS technology, and resource distribution.',
    },

    // Commerce & Management
    {
      _id: 'sub_17',
      id: 'sub_17',
      code: 'ECO-101',
      name: 'Micro & Macro Economics',
      department: 'Commerce & Management',
      credits: 4,
      type: 'Core',
      description: 'Market demand & supply, national income accounting, banking systems, and fiscal policy.',
    },
    {
      _id: 'sub_18',
      id: 'sub_18',
      code: 'ACC-101',
      name: 'Financial Accountancy & Bookkeeping',
      department: 'Commerce & Management',
      credits: 4,
      type: 'Core',
      description: 'Double-entry bookkeeping, balance sheet preparation, ledger accounts, and audit fundamentals.',
    },
    {
      _id: 'sub_19',
      id: 'sub_19',
      code: 'BST-101',
      name: 'Business Studies & Entrepreneurship',
      department: 'Commerce & Management',
      credits: 4,
      type: 'Core',
      description: 'Corporate management principles, marketing strategies, business ethics, and startup venture design.',
    },

    // Arts & Physical Education
    {
      _id: 'sub_20',
      id: 'sub_20',
      code: 'PED-101',
      name: 'Physical Education & Sports Science',
      department: 'Arts & Sports',
      credits: 2,
      type: 'Elective',
      description: 'Kinesiology, sports nutrition, athletic training, yoga, and team tournament rules.',
    },
    {
      _id: 'sub_21',
      id: 'sub_21',
      code: 'ART-101',
      name: 'Fine Arts, Music & Performing Arts',
      department: 'Arts & Sports',
      credits: 2,
      type: 'Elective',
      description: 'Visual painting techniques, Indian classical music theory, dramatics, and instrumental practice.',
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
        toast.success(`Subject "${formData.name}" updated successfully!`);
        setEditingSubject(null);
      } else {
        const newRecord = {
          _id: `sub_${Date.now()}`,
          id: `sub_${Date.now()}`,
          ...formData,
        };
        setSubjects((prev) => [newRecord, ...prev]);
        toast.success(`Subject "${formData.name}" cataloged successfully!`);
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
      department: 'Science & Innovation',
      credits: 4,
      type: 'Core',
      description: 'Comprehensive curriculum covering theoretical and practical syllabus.',
    });
  };

  const getDepartmentBadgeVariant = (dept) => {
    switch (dept) {
      case 'Science & Innovation':
        return 'purple';
      case 'Mathematics':
        return 'indigo';
      case 'Technology':
        return 'success';
      case 'Commerce & Management':
        return 'warning';
      case 'Arts & Sports':
        return 'danger';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      header: 'Subject Code',
      cell: (row) => (
        <span className="font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 text-xs font-bold whitespace-nowrap">
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
      cell: (row) => (
        <Badge variant={getDepartmentBadgeVariant(row.department)}>
          {row.department || 'Science'}
        </Badge>
      ),
    },
    {
      header: 'Credits',
      cell: (row) => <span className="font-semibold text-emerald-400 text-xs font-mono">{row.credits} Credits</span>,
    },
    {
      header: 'Subject Type',
      cell: (row) => <Badge variant={row.type === 'Lab' ? 'purple' : row.type === 'Elective' ? 'warning' : 'default'}>{row.type}</Badge>,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5 justify-end whitespace-nowrap">
          <button
            onClick={() => setViewingSubject(row)}
            title="View Details"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {!isStudentOrParent && (
            <>
              <button
                onClick={() => {
                  setEditingSubject(row);
                  setFormData({
                    name: row.name || '',
                    code: row.code || '',
                    department: row.department || 'Science & Innovation',
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
            </>
          )}
        </div>
      ),
    },
  ];

  const activeColumns = isStudentOrParent
    ? columns.filter((col) => col.header !== 'Actions')
    : columns;

  return (
    <div className="space-y-6">
      {/* Analytics Summary Cards for Subjects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Subjects</span>
            <BookOpen className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{subjects.length} Subjects</div>
          <span className="text-[10px] text-slate-500">Across 6 academic departments</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Science & STEM</span>
            <Atom className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400">
            {subjects.filter((s) => s.department === 'Science & Innovation' || s.department === 'Technology').length} Courses
          </div>
          <span className="text-[10px] text-slate-500">Physics, Chem, Bio & Tech</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Humanities & Languages</span>
            <Globe className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {subjects.filter((s) => s.department === 'Humanities').length} Courses
          </div>
          <span className="text-[10px] text-slate-500">English, Hindi, History, Geo</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Commerce & Sports</span>
            <Briefcase className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            {subjects.filter((s) => s.department === 'Commerce & Management' || s.department === 'Arts & Sports').length} Courses
          </div>
          <span className="text-[10px] text-slate-500">Accounts, Business, PE & Arts</span>
        </Card>
      </div>

      {/* Data Table */}
      <DataTable
        title="Subject & Curriculum Catalog"
        subtitle="Configure academic subjects, course codes, credit hours, and syllabus outlines"
        columns={activeColumns}
        data={subjects}
        loading={loading}
        filterKey="department"
        filterOptions={['Science & Innovation', 'Mathematics', 'Technology', 'Humanities', 'Commerce & Management', 'Arts & Sports']}
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
            placeholder="Organic & Inorganic Chemistry"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Course Code *"
              placeholder="CHE-102"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Academic Department</label>
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
                <option value="Arts & Sports">Arts & Sports</option>
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
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter subject overview and key topics covered..."
              className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
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
      <Modal isOpen={!!viewingSubject} onClose={() => setViewingSubject(null)} title="Subject Syllabus Statement">
        {viewingSubject && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1 rounded-xl border border-indigo-500/20 text-xs">
                {viewingSubject.code}
              </span>
              <Badge variant="purple">{viewingSubject.department}</Badge>
            </div>
            <h2 className="text-lg font-bold text-white">{viewingSubject.name}</h2>
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div><b>Credit Hours:</b> {viewingSubject.credits} Credits</div>
              <div><b>Subject Classification:</b> {viewingSubject.type}</div>
              <div className="col-span-2 pt-2 border-t border-slate-800">
                <b className="block mb-1 text-slate-400">Syllabus & Course Overview:</b>
                <p className="text-slate-200 leading-relaxed">{viewingSubject.description || 'No description provided.'}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setViewingSubject(null)}>
                Close Statement
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deletingSubject} onClose={() => setDeletingSubject(null)} title="Confirm Remove Subject">
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to remove <b>"{deletingSubject?.name}"</b> ({deletingSubject?.code}) from the curriculum catalog?
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
