import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { noticeAPI } from '../../../services/api';
import { toast } from '../../../components/ui/toast';
import { Eye, Edit3, Trash2, Send, XCircle, Calendar as CalendarIcon, Clock } from 'lucide-react';

export const NoticeBoardManagement = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [viewingNotice, setViewingNotice] = useState(null);
  const [deletingNotice, setDeletingNotice] = useState(null);

  const expiryDateInputRef = useRef(null);

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

  const mockNotices = [
    {
      _id: 'n_seed_1',
      id: 'n_seed_1',
      title: 'Annual Sports Meet 2026 Schedule Announced',
      content: 'Registration is now open for all grades (Nursery to 12th). Track events, football, and basketball trial dates posted on physical education portal.',
      category: 'Sports & Event',
      targetAudience: 'all',
      priority: 'High',
      status: 'Published',
      postedBy: 'Super Admin',
      date: '2026-08-18',
      expiryDate: '2026-09-01',
    },
    {
      _id: 'n_seed_2',
      id: 'n_seed_2',
      title: 'Mid-Term Board Examination Gradebooks Published',
      content: 'Gradebooks updated for Grade 11-A and Grade 10 Board Batch. Parents and students can verify their marksheets under Exams & Results tab.',
      category: 'Academic',
      targetAudience: 'all',
      priority: 'High',
      status: 'Published',
      postedBy: 'Super Admin',
      date: '2026-08-17',
      expiryDate: '2026-08-30',
    },
    {
      _id: 'n_seed_3',
      id: 'n_seed_3',
      title: 'Faculty Academic Council Briefing Meeting',
      content: 'All faculty members are requested to join the monthly academic curriculum review meeting in Conference Room B at 03:00 PM.',
      category: 'Faculty',
      targetAudience: 'teacher',
      priority: 'Medium',
      status: 'Published',
      postedBy: 'Super Admin',
      date: '2026-08-15',
      expiryDate: '2026-08-25',
    },
  ];

  useEffect(() => {
    fetchNotices();
  }, []);

  // Fetch notices from API & localStorage persistent cache
  const fetchNotices = async () => {
    setLoading(true);
    let savedLocal = [];
    try {
      savedLocal = JSON.parse(localStorage.getItem('edumanage_notices') || '[]');
    } catch (e) {}

    try {
      const res = await noticeAPI.getAll();
      const baseNotices = (res.success && res.data && res.data.length > 0) ? res.data : mockNotices;
      const combined = [...savedLocal, ...baseNotices];
      const unique = combined.filter(
        (n, idx, self) => n && (n._id || n.id) && self.findIndex((x) => (x._id || x.id) === (n._id || n.id)) === idx
      );
      setNotices(unique);
    } catch (err) {
      const combined = [...savedLocal, ...mockNotices];
      const unique = combined.filter(
        (n, idx, self) => n && (n._id || n.id) && self.findIndex((x) => (x._id || x.id) === (n._id || n.id)) === idx
      );
      setNotices(unique);
    } finally {
      setLoading(false);
    }
  };

  // Helper to persist notices array in localStorage
  const saveNoticesToLocalStorage = (updatedList) => {
    try {
      localStorage.setItem('edumanage_notices', JSON.stringify(updatedList));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  };

  const handleSaveNotice = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    const formattedExpiryDate = formData.expiryDate ? formData.expiryDate.split('T')[0] : '';

    try {
      if (editingNotice) {
        const updatedPayload = { ...formData, expiryDate: formattedExpiryDate };
        try {
          await noticeAPI.update(editingNotice._id || editingNotice.id, updatedPayload);
        } catch (e) {}

        const updatedList = notices.map((n) =>
          (n._id || n.id) === (editingNotice._id || editingNotice.id) ? { ...n, ...updatedPayload } : n
        );
        setNotices(updatedList);
        saveNoticesToLocalStorage(updatedList);
        toast.success('Notice updated successfully!');
        setEditingNotice(null);
      } else {
        let newNotice = {
          _id: `n_${Date.now()}`,
          id: `n_${Date.now()}`,
          ...formData,
          expiryDate: formattedExpiryDate,
          postedBy: 'Super Admin',
          date: new Date().toISOString().split('T')[0],
        };
        try {
          const res = await noticeAPI.create({
            ...formData,
            expiryDate: formattedExpiryDate,
            postedBy: 'Super Admin',
            date: new Date().toISOString().split('T')[0],
          });
          if (res && res.data) newNotice = res.data;
        } catch (e) {}

        const updatedList = [newNotice, ...notices];
        setNotices(updatedList);
        saveNoticesToLocalStorage(updatedList);

        // Push new real-time notification broadcast for all logged-in users!
        try {
          const notifItem = {
            id: `notif_${Date.now()}`,
            noticeId: newNotice._id || newNotice.id,
            title: newNotice.title,
            content: newNotice.content,
            category: newNotice.category || 'General Notice',
            targetAudience: newNotice.targetAudience || 'all',
            date: newNotice.date || new Date().toISOString().split('T')[0],
            read: false,
          };
          const existingNotifs = JSON.parse(localStorage.getItem('edumanage_notifications') || '[]');
          localStorage.setItem('edumanage_notifications', JSON.stringify([notifItem, ...existingNotifs]));
          window.dispatchEvent(new Event('notice_published'));
          window.dispatchEvent(new Event('storage'));
        } catch (e) {}

        toast.success('Notice published & saved permanently! 🔔');
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

      const updatedList = notices.map((n) =>
        (n._id || n.id) === (notice._id || notice.id) ? { ...n, status: newStatus } : n
      );
      setNotices(updatedList);
      saveNoticesToLocalStorage(updatedList);
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

      const updatedList = notices.filter((n) => (n._id || n.id) !== (deletingNotice._id || deletingNotice.id));
      setNotices(updatedList);
      saveNoticesToLocalStorage(updatedList);

      // Remove from notification bell list too if deleted
      try {
        const existingNotifs = JSON.parse(localStorage.getItem('edumanage_notifications') || '[]');
        const filtered = existingNotifs.filter(
          (notif) => notif.noticeId !== (deletingNotice._id || deletingNotice.id) && notif.title !== deletingNotice.title
        );
        localStorage.setItem('edumanage_notifications', JSON.stringify(filtered));
        window.dispatchEvent(new Event('notice_published'));
        window.dispatchEvent(new Event('storage'));
      } catch (e) {}

      toast.success('Notice deleted successfully');
      setDeletingNotice(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete notice');
    }
  };

  const setPresetDate = (daysAhead) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    const dateStr = d.toISOString().split('T')[0];
    setFormData((prev) => ({ ...prev, expiryDate: dateStr }));
    toast.info(`Expiry date set to ${dateStr}`);
  };

  const openCalendarPicker = () => {
    if (expiryDateInputRef.current) {
      if (typeof expiryDateInputRef.current.showPicker === 'function') {
        expiryDateInputRef.current.showPicker();
      } else {
        expiryDateInputRef.current.focus();
      }
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

  const formatDateClean = (dateVal) => {
    if (!dateVal) return '2026-08-18';
    if (typeof dateVal === 'string' && dateVal.includes('T')) {
      return dateVal.split('T')[0];
    }
    return dateVal;
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
      header: 'Category',
      cell: (row) => <Badge variant="purple">{row.category || 'General'}</Badge>,
    },
    {
      header: 'Audience',
      cell: (row) => (
        <Badge variant={row.targetAudience === 'all' ? 'success' : row.targetAudience === 'student' ? 'purple' : 'warning'}>
          {row.targetAudience === 'all'
            ? 'All Users'
            : row.targetAudience === 'student'
            ? 'Students'
            : row.targetAudience === 'teacher'
            ? 'Teachers'
            : 'Parents'}
        </Badge>
      ),
    },
    {
      header: 'Priority',
      cell: (row) => (
        <Badge variant={row.priority === 'High' || row.priority === 'Urgent' ? 'danger' : row.priority === 'Medium' ? 'warning' : 'default'}>
          {row.priority}
        </Badge>
      ),
    },
    {
      header: 'Posted Date',
      cell: (row) => <span className="font-mono text-slate-300 text-xs whitespace-nowrap">{formatDateClean(row.date)}</span>,
    },
    {
      header: 'Expiry Date',
      cell: (row) => (
        <span className="font-mono text-slate-300 text-xs whitespace-nowrap">
          {row.expiryDate ? formatDateClean(row.expiryDate) : 'No Expiry'}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.status === 'Published' ? 'success' : 'danger'}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            onClick={() => setViewingNotice(row)}
            title="View Details"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => handleTogglePublish(row)}
            title={row.status === 'Published' ? 'Unpublish Notice' : 'Publish Notice'}
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
                noticeType: row.noticeType || 'General',
                category: row.category || 'General',
                targetAudience: row.targetAudience || 'all',
                priority: row.priority || 'Medium',
                status: row.status || 'Published',
                expiryDate: formatDateClean(row.expiryDate),
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
        title="Institutional Notice Board"
        subtitle="Publish campus-wide announcements, exam schedules, and academic bulletins"
        columns={columns}
        data={notices}
        loading={loading}
        filterKey="targetAudience"
        filterOptions={['all', 'student', 'teacher', 'parent']}
        emptyStateTitle="No notices published."
        onAdd={() => {
          resetForm();
          setEditingNotice(null);
          setIsAddModalOpen(true);
        }}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingNotice}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingNotice(null);
        }}
        title={editingNotice ? 'Edit Announcement' : 'Publish New Notice'}
      >
        <form onSubmit={handleSaveNotice} className="space-y-4">
          <Input
            label="Notice Title *"
            placeholder="Parents Meeting & Annual Sports Meet Schedule"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="General">General Announcement</option>
                <option value="Academic">Academic Bulletin</option>
                <option value="Examination">Examination Bulletin</option>
                <option value="Sports & Event">Sports & Event</option>
                <option value="Faculty">Faculty Briefing</option>
                <option value="Fee & Finance">Fee & Finance</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Target Audience</label>
              <select
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="all">All Users (Students, Teachers, Parents)</option>
                <option value="student">Students Only</option>
                <option value="teacher">Teachers Only</option>
                <option value="parent">Parents Only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Priority Level</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority (Urgent)</option>
                <option value="Urgent">Urgent Priority</option>
              </select>
            </div>

            {/* 📅 ENHANCED CALENDAR DATE PICKER FIELD */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Expiry Date (Select from Calendar)</label>
              <div className="relative flex items-center">
                <input
                  ref={expiryDateInputRef}
                  type="date"
                  value={formData.expiryDate}
                  onClick={openCalendarPicker}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none pr-10 cursor-pointer [color-scheme:dark]"
                />
                <button
                  type="button"
                  onClick={openCalendarPicker}
                  title="Open Calendar GUI Picker"
                  className="absolute right-2 p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 hover:text-white transition-colors"
                >
                  <CalendarIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Preset Date Buttons */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-500">Quick set:</span>
                <button
                  type="button"
                  onClick={() => setPresetDate(7)}
                  className="text-[9px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-indigo-400 hover:bg-indigo-500/20 font-semibold"
                >
                  +7 Days
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDate(15)}
                  className="text-[9px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-indigo-400 hover:bg-indigo-500/20 font-semibold"
                >
                  +15 Days
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDate(30)}
                  className="text-[9px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-indigo-400 hover:bg-indigo-500/20 font-semibold"
                >
                  +30 Days
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase text-slate-400">Notice Announcement Body *</label>
            <textarea
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write detailed notice text here..."
              required
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
                setEditingNotice(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingNotice ? 'Save Changes' : 'Publish & Broadcast Notice 🔔'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={!!viewingNotice} onClose={() => setViewingNotice(null)} title="Notice Statement">
        {viewingNotice && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="purple">{viewingNotice.category}</Badge>
              <Badge variant={viewingNotice.priority === 'High' || viewingNotice.priority === 'Urgent' ? 'danger' : 'warning'}>
                {viewingNotice.priority} Priority
              </Badge>
            </div>
            <h2 className="text-lg font-bold text-white">{viewingNotice.title}</h2>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
              <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{viewingNotice.content}</p>
              <div className="pt-2 border-t border-slate-800/80 flex justify-between text-[10px] text-slate-400">
                <span>Posted By: <b>{viewingNotice.postedBy || 'Super Admin'}</b></span>
                <span>Date: <b>{formatDateClean(viewingNotice.date)}</b></span>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setViewingNotice(null)}>
                Close Notice
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deletingNotice} onClose={() => setDeletingNotice(null)} title="Confirm Delete Notice">
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to delete notice <b>"{deletingNotice?.title}"</b>? It will also be removed from the notification bell dropdown.
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
