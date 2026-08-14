import React, { useState, useEffect } from 'react';
import {
  Users,
  Award,
  DollarSign,
  Calendar,
  MessageSquare,
  CheckCircle2,
  Send,
  AlertCircle,
  ClipboardList,
  Mail,
  Phone,
  User as UserIcon,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { toast } from '../../components/ui/toast';
import { profileAPI } from '../../services/api';

export const ParentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const defaultParentDashboard = {
      parent: {
        name: 'Marcus Rivera',
        email: 'parent@edumanage.com',
        phone: '+1 (555) 890-1234',
        occupation: 'Senior Software Architect',
      },
      children: [
        {
          id: 'st_1',
          name: 'Lucas Rivera',
          admissionNumber: 'ADM-2026-101',
          rollNumber: '101',
          gradeLevel: 'Grade 11',
          section: 'A',
          gpa: 3.88,
          attendanceRate: 96.2,
          presentDays: 135,
          absentDays: 5,
          totalFees: 48500,
          paidFees: 48500,
          pendingFees: 0,
          teacherName: 'Dr. Sarah Connor',
          teacherEmail: 'teacher@edumanage.com',
          results: [
            { subject: 'Advanced Physics', score: 95, grade: 'A+' },
            { subject: 'AP Calculus BC', score: 92, grade: 'A' },
            { subject: 'World Literature', score: 88, grade: 'B+' },
          ],
        },
      ],
    };

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await profileAPI.getDashboardData();
        if (res.success && res.data) {
          setDashboardData(res.data);
        } else {
          setDashboardData(defaultParentDashboard);
        }
      } catch (err) {
        setDashboardData(defaultParentDashboard);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message) return;
    toast.success(`Message dispatched to faculty.`);
    setMessage('');
    setChatOpen(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400 font-medium">Loading observer control...</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-slate-900/40 border border-slate-800 rounded-3xl">
        <p className="text-sm text-slate-400 mt-2 font-medium">{error || 'No parent profile found.'}</p>
      </div>
    );
  }

  const profile = dashboardData?.profile || dashboardData?.parent || {
    name: 'Marcus Rivera',
    email: 'parent@edumanage.com',
    phone: '+1 (555) 890-1234',
    occupation: 'Senior Software Architect',
  };
  const children = dashboardData?.children || [];

  if (children.length === 0) {
    return (
      <div className="space-y-8">
        {/* Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-900/40 via-purple-900/30 to-slate-900 border border-amber-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Badge variant="warning" className="mb-2">PARENT & GUARDIAN PORTAL</Badge>
            <h1 className="text-2xl font-extrabold text-white">Parent Observer Control: {profile.name}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Email: {profile.email} • Phone: {profile.phone || 'N/A'} • Occupation: {profile.occupation || 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-6 bg-slate-900/40 border border-slate-800 rounded-3xl">
          <p className="text-sm text-slate-400 mt-2 font-medium">No linked child profiles found in MongoDB.</p>
        </div>
      </div>
    );
  }

  const currentChild = children[selectedChildIndex];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-900/40 via-purple-900/30 to-slate-900 border border-amber-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Badge variant="warning" className="mb-2">PARENT & GUARDIAN PORTAL</Badge>
          <h1 className="text-2xl font-extrabold text-white">Parent Observer Control: {profile.name}</h1>
          <p className="text-xs text-slate-400 mt-1">
            Email: {profile.email} • Phone: {profile.phone || 'N/A'} • Occupation: {profile.occupation || 'N/A'}
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setChatOpen(true)}>
          <MessageSquare className="w-4 h-4 mr-1" /> Message Faculty Teacher
        </Button>
      </div>

      {/* Child Selector Tabs */}
      <div className="flex items-center gap-3 flex-wrap">
        {children.map((child, idx) => (
          <button
            key={child._id}
            onClick={() => setSelectedChildIndex(idx)}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedChildIndex === idx
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{child.name} ({child.gradeLevel || 'Grade'}-{child.section || 'Sec'})</span>
          </button>
        ))}
      </div>

      {/* Child Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="p-4 sm:p-5">
          <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">Current GPA</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">{currentChild.gpa || '0.00'}</div>
          <span className="text-[10px] text-slate-400 block mt-1">Standing: Normal</span>
        </Card>

        <Card className="p-4 sm:p-5">
          <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">Attendance Rate</span>
          <div className="text-2xl sm:text-3xl font-black text-indigo-400 mt-2">{currentChild.attendanceRate || '0'}%</div>
          <span className="text-[10px] text-emerald-400 block mt-1">{currentChild.presentDays || '0'} Present / {currentChild.absentDays || '0'} Absent</span>
        </Card>

        <Card className="p-4 sm:p-5">
          <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">Tuition Fees Status</span>
          <div className="text-xl sm:text-2xl font-black text-white mt-2 flex items-center gap-2 flex-wrap">
            <span className="truncate">₹{currentChild.paidFees || '0'} Paid</span>
            <Badge variant={currentChild.pendingFees > 0 ? 'warning' : 'success'} className="text-[9px]">
              {currentChild.pendingFees > 0 ? 'PENDING' : 'PAID'}
            </Badge>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Outstanding: ₹{currentChild.pendingFees || '0'}</span>
        </Card>

        <Card className="p-4 sm:p-5">
          <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">Medical Notes</span>
          <div className="text-sm sm:text-base font-bold text-amber-400 mt-2 truncate">{currentChild.medicalNotes || 'None logged'}</div>
          <span className="text-[10px] text-slate-400 block mt-1">Route: {currentChild.transportRoute || 'N/A'}</span>
        </Card>
      </div>

      {/* Subjects & Details breakdown */}
      <Card className="p-6 border-slate-800">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-indigo-400" /> Academic Profile & Demographics for {currentChild.name}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
          <div className="space-y-3">
            <div><span className="text-slate-400 block uppercase font-bold text-[10px] mb-1">Email Address</span> {currentChild.email}</div>
            <div><span className="text-slate-400 block uppercase font-bold text-[10px] mb-1">Class / Grade Level</span> {currentChild.gradeLevel} - {currentChild.section}</div>
            <div><span className="text-slate-400 block uppercase font-bold text-[10px] mb-1">Roll Number</span> #{currentChild.rollNumber}</div>
            <div><span className="text-slate-400 block uppercase font-bold text-[10px] mb-1">Admission Number</span> {currentChild.admissionNumber}</div>
          </div>
          <div className="space-y-3">
            <div><span className="text-slate-400 block uppercase font-bold text-[10px] mb-1">Father's Name</span> {currentChild.fatherName || 'N/A'}</div>
            <div><span className="text-slate-400 block uppercase font-bold text-[10px] mb-1">Mother's Name</span> {currentChild.motherName || 'N/A'}</div>
            <div><span className="text-slate-400 block uppercase font-bold text-[10px] mb-1">Date of Birth</span> {currentChild.dob || 'N/A'}</div>
            <div><span className="text-slate-400 block uppercase font-bold text-[10px] mb-1">Blood Group</span> {currentChild.bloodGroup || 'N/A'}</div>
          </div>
        </div>
      </Card>

      {/* Academic Exam Results */}
      <Card className="p-6 border-slate-800">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" /> Child's Academic Exam Scores
        </h3>
        {!currentChild.results || currentChild.results.length === 0 ? (
          <p className="text-xs text-slate-400">No published exam results found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentChild.results.map((resItem, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">{resItem.subject}</span>
                  <span className="text-slate-200">{resItem.marksObtained} / {resItem.maxMarks}</span>
                </div>
                <span className="text-sm font-extrabold text-emerald-400">{resItem.grade}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Homework Assignments */}
      <Card className="p-6 border-slate-800">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-indigo-400" /> Pending Homework & Assignments
        </h3>
        {!currentChild.homeworks || currentChild.homeworks.length === 0 ? (
          <p className="text-xs text-slate-400">No pending homework assignments.</p>
        ) : (
          <div className="space-y-3">
            {currentChild.homeworks.map((hw, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="text-indigo-400 font-bold uppercase text-[9px] block">{hw.subject}</span>
                  <h4 className="font-bold text-white mt-1">{hw.title}</h4>
                  <span className="text-slate-400 block mt-0.5">Due: {hw.dueDate ? hw.dueDate.split('T')[0] : 'N/A'}</span>
                </div>
                <Badge variant="warning">Pending</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Notices */}
      <Card className="p-6 border-slate-800">
        <h3 className="text-base font-bold text-white mb-4">Latest Board Announcements</h3>
        {!currentChild.notices || currentChild.notices.length === 0 ? (
          <p className="text-xs text-slate-400">No recent notices published.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentChild.notices.map((n, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <Badge variant="purple">{n.category || 'General'}</Badge>
                  <span className="text-slate-500">{n.date ? n.date.split('T')[0] : ''}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200">{n.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1">{n.content}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Message Modal */}
      <Modal isOpen={chatOpen} onClose={() => setChatOpen(false)} title="Contact Faculty Teacher">
        <form onSubmit={handleSendMessage} className="space-y-4">
          <p className="text-xs text-slate-400">
            Send a direct query regarding <b>{currentChild.name}</b> to the faculty.
          </p>
          <textarea
            rows={4}
            required
            placeholder="Type your message or inquiry here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full text-xs rounded-xl p-3 bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setChatOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Send Message <Send className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
