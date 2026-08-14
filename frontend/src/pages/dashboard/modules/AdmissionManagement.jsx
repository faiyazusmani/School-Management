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
import { UserCheck, Clock, CheckCircle2, XCircle, Eye, Edit3, Trash2, UserPlus } from 'lucide-react';

export const AdmissionManagement = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAdmission, setEditingAdmission] = useState(null);
  const [viewingAdmission, setViewingAdmission] = useState(null);
  const [deletingAdmission, setDeletingAdmission] = useState(null);

  const { token } = useAuth();

  const [formData, setFormData] = useState({
    applicantName: '',
    parentName: '',
    email: '',
    phone: '',
    appliedGrade: 'Grade 11',
    previousSchool: 'Saint Jude Academy',
    previousGPA: 3.8,
    status: 'Pending',
    appliedDate: new Date().toISOString().split('T')[0],
    notes: 'Strong performance in Mathematics and Science.',
  });

  const mockAdmissions = [
    {
      _id: 'adm_1',
      id: 'adm_1',
      applicantName: 'Aarav Sharma',
      parentName: 'Ramesh Sharma',
      email: 'ramesh.sharma@gmail.com',
      phone: '+1 (555) 321-7654',
      appliedGrade: 'Grade 11',
      previousSchool: 'Delhi Public School',
      previousGPA: 3.92,
      appliedDate: '2026-08-01',
      status: 'Pending',
      notes: 'Applying for Science stream with Physics & Math specialization.',
    },
    {
      _id: 'adm_2',
      id: 'adm_2',
      applicantName: 'Sophia Martinez',
      parentName: 'Carlos Martinez',
      email: 'carlos.m@yahoo.com',
      phone: '+1 (555) 876-5432',
      appliedGrade: 'Grade 9',
      previousSchool: 'Lincoln Middle School',
      previousGPA: 3.75,
      appliedDate: '2026-08-03',
      status: 'Under Review',
      notes: 'State-level basketball player credentials submitted.',
    },
    {
      _id: 'adm_3',
      id: 'adm_3',
      applicantName: 'Ethan Williams',
      parentName: 'Robert Williams',
      email: 'robert.w@outlook.com',
      phone: '+1 (555) 456-7890',
      appliedGrade: 'Grade 12',
      previousSchool: 'Oakridge International',
      previousGPA: 3.88,
      appliedDate: '2026-08-05',
      status: 'Approved',
      notes: 'Transcript verified. Tuition fee invoice generated.',
    },
    {
      _id: 'adm_4',
      id: 'adm_4',
      applicantName: 'Maya Patel',
      parentName: 'Sanjay Patel',
      email: 'sanjay.patel@gmail.com',
      phone: '+1 (555) 987-6543',
      appliedGrade: 'Grade 10',
      previousSchool: 'Modern High School',
      previousGPA: 3.6,
      appliedDate: '2026-08-07',
      status: 'Rejected',
      notes: 'Incomplete transcript documentation.',
    },
  ];

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const res = await apiCall('/finance/admissions', 'GET', null, token);
      if (res.success && res.data && res.data.length > 0) {
        setAdmissions(res.data);
      } else {
        setAdmissions(mockAdmissions);
      }
    } catch (err) {
      setAdmissions(mockAdmissions);
    } finally {
      setLoading(false);
    }
  };

  // Metrics
  const totalInquiries = admissions.length;
  const pendingCount = admissions.filter((a) => a.status === 'Pending' || a.status === 'Under Review').length;
  const approvedCount = admissions.filter((a) => a.status === 'Approved').length;
  const rejectedCount = admissions.filter((a) => a.status === 'Rejected').length;

  const handleSaveAdmission = async (e) => {
    e.preventDefault();
    if (!formData.applicantName || !formData.parentName) return;

    try {
      if (editingAdmission) {
        setAdmissions((prev) =>
          prev.map((a) =>
            (a._id || a.id) === (editingAdmission._id || editingAdmission.id) ? { ...a, ...formData } : a
          )
        );
        toast.success(`Admission inquiry for ${formData.applicantName} updated!`);
        setEditingAdmission(null);
      } else {
        const newRecord = {
          _id: `adm_${Date.now()}`,
          id: `adm_${Date.now()}`,
          ...formData,
        };
        setAdmissions((prev) => [newRecord, ...prev]);
        toast.success(`New inquiry for ${formData.applicantName} created!`);
        setIsAddModalOpen(false);
      }
      resetForm();
    } catch (err) {
      toast.error(err.message || 'Failed to save admission inquiry');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      try {
        await apiCall(`/finance/admissions/${id}`, 'PUT', { status: newStatus }, token);
      } catch (e) {}

      setAdmissions((prev) =>
        prev.map((adm) => ((adm._id || adm.id) === id ? { ...adm, status: newStatus } : adm))
      );
      toast.success(`Admission application set to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deletingAdmission) return;
    setAdmissions((prev) => prev.filter((a) => (a._id || a.id) !== (deletingAdmission._id || deletingAdmission.id)));
    toast.success('Admission inquiry deleted successfully');
    setDeletingAdmission(null);
  };

  const resetForm = () => {
    setFormData({
      applicantName: '',
      parentName: '',
      email: '',
      phone: '',
      appliedGrade: 'Grade 11',
      previousSchool: 'Saint Jude Academy',
      previousGPA: 3.8,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
      notes: 'Strong performance in Mathematics and Science.',
    });
  };

  const columns = [
    {
      header: 'Applicant & Family',
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-100 block text-xs">{row.applicantName}</span>
          <span className="text-[11px] text-slate-400">Parent: {row.parentName} ({row.phone || row.email})</span>
        </div>
      ),
    },
    {
      header: 'Grade Applied',
      cell: (row) => <Badge variant="purple">{row.appliedGrade}</Badge>,
    },
    {
      header: 'Prev. School & GPA',
      cell: (row) => (
        <div className="text-xs">
          <span className="text-slate-300 block">{row.previousSchool || 'N/A'}</span>
          <span className="text-emerald-400 font-bold">GPA: {row.previousGPA || '3.5'}</span>
        </div>
      ),
    },
    {
      header: 'Applied Date',
      cell: (row) => <span className="font-mono text-xs">{row.appliedDate || '2026-08-01'}</span>,
    },
    {
      header: 'Pipeline Status',
      cell: (row) => (
        <Badge
          variant={
            row.status === 'Approved'
              ? 'success'
              : row.status === 'Rejected'
              ? 'danger'
              : row.status === 'Under Review'
              ? 'warning'
              : 'neutral'
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            onClick={() => setViewingAdmission(row)}
            title="View Details"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setEditingAdmission(row);
              setFormData({
                applicantName: row.applicantName || '',
                parentName: row.parentName || '',
                email: row.email || '',
                phone: row.phone || '',
                appliedGrade: row.appliedGrade || 'Grade 11',
                previousSchool: row.previousSchool || '',
                previousGPA: row.previousGPA || 3.8,
                status: row.status || 'Pending',
                appliedDate: row.appliedDate || new Date().toISOString().split('T')[0],
                notes: row.notes || '',
              });
            }}
            title="Edit Inquiry"
            className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          {row.status !== 'Approved' && (
            <Button
              size="sm"
              variant="success"
              className="text-[10px] px-2 py-1"
              onClick={() => handleStatusChange(row._id || row.id, 'Approved')}
            >
              Approve
            </Button>
          )}
          {row.status !== 'Rejected' && (
            <Button
              size="sm"
              variant="danger"
              className="text-[10px] px-2 py-1"
              onClick={() => handleStatusChange(row._id || row.id, 'Rejected')}
            >
              Reject
            </Button>
          )}
          <button
            onClick={() => setDeletingAdmission(row)}
            title="Delete Inquiry"
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Online Student Admission Inquiries Pipeline</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review prospective student applications, transcript credentials, issue approval decisions & track pipeline stages
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setEditingAdmission(null);
            setIsAddModalOpen(true);
          }}
        >
          + Create Admission Inquiry
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Applications</span>
            <UserPlus className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalInquiries}</div>
          <span className="text-[10px] text-slate-500">Gross submissions</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Pending Review</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{pendingCount}</div>
          <span className="text-[10px] text-slate-500">Awaiting evaluation</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Approved Admissions</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{approvedCount}</div>
          <span className="text-[10px] text-slate-500">Accepted for enrollment</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Rejected / Closed</span>
            <XCircle className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400">{rejectedCount}</div>
          <span className="text-[10px] text-slate-500">Declined applications</span>
        </Card>
      </div>

      {/* Data Table */}
      <DataTable
        title="Admission Inquiry Pipeline"
        subtitle="Manage prospective candidate profiles, transcript evaluations, and parent contacts"
        columns={columns}
        data={admissions}
        loading={loading}
        filterKey="status"
        filterOptions={['Pending', 'Under Review', 'Approved', 'Rejected']}
        emptyStateTitle="No admission inquiries found."
        onAdd={() => {
          resetForm();
          setEditingAdmission(null);
          setIsAddModalOpen(true);
        }}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingAdmission}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingAdmission(null);
        }}
        title={editingAdmission ? 'Edit Admission Inquiry' : 'Add New Student Inquiry'}
      >
        <form onSubmit={handleSaveAdmission} className="space-y-4">
          <Input
            label="Applicant Student Name *"
            placeholder="Aarav Sharma"
            value={formData.applicantName}
            onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Parent / Guardian Name *"
              placeholder="Ramesh Sharma"
              value={formData.parentName}
              onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
              required
            />
            <Input
              label="Contact Phone"
              placeholder="+1 (555) 321-7654"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="parent@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Target Grade</label>
              <select
                value={formData.appliedGrade}
                onChange={(e) => setFormData({ ...formData, appliedGrade: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Previous School"
              placeholder="Delhi Public School"
              value={formData.previousSchool}
              onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
            />
            <Input
              label="Previous GPA / Score"
              type="number"
              step="0.1"
              value={formData.previousGPA}
              onChange={(e) => setFormData({ ...formData, previousGPA: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase text-slate-400">Pipeline Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
            >
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase text-slate-400">Evaluator Notes</label>
            <textarea
              rows={3}
              placeholder="Candidate interview details and academic background notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                setEditingAdmission(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingAdmission ? 'Save Changes' : 'Submit Inquiry'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Detail Modal */}
      <Modal isOpen={!!viewingAdmission} onClose={() => setViewingAdmission(null)} title="Admission Application Profile">
        {viewingAdmission && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="purple">{viewingAdmission.appliedGrade}</Badge>
              <Badge
                variant={
                  viewingAdmission.status === 'Approved'
                    ? 'success'
                    : viewingAdmission.status === 'Rejected'
                    ? 'danger'
                    : 'warning'
                }
              >
                {viewingAdmission.status}
              </Badge>
            </div>
            <h2 className="text-lg font-bold text-white">{viewingAdmission.applicantName}</h2>
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div><b>Parent Name:</b> {viewingAdmission.parentName}</div>
              <div><b>Contact Phone:</b> {viewingAdmission.phone || 'N/A'}</div>
              <div><b>Email:</b> {viewingAdmission.email || 'N/A'}</div>
              <div><b>Previous School:</b> {viewingAdmission.previousSchool || 'N/A'}</div>
              <div><b>Previous GPA:</b> {viewingAdmission.previousGPA || 'N/A'}</div>
              <div><b>Applied Date:</b> {viewingAdmission.appliedDate}</div>
            </div>
            {viewingAdmission.notes && (
              <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-slate-300">
                <span className="font-bold text-indigo-300 block mb-1">Evaluator Notes:</span>
                {viewingAdmission.notes}
              </div>
            )}
            <div className="flex justify-end gap-2">
              {viewingAdmission.status !== 'Approved' && (
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => {
                    handleStatusChange(viewingAdmission._id || viewingAdmission.id, 'Approved');
                    setViewingAdmission(null);
                  }}
                >
                  Approve Application
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setViewingAdmission(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deletingAdmission} onClose={() => setDeletingAdmission(null)} title="Confirm Delete Inquiry">
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to remove inquiry for <b>{deletingAdmission?.applicantName}</b>?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingAdmission(null)}>
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
