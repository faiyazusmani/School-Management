import React, { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Award,
  Check,
  X,
  AlertCircle,
  Plus,
  Edit3
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { toast } from '../../components/ui/toast';
import { profileAPI, studentAPI, attendanceAPI, homeworkAPI, resultAPI } from '../../services/api';

export const TeacherDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState('Physics 11-A');
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);
  const [studentList, setStudentList] = useState([]);

  // Modals state
  const [marksModalOpen, setMarksModalOpen] = useState(false);
  const [homeworkModalOpen, setHomeworkModalOpen] = useState(false);

  // Form states
  const [marksForm, setMarksForm] = useState({ rollNumber: '', studentName: '', subject: 'Advanced Physics', marksObtained: '', maxMarks: '100', remarks: 'Good performance' });
  const [homeworkForm, setHomeworkForm] = useState({ title: '', subject: 'Advanced Physics', className: 'Grade 11-A', dueDate: '', totalPoints: '100', description: '' });

  useEffect(() => {
    const defaultTeacherProfile = {
      name: 'Dr. Sarah Connor',
      employeeId: 'EMP-001',
      department: 'Science & Innovation',
      designation: 'Head of Physics Department',
      qualification: 'Ph.D. Quantum Physics (MIT)',
      experienceYears: 12,
      joiningDate: '2018-08-15',
      monthlySalary: 75000,
      paidSalaryTotal: 600000,
      attendanceRate: 98.6,
      presentDays: 142,
      assignedClasses: ['Grade 11-A', 'Grade 12-B'],
    };

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await profileAPI.getDashboardData();
        if (res.success && res.data && res.data.profile) {
          setProfile(res.data.profile);
        } else {
          setProfile(defaultTeacherProfile);
        }
      } catch (err) {
        setProfile(defaultTeacherProfile);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Fetch real class students when selectedClass changes
  useEffect(() => {
    const fetchStudentsForClass = async () => {
      let gradeQuery = 'Grade 11';
      if (selectedClass.includes('11')) gradeQuery = 'Grade 11';
      else if (selectedClass.includes('12')) gradeQuery = 'Grade 12';
      else if (selectedClass.includes('9')) gradeQuery = 'Grade 9';
      else if (selectedClass.includes('10')) gradeQuery = 'Grade 10';
      else if (selectedClass.includes('8')) gradeQuery = 'Grade 8';

      try {
        const res = await studentAPI.getAll({ gradeLevel: gradeQuery });
        if (res.success && res.data) {
          const mapped = res.data.map(st => ({
            id: st._id || st.id,
            roll: st.rollNumber,
            name: st.name,
            status: 'Present',
          }));
          setStudentList(mapped);
          setAttendanceSubmitted(false);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudentsForClass();
  }, [selectedClass]);

  const toggleStudentAttendance = (id) => {
    setStudentList((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === 'Present' ? 'Absent' : 'Present' } : s
      )
    );
  };

  const handleMarkAllPresent = () => {
    setStudentList((prev) => prev.map((s) => ({ ...s, status: 'Present' })));
    toast.info('Marked all students as Present');
  };

  const handleSubmitAttendance = async () => {
    try {
      setLoading(true);
      await Promise.all(studentList.map(st => 
        attendanceAPI.mark({
          rollNumber: st.roll,
          studentName: st.name,
          className: selectedClass,
          status: st.status,
          userType: 'student',
        })
      ));
      setAttendanceSubmitted(true);
      toast.success(`Attendance submitted for ${selectedClass}!`);
    } catch (err) {
      toast.error('Failed to submit attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHomework = async (e) => {
    e.preventDefault();
    try {
      await homeworkAPI.create(homeworkForm);
      toast.success(`Homework "${homeworkForm.title}" assigned successfully.`);
      setHomeworkModalOpen(false);
      setHomeworkForm({ title: '', subject: 'Advanced Physics', className: 'Grade 11-A', dueDate: '', totalPoints: '100', description: '' });
    } catch (err) {
      toast.error('Failed to assign homework');
    }
  };

  const handleUploadMarks = async (e) => {
    e.preventDefault();
    try {
      await resultAPI.create(marksForm);
      toast.success(`Marks uploaded successfully.`);
      setMarksModalOpen(false);
      setMarksForm({ rollNumber: '', studentName: '', subject: 'Advanced Physics', marksObtained: '', maxMarks: '100', remarks: 'Good performance' });
    } catch (err) {
      toast.error('Failed to upload marks');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400 font-medium">Loading your teacher profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-slate-900/40 border border-slate-800 rounded-3xl">
        <p className="text-sm text-slate-400 mt-2 font-medium">{error || 'No teacher profile found.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900 border border-purple-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="min-w-0">
          <Badge variant="purple" className="mb-2 text-[10px]">FACULTY TEACHER PORTAL</Badge>
          <h1 className="text-lg sm:text-2xl font-extrabold text-white truncate">Welcome Back, {profile.name}</h1>
          <p className="text-xs text-slate-400 mt-1">
            Department of {profile.department} • {profile.designation || 'Faculty Member'}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap shrink-0">
          <Button variant="primary" size="sm" onClick={() => setMarksModalOpen(true)}>
            Upload Assignment Marks
          </Button>
          <Button variant="outline" size="sm" onClick={() => setHomeworkModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> Add Homework
          </Button>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="p-4 sm:p-5">
          <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">Employee ID</span>
          <div className="text-xl sm:text-2xl font-extrabold text-white mt-2">{profile.employeeId}</div>
          <span className="text-[11px] text-purple-400 block mt-1">{profile.assignedClasses?.length || 0} Assigned Classes</span>
        </Card>

        <Card className="p-4 sm:p-5">
          <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">Qualification</span>
          <div className="text-base sm:text-lg font-extrabold text-amber-400 mt-2 truncate">{profile.qualification || 'M.Sc. Physics'}</div>
          <span className="text-[11px] text-slate-400 block mt-1">{profile.experienceYears || '0'} Years Experience</span>
        </Card>

        <Card className="p-4 sm:p-5">
          <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">Attendance Rate</span>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-2">{profile.attendanceRate || '0'}%</div>
          <span className="text-[11px] text-emerald-400 block mt-1">{profile.presentDays || '0'} Days Present</span>
        </Card>

        <Card className="p-4 sm:p-5">
          <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">Salary Status</span>
          <div className="text-xl sm:text-2xl font-extrabold text-indigo-400 mt-2 truncate">₹{profile.monthlySalary || '0'} / Mo</div>
          <span className="text-[11px] text-slate-400 block mt-1">Total Paid: ₹{profile.paidSalaryTotal || '0'}</span>
        </Card>
      </div>

      {/* Attendance Marker Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Digital Classroom Attendance Tracker</h3>
              <p className="text-xs text-slate-400">Select class roster to log present/absent statuses</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="text-xs rounded-xl p-2 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="Physics 11-A">Physics 11-A</option>
                <option value="Calculus 12-B">Calculus 12-B</option>
                <option value="General Science 9-C">General Science 9-C</option>
              </select>
              <Button size="sm" variant="outline" onClick={handleMarkAllPresent}>
                Mark All Present
              </Button>
            </div>
          </div>

          {studentList.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No students found in this class.</p>
          ) : (
            <div className="space-y-3">
              {studentList.map((st) => (
                <div
                  key={st.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-lg">
                      #{st.roll}
                    </span>
                    <span className="text-xs font-bold text-slate-200">{st.name}</span>
                  </div>
                  <button
                    onClick={() => toggleStudentAttendance(st.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      st.status === 'Present'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {st.status === 'Present' ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    {st.status}
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button
              variant="primary"
              onClick={handleSubmitAttendance}
              disabled={attendanceSubmitted || studentList.length === 0}
            >
              {attendanceSubmitted ? '✓ Attendance Recorded' : 'Submit Attendance To Registry'}
            </Button>
          </div>
        </Card>

        {/* Schedule */}
        <Card className="p-6 border-slate-800">
          <h3 className="text-base font-bold text-white mb-4">Today's Teaching Timetable</h3>
          <div className="space-y-4">
            {[
              { time: '09:00 AM', subject: 'Advanced Physics (11-A)', room: 'Lab 204', status: 'Completed' },
              { time: '10:30 AM', subject: 'AP Calculus BC (12-B)', room: 'Room 302', status: 'In Progress' },
              { time: '01:30 PM', subject: 'General Science (9-C)', room: 'Room 105', status: 'Upcoming' },
            ].map((sc, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-indigo-400">{sc.time}</span>
                  <Badge variant={sc.status === 'Completed' ? 'success' : sc.status === 'In Progress' ? 'purple' : 'outline'}>
                    {sc.status}
                  </Badge>
                </div>
                <h4 className="text-xs font-bold text-white">{sc.subject}</h4>
                <span className="text-[10px] text-slate-400 block">{sc.room}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Homework Creation Modal */}
      <Modal isOpen={homeworkModalOpen} onClose={() => setHomeworkModalOpen(false)} title="Assign New Homework">
        <form onSubmit={handleCreateHomework} className="space-y-4">
          <Input
            label="Homework Title *"
            placeholder="e.g. Electromagnetism Lab Report"
            value={homeworkForm.title}
            onChange={(e) => setHomeworkForm({ ...homeworkForm, title: e.target.value })}
            required
          />
          <Input
            label="Subject *"
            placeholder="e.g. Advanced Physics"
            value={homeworkForm.subject}
            onChange={(e) => setHomeworkForm({ ...homeworkForm, subject: e.target.value })}
            required
          />
          <Input
            label="Class / Grade Level *"
            placeholder="e.g. Grade 11-A"
            value={homeworkForm.className}
            onChange={(e) => setHomeworkForm({ ...homeworkForm, className: e.target.value })}
            required
          />
          <Input
            label="Due Date *"
            type="date"
            value={homeworkForm.dueDate}
            onChange={(e) => setHomeworkForm({ ...homeworkForm, dueDate: e.target.value })}
            required
          />
          <Input
            label="Total Points"
            type="number"
            value={homeworkForm.totalPoints}
            onChange={(e) => setHomeworkForm({ ...homeworkForm, totalPoints: e.target.value })}
          />
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-semibold block">Description</label>
            <textarea
              rows={3}
              value={homeworkForm.description}
              onChange={(e) => setHomeworkForm({ ...homeworkForm, description: e.target.value })}
              className="w-full text-xs rounded-xl p-3 bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setHomeworkModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Assign Homework
            </Button>
          </div>
        </form>
      </Modal>

      {/* Upload Marks Modal */}
      <Modal isOpen={marksModalOpen} onClose={() => setMarksModalOpen(false)} title="Upload Assignment Marks">
        <form onSubmit={handleUploadMarks} className="space-y-4">
          <Input
            label="Student Roll Number *"
            placeholder="e.g. 101"
            value={marksForm.rollNumber}
            onChange={(e) => setMarksForm({ ...marksForm, rollNumber: e.target.value })}
            required
          />
          <Input
            label="Student Full Name *"
            placeholder="e.g. Alex Rivera"
            value={marksForm.studentName}
            onChange={(e) => setMarksForm({ ...marksForm, studentName: e.target.value })}
            required
          />
          <Input
            label="Subject Name *"
            placeholder="e.g. Advanced Physics"
            value={marksForm.subject}
            onChange={(e) => setMarksForm({ ...marksForm, subject: e.target.value })}
            required
          />
          <Input
            label="Marks Obtained *"
            type="number"
            value={marksForm.marksObtained}
            onChange={(e) => setMarksForm({ ...marksForm, marksObtained: e.target.value })}
            required
          />
          <Input
            label="Maximum Marks *"
            type="number"
            value={marksForm.maxMarks}
            onChange={(e) => setMarksForm({ ...marksForm, maxMarks: e.target.value })}
            required
          />
          <Input
            label="Remarks"
            placeholder="e.g. Exceptional lab skills"
            value={marksForm.remarks}
            onChange={(e) => setMarksForm({ ...marksForm, remarks: e.target.value })}
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setMarksModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Upload Marks
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
