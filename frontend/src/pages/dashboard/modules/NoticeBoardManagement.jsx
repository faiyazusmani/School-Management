import React, { useEffect, useState } from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { noticeAPI } from '../../../services/api';
import { toast } from '../../../components/ui/toast';
import { Eye, Edit3, Trash2, Send, XCircle } from 'lucide-react';

export const NoticeBoardManagement = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [viewingNotice, setViewingNotice] = useState(null);
  const [deletingNotice, setDeletingNotice] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    noticeType: 'General',
    category: 'General',
    targetAudience: 'all',
    priority: 'Medium',
    status: 'Published',
    expiryDate: '',
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await noticeAPI.getAll();
      if (res.success && res.data) {
        setNotices(res.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotice = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    try {
      if (editingNotice) {
        try {
          await noticeAPI.update(editingNotice._id || editingNotice.id, formData);
        } catch (e) {}
        setNotices((prev) =>
          prev.map((n) => ((n._id || n.id) === (editingNotice._id || editingNotice.id) ? { ...n, ...formData } : n))
        );
        toast.success('Notice updated successfully!');
        setEditingNotice(null);
      } else {
        let newNotice = {
          _id: `n_${Date.now()}`,
          id: `n_${Date.now()}`,
          ...formData,
          postedBy: 'Super Admin',
          date: new Date().toISOString().split('T')[0],
        };
        try {
          const res = await noticeAPI.create({
            ...formData,
            postedBy: 'Super Admin',
            date: new Date().toISOString().split('T')[0],
          });
          if (res && res.data) newNotice = res.data;
        } catch (e) {}
        setNotices((prev) => [newNotice, ...prev]);
        toast.success('Notice published successfully!');
        setIsAddModalOpen(false);
      }
      resetForm();
    } catch (err) {
      toast.error(err.message || 'Failed to save notice');
    }
  };

  const handleTogglePublish = async (notice) => {
    const newStatus = notice.status === 'Published' ? 'Unpublished' : 'Published';
    try {
      try {
        await noticeAPI.update(notice._id || notice.id, { status: newStatus });
      } catch (e) {}
      setNotices((prev) =>
        prev.map((n) => ((n._id || n.id) === (notice._id || notice.id) ? { ...n, status: newStatus } : n))
      );
      toast.success(newStatus === 'Published' ? 'Notice published successfully!' : 'Notice unpublished successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update notice status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingNotice) return;
    try {
      try {
        await noticeAPI.delete(deletingNotice._id || deletingNotice.id);
      } catch (e) {}
      setNotices((prev) => prev.filter((n) => (n._id || n.id) !== (deletingNotice._id || deletingNotice.id)));
      toast.success('Notice deleted successfully');
      setDeletingNotice(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete notice');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      noticeType: 'General',
      category: 'General',
      targetAudience: 'all',
      priority: 'Medium',
      status: 'Published',
      expiryDate: '',
    });
  };

  const columns = [
    {
      header: 'Notice Title & Details',
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-100 block">{row.title}</span>
          <span className="text-[11px] text-slate-400 line-clamp-1">{row.content}</span>
        </div>
      ),
    },
    {
      header: 'Type',
      cell: (row) => <Badge variant="purple">{row.noticeType || row.category || 'General'}</Badge>,
    },
    {
      header: 'Priority',
      cell: (row) => (
        <Badge
          variant={
            row.priority === 'Urgent' || row.priority === 'High'
              ? 'danger'
              : row.priority === 'Medium'
              ? 'warning'
              : 'outline'
          }
        >
          {row.priority || 'Medium'}
        </Badge>
      ),
    },
    {
      header: 'Target Role',
      cell: (row) => (
        <Badge variant={row.targetAudience === 'all' ? 'success' : 'outline'}>
          {Array.isArray(row.targetAudience) ? row.targetAudience.join(', ').toUpperCase() : (row.targetAudience || 'ALL').toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.status === 'Published' ? 'success' : 'danger'}>
          {row.status || 'Published'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewingNotice(row)}
            title="View Details"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleTogglePublish(row)}
            title={row.status === 'Published' ? 'Unpublish' : 'Publish'}
            className={`p-1.5 rounded-lg text-xs font-semibold ${
              row.status === 'Published'
                ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
            }`}
          >
            {row.status === 'Published' ? <XCircle className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => {
              setEditingNotice(row);
              setFormData({
                title: row.title || '',
                content: row.content || '',
                noticeType: row.noticeType || row.category || 'General',
                category: row.category || 'General',
                targetAudience: Array.isArray(row.targetAudience) ? row.targetAudience[0] || 'all' : row.targetAudience || 'all',
                priority: row.priority || 'Medium',
                status: row.status || 'Published',
                expiryDate: row.expiryDate ? row.expiryDate.split('T')[0] : '',
              });
            }}
            title="Edit Notice"
            className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeletingNotice(row)}
            title="Delete Notice"
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
      <DataTable
        title="Notice Board & Bulletin Management"
        subtitle="Publish, broadcast, and manage institutional announcements across targeted portals"
        columns={columns}
        data={notices}
        loading={loading}
        filterKey="noticeType"
        filterOptions={['General', 'Academic', 'Examination', 'Holiday', 'Fee', 'Emergency']}
        emptyStateTitle="No notices found."
        onAdd={() => {
          resetForm();
          setEditingNotice(null);
          setIsAddModalOpen(true);
        }}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingNotice}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingNotice(null);
        }}
        title={editingNotice ? 'Edit Official Notice' : 'Publish Official Notice'}
      >
        <form onSubmit={handleSaveNotice} className="space-y-4">
          <Input
            label="Notice Title *"
            placeholder="Annual Sports Day Registration Open"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Notice Type</label>
              <select
                value={formData.noticeType}
                onChange={(e) => setFormData({ ...formData, noticeType: e.target.value, category: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="General">General</option>
                <option value="Academic">Academic</option>
                <option value="Examination">Examination</option>
                <option value="Holiday">Holiday</option>
                <option value="Fee">Fee</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Target Role</label>
              <select
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="all">Everyone (All Portals)</option>
                <option value="teacher">Teachers Only</option>
                <option value="student">Students Only</option>
                <option value="parent">Parents Only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="Published">Published</option>
                <option value="Unpublished">Unpublished</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
            <Input
              label="Expiry Date"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase text-slate-400">Announcement Content *</label>
            <textarea
              rows={4}
              required
              placeholder="Detailed announcement description..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
                setEditingNotice(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingNotice ? 'Save Changes' : 'Publish Notice'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Notice Detail Modal */}
      <Modal isOpen={!!viewingNotice} onClose={() => setViewingNotice(null)} title="Official Announcement Detail">
        {viewingNotice && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="purple">{viewingNotice.noticeType || viewingNotice.category}</Badge>
              <Badge variant={viewingNotice.status === 'Published' ? 'success' : 'danger'}>
                {viewingNotice.status}
              </Badge>
            </div>
            <h2 className="text-lg font-bold text-white">{viewingNotice.title}</h2>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
              {viewingNotice.content}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
              <div>
                <b>Posted By:</b> {viewingNotice.postedBy || 'Super Admin'}
              </div>
              <div>
                <b>Priority:</b> {viewingNotice.priority || 'Medium'}
              </div>
              <div>
                <b>Target Role:</b> {Array.isArray(viewingNotice.targetAudience) ? viewingNotice.targetAudience.join(', ') : viewingNotice.targetAudience}
              </div>
              <div>
                <b>Expiry:</b> {viewingNotice.expiryDate ? viewingNotice.expiryDate.split('T')[0] : 'N/A'}
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setViewingNotice(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deletingNotice} onClose={() => setDeletingNotice(null)} title="Confirm Delete Notice">
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to delete notice <b>"{deletingNotice?.title}"</b>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingNotice(null)}>
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
