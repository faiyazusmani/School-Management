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
import { Calendar, MapPin, Eye, Edit3, Trash2, Trophy, Users, BookOpen, Clock } from 'lucide-react';

export const CalendarEventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(null);

  const { token } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Academic',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    location: 'Main Auditorium',
    organizer: 'Super Admin',
    targetAudience: 'Everyone (All Portals)',
    description: 'Annual institutional gathering and academic project exhibitions.',
    status: 'Scheduled',
  });

  const mockEvents = [
    {
      _id: 'ev_1',
      id: 'ev_1',
      title: 'Annual Science & Technology Expo 2026',
      category: 'Academic',
      startDate: '2026-08-25',
      endDate: '2026-08-26',
      location: 'Science Lab Complex & Quadrangle',
      organizer: 'Department of Science & Innovation',
      targetAudience: 'Everyone (All Portals)',
      description: 'Students present robotics, physics, and AI innovations to visiting guest evaluators.',
      status: 'Scheduled',
    },
    {
      _id: 'ev_2',
      id: 'ev_2',
      title: 'Parent-Teacher Academic Conference (Term 1)',
      category: 'Meeting',
      startDate: '2026-09-05',
      endDate: '2026-09-05',
      location: 'Main Auditorium & Classrooms',
      organizer: 'Academic Directorate',
      targetAudience: 'Parents & Teachers',
      description: 'One-on-one academic evaluation reviews and mid-term report card distribution.',
      status: 'Scheduled',
    },
    {
      _id: 'ev_3',
      id: 'ev_3',
      title: 'Inter-School Athletics & Sports Meet',
      category: 'Sports',
      startDate: '2026-09-18',
      endDate: '2026-09-20',
      location: 'Olympic Athletics Stadium',
      organizer: 'Physical Education Department',
      targetAudience: 'Students & Faculty',
      description: 'Track events, football championship finals, and basketball tournaments.',
      status: 'Scheduled',
    },
    {
      _id: 'ev_4',
      id: 'ev_4',
      title: 'Mid-Term Examination Week',
      category: 'Examination',
      startDate: '2026-10-01',
      endDate: '2026-10-10',
      location: 'All Examination Halls',
      organizer: 'Examination Board',
      targetAudience: 'Students',
      description: 'Comprehensive mid-semester term evaluation examinations.',
      status: 'Upcoming',
    },
    {
      _id: 'ev_5',
      id: 'ev_5',
      title: 'Campus Founder\'s Day & Cultural Fest',
      category: 'Cultural',
      startDate: '2026-11-14',
      endDate: '2026-11-15',
      location: 'Grand Amphitheater',
      organizer: 'Student Cultural Council',
      targetAudience: 'Everyone (All Portals)',
      description: 'Music concerts, drama plays, dance performances, and alumni networking.',
      status: 'Upcoming',
    },
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await apiCall('/communication/events', 'GET', null, token);
      if (res.success && res.data && res.data.length > 0) {
        setEvents(res.data);
      } else {
        setEvents(mockEvents);
      }
    } catch (err) {
      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  // Metrics
  const totalEvents = events.length;
  const academicEvents = events.filter((e) => e.category === 'Academic' || e.category === 'Examination').length;
  const sportsEvents = events.filter((e) => e.category === 'Sports').length;
  const meetingsCount = events.filter((e) => e.category === 'Meeting').length;

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!formData.title) return;

    try {
      if (editingEvent) {
        setEvents((prev) =>
          prev.map((ev) =>
            (ev._id || ev.id) === (editingEvent._id || editingEvent.id) ? { ...ev, ...formData } : ev
          )
        );
        toast.success(`Event "${formData.title}" updated successfully!`);
        setEditingEvent(null);
      } else {
        const newRecord = {
          _id: `ev_${Date.now()}`,
          id: `ev_${Date.now()}`,
          ...formData,
        };
        setEvents((prev) => [newRecord, ...prev]);
        toast.success(`Event "${formData.title}" scheduled!`);
        setIsAddModalOpen(false);
      }
      resetForm();
    } catch (err) {
      toast.error(err.message || 'Failed to save event');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deletingEvent) return;
    setEvents((prev) => prev.filter((ev) => (ev._id || ev.id) !== (deletingEvent._id || deletingEvent.id)));
    toast.success('Event removed from institutional calendar');
    setDeletingEvent(null);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'Academic',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      location: 'Main Auditorium',
      organizer: 'Super Admin',
      targetAudience: 'Everyone (All Portals)',
      description: 'Annual institutional gathering and academic project exhibitions.',
      status: 'Scheduled',
    });
  };

  const columns = [
    {
      header: 'Event Name & Description',
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-100 block text-xs">{row.title}</span>
          <span className="text-[11px] text-slate-400 line-clamp-1">{row.description}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      cell: (row) => <Badge variant="purple">{row.category || 'General'}</Badge>,
    },
    {
      header: 'Dates / Schedule',
      cell: (row) => (
        <span className="font-mono text-xs text-indigo-300 font-semibold block">
          {row.startDate} {row.startDate !== row.endDate && row.endDate ? `to ${row.endDate}` : ''}
        </span>
      ),
    },
    {
      header: 'Venue & Organizer',
      cell: (row) => (
        <div className="text-xs">
          <span className="text-white font-semibold flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-400" /> {row.location || 'Campus'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{row.organizer || 'Administration'}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.status === 'Scheduled' ? 'success' : 'warning'}>
          {row.status || 'Scheduled'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            onClick={() => setViewingEvent(row)}
            title="View Details"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setEditingEvent(row);
              setFormData({
                title: row.title || '',
                category: row.category || 'Academic',
                startDate: row.startDate || new Date().toISOString().split('T')[0],
                endDate: row.endDate || new Date().toISOString().split('T')[0],
                location: row.location || 'Main Auditorium',
                organizer: row.organizer || 'Super Admin',
                targetAudience: row.targetAudience || 'Everyone (All Portals)',
                description: row.description || '',
                status: row.status || 'Scheduled',
              });
            }}
            title="Edit Event"
            className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeletingEvent(row)}
            title="Delete Event"
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
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Institutional Calendar & Event Planner</h1>
          <p className="text-xs text-slate-400 mt-1">
            Schedule academic terms, sports meets, parent-teacher conferences, examination weeks & campus holidays
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setEditingEvent(null);
            setIsAddModalOpen(true);
          }}
        >
          + Add New Event
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Calendar Events</span>
            <Calendar className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalEvents}</div>
          <span className="text-[10px] text-slate-500">Scheduled for 2026</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Exams & Academic</span>
            <BookOpen className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{academicEvents}</div>
          <span className="text-[10px] text-slate-500">Tests & expos</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Sports & Athletics</span>
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{sportsEvents}</div>
          <span className="text-[10px] text-slate-500">Tournaments</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Conferences & Meetings</span>
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300">{meetingsCount}</div>
          <span className="text-[10px] text-slate-500">PTA & Board meets</span>
        </Card>
      </div>

      {/* Data Table */}
      <DataTable
        title="Institutional Calendar Directory"
        subtitle="Filter campus events by category type or search by venue locations"
        columns={columns}
        data={events}
        loading={loading}
        filterKey="category"
        filterOptions={['Academic', 'Meeting', 'Sports', 'Examination', 'Cultural', 'Holiday']}
        emptyStateTitle="No matching events found in calendar."
        onAdd={() => {
          resetForm();
          setEditingEvent(null);
          setIsAddModalOpen(true);
        }}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingEvent}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingEvent(null);
        }}
        title={editingEvent ? 'Edit Calendar Event' : 'Schedule Institutional Event'}
      >
        <form onSubmit={handleSaveEvent} className="space-y-4">
          <Input
            label="Event Title *"
            placeholder="Annual Science & Technology Expo 2026"
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
                <option value="Academic">Academic</option>
                <option value="Meeting">Meeting</option>
                <option value="Sports">Sports</option>
                <option value="Examination">Examination</option>
                <option value="Cultural">Cultural</option>
                <option value="Holiday">Holiday</option>
              </select>
            </div>
            <Input
              label="Venue Location"
              placeholder="Main Campus Auditorium"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Start Date *"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            <Input
              label="End Date *"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Organizer / Host"
              placeholder="Department of Science & Innovation"
              value={formData.organizer}
              onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
            />
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Target Role</label>
              <select
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="Everyone (All Portals)">Everyone (All Portals)</option>
                <option value="Parents & Teachers">Parents & Teachers</option>
                <option value="Students & Faculty">Students & Faculty</option>
                <option value="Students Only">Students Only</option>
                <option value="Teachers Only">Teachers Only</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase text-slate-400">Event Description</label>
            <textarea
              rows={3}
              placeholder="Detailed schedule and guidelines..."
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
                setEditingEvent(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingEvent ? 'Save Changes' : 'Schedule Event'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Detail Modal */}
      <Modal isOpen={!!viewingEvent} onClose={() => setViewingEvent(null)} title="Event Details & Schedule">
        {viewingEvent && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="purple">{viewingEvent.category}</Badge>
              <Badge variant="success">{viewingEvent.status || 'Scheduled'}</Badge>
            </div>
            <h2 className="text-lg font-bold text-white">{viewingEvent.title}</h2>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
              <p className="leading-relaxed">{viewingEvent.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
              <div><b>Dates:</b> {viewingEvent.startDate} to {viewingEvent.endDate}</div>
              <div><b>Venue:</b> {viewingEvent.location}</div>
              <div><b>Organizer:</b> {viewingEvent.organizer || 'Administration'}</div>
              <div><b>Target Audience:</b> {viewingEvent.targetAudience || 'Everyone'}</div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setViewingEvent(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deletingEvent} onClose={() => setDeletingEvent(null)} title="Confirm Delete Event">
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to remove event <b>"{deletingEvent?.title}"</b> from the school calendar?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingEvent(null)}>
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
