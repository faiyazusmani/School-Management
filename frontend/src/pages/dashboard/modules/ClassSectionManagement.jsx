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
import { BookOpen, Users, Home, Eye, Edit3, Trash2, Clock, Bell, Utensils, Calendar, Sparkles } from 'lucide-react';

export const ClassSectionManagement = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [viewingClass, setViewingClass] = useState(null);
  const [deletingClass, setDeletingClass] = useState(null);
  const [show8BellScheduleModal, setShow8BellScheduleModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    gradeLevel: 'Class 10',
    sections: 'A, B, C',
    classTeacher: 'Sunil Sir',
    room: 'Room 302',
    totalStudents: 35,
  });

  const { token } = useAuth();

  // 🔔 OFFICIAL USER-SPECIFIED DAILY SCHOOL SCHEDULE (9:00 AM to 3:30 PM)
  const DAILY_8_BELL_SCHEDULE = [
    { period: '🏫 School Start & Assembly', time: '09:00 AM - 09:30 AM', duration: '30 Mins', type: 'Assembly', icon: '🏫' },
    { period: '🔔 1st Bell', time: '09:30 AM - 10:00 AM', duration: '30 Mins', type: 'Period', icon: '🔔' },
    { period: '🔔 2nd Bell', time: '10:00 AM - 10:30 AM', duration: '30 Mins', type: 'Period', icon: '🔔' },
    { period: '🔔 3rd Bell', time: '10:30 AM - 11:00 AM', duration: '30 Mins', type: 'Period', icon: '🔔' },
    { period: '🔔 4th Bell', time: '11:00 AM - 11:30 AM', duration: '30 Mins', type: 'Period', icon: '🔔' },
    { period: '⏳ Activity / Other Block', time: '11:30 AM - 01:00 PM', duration: '1 Hr 30 Mins', type: 'Activity', icon: '⏳' },
    { period: '🍱 Lunch Break', time: '01:00 PM - 01:30 PM', duration: '30 Mins', type: 'Lunch', icon: '🍱' },
    { period: '🔔 5th Bell', time: '01:30 PM - 02:00 PM', duration: '30 Mins', type: 'Period', icon: '🔔' },
    { period: '🔔 6th Bell', time: '02:00 PM - 02:30 PM', duration: '30 Mins', type: 'Period', icon: '🔔' },
    { period: '🔔 7th Bell', time: '02:30 PM - 03:00 PM', duration: '30 Mins', type: 'Period', icon: '🔔' },
    { period: '🔔 8th Bell', time: '03:00 PM - 03:30 PM', duration: '30 Mins', type: 'Period', icon: '🔔' },
  ];

  // 🏫 COMPLETE CLASSES FROM NURSERY TO 12TH GRADE (EXACTLY MAPPED TO USER'S TIME SCHEDULE)
  const mockClasses = [
    {
      _id: 'c_nursery',
      id: 'c_nursery',
      name: 'Nursery Class',
      gradeLevel: 'Nursery',
      sections: ['Sec A', 'Sec B'],
      classTeacher: 'Ritu Ma’am',
      room: 'Primary Block - Room 01',
      totalStudents: 25,
      subjectsByBell: [
        'School Assembly & Attendance',
        '1st Bell: Rhymes & Action Songs',
        '2nd Bell: Drawing & Coloring',
        '3rd Bell: Storytelling & Puppets',
        '4th Bell: Playtime & Blocks',
        'Activity / Craft & Origami Block (11:30 AM - 01:00 PM)',
        'LUNCH BREAK 🍱 (01:00 PM - 01:30 PM)',
        '5th Bell: English Alphabets',
        '6th Bell: Hindi Akshar',
        '7th Bell: Activity & Games',
        '8th Bell: Nap & Story Time'
      ],
    },
    {
      _id: 'c_lkg',
      id: 'c_lkg',
      name: 'LKG (Lower Kindergarten)',
      gradeLevel: 'LKG',
      sections: ['Sec A', 'Sec B'],
      classTeacher: 'Priya Ma’am',
      room: 'Primary Block - Room 02',
      totalStudents: 28,
      subjectsByBell: [
        'School Assembly & Morning Prayer',
        '1st Bell: English Reading',
        '2nd Bell: Numbers & Counting',
        '3rd Bell: EVS & Nature Studies',
        '4th Bell: Phonics Practice',
        'Activity / Creative Art & Craft Block (11:30 AM - 01:00 PM)',
        'LUNCH BREAK 🍱 (01:00 PM - 01:30 PM)',
        '5th Bell: Hindi Kavita',
        '6th Bell: Music & Dance',
        '7th Bell: Indoor Games',
        '8th Bell: Storytelling & Free Play'
      ],
    },
    {
      _id: 'c_ukg',
      id: 'c_ukg',
      name: 'UKG (Upper Kindergarten)',
      gradeLevel: 'UKG',
      sections: ['Sec A', 'Sec B'],
      classTeacher: 'Sunita Ma’am',
      room: 'Primary Block - Room 03',
      totalStudents: 30,
      subjectsByBell: [
        'School Assembly',
        '1st Bell: English Sight Words',
        '2nd Bell: Basic Mathematics',
        '3rd Bell: General Awareness',
        '4th Bell: Art & Painting',
        'Activity / Group Learning & Projects (11:30 AM - 01:00 PM)',
        'LUNCH BREAK 🍱 (01:00 PM - 01:30 PM)',
        '5th Bell: Hindi Writing',
        '6th Bell: Handwriting Practice',
        '7th Bell: Physical Games',
        '8th Bell: Audio-Visual Story Time'
      ],
    },
    {
      _id: 'c_1',
      id: 'c_1',
      name: 'Class 1',
      gradeLevel: 'Class 1',
      sections: ['Sec A', 'Sec B'],
      classTeacher: 'Anjali Ma’am',
      room: 'Junior Block - Room 101',
      totalStudents: 32,
      subjectsByBell: [
        'School Assembly',
        '1st Bell: English Grammar',
        '2nd Bell: Mathematics Foundation',
        '3rd Bell: EVS Science',
        '4th Bell: Hindi Sahitya',
        'Activity / Science Lab & Library Block (11:30 AM - 01:00 PM)',
        'LUNCH BREAK 🍱 (01:00 PM - 01:30 PM)',
        '5th Bell: Computer Basics',
        '6th Bell: Drawing & Craft',
        '7th Bell: Physical Education',
        '8th Bell: Moral Science & Reading'
      ],
    },
    {
      _id: 'c_2',
      id: 'c_2',
      name: 'Class 2',
      gradeLevel: 'Class 2',
      sections: ['Sec A', 'Sec B'],
      classTeacher: 'Rajesh Sir',
      room: 'Junior Block - Room 102',
      totalStudents: 34,
      subjectsByBell: [
        'School Assembly',
        '1st Bell: Mathematics',
        '2nd Bell: English Literature',
        '3rd Bell: Environmental Studies',
        '4th Bell: Hindi Grammar',
        'Activity / Sports & Extracurricular Block (11:30 AM - 01:00 PM)',
        'LUNCH BREAK 🍱 (01:00 PM - 01:30 PM)',
        '5th Bell: Computer Lab',
        '6th Bell: General Knowledge',
        '7th Bell: Games & Sports',
        '8th Bell: Quiz & Activity'
      ],
    },
    {
      _id: 'c_3',
      id: 'c_3',
      name: 'Class 3',
      gradeLevel: 'Class 3',
      sections: ['Sec A', 'Sec B'],
      classTeacher: 'Kavita Ma’am',
      room: 'Junior Block - Room 103',
      totalStudents: 35,
      subjectsByBell: [
        'School Assembly',
        '1st Bell: English Language',
        '2nd Bell: Mathematics',
        '3rd Bell: General Science',
        '4th Bell: Social Studies',
        'Activity / Art & Science Exhibition Block (11:30 AM - 01:00 PM)',
        'LUNCH BREAK 🍱 (01:00 PM - 01:30 PM)',
        '5th Bell: Hindi Literature',
        '6th Bell: Computer Science',
        '7th Bell: Art & Craft',
        '8th Bell: Sports & Drill'
      ],
    },
    {
      _id: 'c_4',
      id: 'c_4',
      name: 'Class 4',
      gradeLevel: 'Class 4',
      sections: ['Sec A', 'Sec B'],
      classTeacher: 'Deepak Sir',
      room: 'Junior Block - Room 104',
      totalStudents: 36,
      subjectsByBell: [
        'School Assembly',
        '1st Bell: General Science',
        '2nd Bell: Mathematics',
        '3rd Bell: English Composition',
        '4th Bell: Hindi Grammar',
        'Activity / Computer Coding & Robotics Block (11:30 AM - 01:00 PM)',
        'LUNCH BREAK 🍱 (01:00 PM - 01:30 PM)',
        '5th Bell: Social Science',
        '6th Bell: Sanskrit Basics',
        '7th Bell: Physical Ed & Games',
        '8th Bell: Library Study'
      ],
    },
    {
      _id: 'c_5',
      id: 'c_5',
      name: 'Class 5',
      gradeLevel: 'Class 5',
      sections: ['Sec A', 'Sec B'],
      classTeacher: 'Meena Ma’am',
      room: 'Junior Block - Room 105',
      totalStudents: 38,
      subjectsByBell: [
        'School Assembly',
        '1st Bell: Mathematics',
        '2nd Bell: General Science',
        '3rd Bell: Social Studies',
        '4th Bell: English Literature',
        'Activity / Music, Performing Arts & Debate Block (11:30 AM - 01:00 PM)',
        'LUNCH BREAK 🍱 (01:00 PM - 01:30 PM)',
        '5th Bell: Hindi Sahitya',
        '6th Bell: Computer Lab',
        '7th Bell: Sanskrit',
        '8th Bell: Athletics & Sports'
      ],
    },
    {
      _id: 'c_6',
      id: 'c_6',
      name: 'Class 6',
      gradeLevel: 'Class 6',
      sections: ['Sec A', 'Sec B', 'Sec C'],
      classTeacher: 'Amit Sir',
      room: 'Middle Block - Room 201',
      totalStudents: 40,
      subjectsByBell: [
        'School Assembly',
        '1st Bell: Physics & Chemistry',
        '2nd Bell: Algebra & Geometry',
        '3rd Bell: History & Civics',
        '4th Bell: English Grammar',
        'Activity / Science Experiment & IT Workshop (11:30 AM - 01:00 PM)',
        'LUNCH BREAK 🍱 (01:00 PM - 01:30 PM)',
        '5th Bell: Hindi Bhasha',
        '6th Bell: Geography',
        '7th Bell: Computer Lab',
        '8th Bell: Sanskrit Vyakaran'
      ],
    },
    {
      _id: 'c_7',
      id: 'c_7',
      name: 'Class 7',
      gradeLevel: 'Class 7',
      sections: ['Sec A', 'Sec B', 'Sec C'],
      classTeacher: 'Sneha Ma’am',
      room: 'Middle Block - Room 202',
      totalStudents: 40,
      subjectsByBell: [
        'School Assembly',
        '1st Bell: Biology & EVS',
        '2nd Bell: Mathematics',
        '3rd Bell: English Literature',
        '4th Bell: Hindi Vyakaran',
        'Activity / Robotics & Coding Lab Block (11:30 AM - 01:00 PM)',
        'LUNCH BREAK 🍱 (01:00 PM - 01:30 PM)',
        '5th Bell: Physics Practical Lab',
        '6th Bell: History & Civics',
        '7th Bell: Computer Python',
        '8th Bell: Outdoor Sports'
      ],
    },
    {
      _id: 'c_8',
      id: 'c_8',
      name: 'Class 8',
      gradeLevel: 'Class 8',
      sections: ['Sec A', 'Sec B', 'Sec C'],
      classTeacher: 'Vikram Sir',
      room: 'Middle Block - Room 203',
      totalStudents: 42,
      subjectsByBell: [
        'School Assembly',
        '1st Bell: Mathematics',
        '2nd Bell: Chemistry & Physics',
        '3rd Bell: English Language',
        '4th Bell: Social Science',
        'Activity / STEM Project & Quiz Competition (11:30 AM - 01:00 PM)',
        'LUNCH BREAK 🍱 (01:00 PM - 01:30 PM)',
        '5th Bell: Biology',
        '6th Bell: Hindi Literature',
        '7th Bell: Computer Algorithms',
        '8th Bell: Physical Ed & Drill'
      ],
    },
    {
      _id: 'c_9',
      id: 'c_9',
      name: 'Class 9',
      gradeLevel: 'Class 9',
      sections: ['Sec A', 'Sec B'],
      classTeacher: 'Ankit Sir',
      room: 'Senior Block - Room 301',
      totalStudents: 38,
      subjectsByBell: [
        'School Assembly',
        '1st Bell: Physics (PHY-101)',
        '2nd Bell: Mathematics (MTH-101)',
        '3rd Bell: Chemistry (CHE-102)',
        '4th Bell: English (ENG-101)',
        'Activity / Practical Lab Experiments Block (11:30 AM - 01:00 PM)',
        'LUNCH BREAK 🍱 (01:00 PM - 01:30 PM)',
        '5th Bell: Biology (BIO-103)',
        '6th Bell: Social History & Geo',
        '7th Bell: Computer CS-105',
        '8th Bell: Sports Science'
      ],
    },
    {
      _id: 'c_10',
      id: 'c_10',
      name: 'Class 10 (Board Batch)',
      gradeLevel: 'Class 10',
      sections: ['Sec A', 'Sec B', 'Sec C'],
      classTeacher: 'Elena Rostova',
      room: 'Senior Block - Room 302',
      totalStudents: 35,
      subjectsByBell: [
        'School Assembly',
        '1st Bell: Advanced Mathematics',
        '2nd Bell: Physics & Numericals',
        '3rd Bell: Organic Chemistry',
        '4th Bell: English Rhetoric',
        'Activity / Board Exam Mock Test & Doubts (11:30 AM - 01:00 PM)',
        'LUNCH BREAK 🍱 (01:00 PM - 01:30 PM)',
        '5th Bell: Biology & Genetics',
        '6th Bell: Social Sciences',
        '7th Bell: AI & Python Lab',
        '8th Bell: Board Practice'
      ],
    },
    {
      _id: 'c_11',
      id: 'c_11',
      name: 'Class 11 (Science, Commerce, Arts)',
      gradeLevel: 'Class 11',
      sections: ['Sec A (Science)', 'Sec B (Commerce)', 'Sec C (Arts)'],
      classTeacher: 'Dr. Sarah Connor',
      room: 'Science Wing - Lab 204',
      totalStudents: 38,
      subjectsByBell: [
        'School Assembly',
        '1st Bell: Quantum Physics (PHY-301)',
        '2nd Bell: Calculus BC (MTH-402)',
        '3rd Bell: Organic Chemistry',
        '4th Bell: English World Lit',
        'Activity / Science Lab Practical & Research Block (11:30 AM - 01:00 PM)',
        'LUNCH BREAK 🍱 (01:00 PM - 01:30 PM)',
        '5th Bell: Data Structures (CS-105)',
        '6th Bell: Accounts / Economics',
        '7th Bell: Physical Ed & Sports',
        '8th Bell: Computer & Practical Lab'
      ],
    },
    {
      _id: 'c_12',
      id: 'c_12',
      name: 'Class 12 (Board & Entrance Prep)',
      gradeLevel: 'Class 12',
      sections: ['Sec A (Science)', 'Sec B (Maths)', 'Sec C (Humanities)'],
      classTeacher: 'Sunil Sir',
      room: 'Senior Block - Room 402',
      totalStudents: 42,
      subjectsByBell: [
        'School Assembly',
        '1st Bell: Advanced Physics & JEE',
        '2nd Bell: Linear Algebra & Calculus',
        '3rd Bell: Advanced Chemistry',
        '4th Bell: English Communication',
        'Activity / Competitive Entrance & Mock Exam (11:30 AM - 01:00 PM)',
        'LUNCH BREAK 🍱 (01:00 PM - 01:30 PM)',
        '5th Bell: AI & Machine Learning',
        '6th Bell: Economics / Business Studies',
        '7th Bell: Entrance Exam Revision',
        '8th Bell: Self Study & Practical Lab'
      ],
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
        toast.success(`Class ${formData.name} added successfully!`);
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
    toast.success('Class removed from allocation');
    setDeletingClass(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      gradeLevel: 'Class 10',
      sections: 'A, B, C',
      classTeacher: 'Sunil Sir',
      room: 'Room 302',
      totalStudents: 35,
    });
  };

  const columns = [
    {
      header: 'Class & Grade Name',
      cell: (row) => (
        <div>
          <div className="font-bold text-white text-xs">{row.name}</div>
          <span className="text-[10px] text-indigo-400 font-semibold">{row.gradeLevel}</span>
        </div>
      ),
    },
    {
      header: 'Sections Allocated',
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {Array.isArray(row.sections)
            ? row.sections.map((sec, idx) => (
                <Badge key={idx} variant="purple">
                  {sec.startsWith('Sec') ? sec : `Sec ${sec}`}
                </Badge>
              ))
            : <Badge variant="purple">{row.sections}</Badge>}
        </div>
      ),
    },
    {
      header: 'Class Homeroom Teacher',
      cell: (row) => <span className="text-slate-200 font-semibold text-xs">{row.classTeacher}</span>,
    },
    {
      header: 'Assigned Room',
      cell: (row) => <span className="text-slate-400 text-xs font-mono">{row.room || 'Room 101'}</span>,
    },
    {
      header: 'Enrolled Capacity',
      cell: (row) => (
        <span className="font-bold text-emerald-400 text-xs">{row.totalStudents || 35} Students</span>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5 justify-end whitespace-nowrap">
          <button
            onClick={() => setViewingClass(row)}
            title="View 8-Bell Class Timetable"
            className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 font-semibold text-[10px] flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Class Timetable</span>
          </button>
          <button
            onClick={() => {
              setEditingClass(row);
              setFormData({
                name: row.name || '',
                gradeLevel: row.gradeLevel || 'Class 10',
                sections: Array.isArray(row.sections) ? row.sections.join(', ') : row.sections || 'A',
                classTeacher: row.classTeacher || 'Sunil Sir',
                room: row.room || 'Room 101',
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
      {/* 🔔 OFFICIAL CUSTOM USER TIMETABLE BANNER */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge variant="success">OFFICIAL SCHOOL TIMETABLE</Badge>
            <Badge variant="purple">🏫 Start: 9:00 AM</Badge>
            <Badge variant="indigo">⏳ Activity Block: 11:30 AM - 1:00 PM</Badge>
            <Badge variant="warning">🍱 Lunch: 1:00 PM - 1:30 PM</Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Daily 8-Bell Master School Schedule</h1>
          <p className="text-xs text-slate-400 mt-1">
            School Start (9:00-9:30) • 1st to 4th Bell (9:30-11:30) • Activity Block (11:30-1:00) • Lunch (1:00-1:30) • 5th to 8th Bell (1:30-3:30).
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShow8BellScheduleModal(true)}
          className="flex items-center gap-1.5 shrink-0"
        >
          <Clock className="w-4 h-4" /> View Full Time Schedule
        </Button>
      </div>

      {/* Analytics Cards for Classes & Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Pre-Lunch Schedule</span>
            <Bell className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">4 Bells + Activity Block</div>
          <span className="text-[10px] text-slate-500">09:00 AM to 01:00 PM</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Lunch Break</span>
            <Utensils className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">01:00 PM - 01:30 PM</div>
          <span className="text-[10px] text-slate-500">30 Minutes Lunch Duration</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Post-Lunch Bells</span>
            <Clock className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">5th to 8th Bell</div>
          <span className="text-[10px] text-slate-500">01:30 PM to 03:30 PM</span>
        </Card>
      </div>

      {/* Data Table */}
      <DataTable
        title="Class & Section Allocations"
        subtitle="Manage grades Nursery to 12th, assigned homeroom faculty, and room allocations"
        columns={columns}
        data={classes}
        loading={loading}
        filterKey="gradeLevel"
        filterOptions={['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12']}
        emptyStateTitle="No classes found."
        onAdd={() => {
          resetForm();
          setEditingClass(null);
          setIsAddModalOpen(true);
        }}
      />

      {/* 🍱 8-BELL MASTER TIMETABLE SCHEDULE MODAL */}
      <Modal
        isOpen={show8BellScheduleModal}
        onClose={() => setShow8BellScheduleModal(false)}
        size="5xl"
        title="Official Daily School Time Schedule (09:00 AM - 03:30 PM)"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 border border-slate-800 rounded-2xl">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">🏫 School Start</span>
              <span className="text-sm font-black text-indigo-400">9:00 AM - 9:30 AM</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">⏳ Activity Block</span>
              <span className="text-sm font-black text-purple-400">11:30 AM - 1:00 PM</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">🍱 Lunch Break</span>
              <span className="text-sm font-black text-amber-400">1:00 PM - 1:30 PM</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">🔔 5th Bell Start</span>
              <span className="text-sm font-black text-emerald-400">1:30 PM - 2:00 PM</span>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs text-slate-300 min-w-[650px]">
              <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Activity / Period Bell</th>
                  <th className="p-3">Time Slot</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/80">
                {DAILY_8_BELL_SCHEDULE.map((item, idx) => (
                  <tr
                    key={idx}
                    className={
                      item.type === 'Lunch'
                        ? 'bg-amber-500/20 font-extrabold border-y-2 border-amber-500/40 text-amber-300'
                        : item.type === 'Activity'
                        ? 'bg-purple-500/15 font-bold border-y border-purple-500/30 text-purple-300'
                        : item.type === 'Assembly'
                        ? 'bg-indigo-500/15 font-bold'
                        : 'hover:bg-slate-900/50 transition-colors'
                    }
                  >
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <span className="text-base">{item.icon}</span>
                      {item.period}
                    </td>
                    <td className="p-3 font-mono font-bold text-indigo-300">{item.time}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">{item.duration}</td>
                    <td className="p-3">
                      {item.type === 'Lunch' ? (
                        <Badge variant="warning">🍱 Lunch Break (30 Mins)</Badge>
                      ) : item.type === 'Activity' ? (
                        <Badge variant="purple">⏳ Activity / Other Block (1.5 Hours)</Badge>
                      ) : item.type === 'Assembly' ? (
                        <Badge variant="success">🏫 School Start & Assembly</Badge>
                      ) : (
                        <Badge variant="purple">🔔 Academic Period Bell</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setShow8BellScheduleModal(false)}>
              Close Schedule
            </Button>
          </div>
        </div>
      </Modal>

      {/* 👁️ CLASS 8-BELL TIMETABLE VIEW MODAL */}
      <Modal isOpen={!!viewingClass} onClose={() => setViewingClass(null)} size="5xl" title={`Class Timetable: ${viewingClass?.name || ''}`}>
        {viewingClass && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 border border-slate-800 rounded-2xl">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Class Name</span>
                <span className="text-sm font-bold text-white">{viewingClass.name}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Homeroom Teacher</span>
                <span className="text-sm font-bold text-indigo-400">{viewingClass.classTeacher}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Room</span>
                <span className="text-sm font-bold text-slate-200">{viewingClass.room || 'Room 101'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Enrolled Capacity</span>
                <span className="text-sm font-bold text-emerald-400">{viewingClass.totalStudents || 35} Students</span>
              </div>
            </div>

            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              Daily 8-Bell Subject Allocation Schedule (Exact Custom Time Slots):
            </h3>

            <div className="overflow-x-auto border border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs text-slate-300 min-w-[650px]">
                <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Activity / Period Bell</th>
                    <th className="p-3">Time Slot</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Assigned Subject / Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/80">
                  {DAILY_8_BELL_SCHEDULE.map((bell, idx) => {
                    const subjectAssigned = viewingClass.subjectsByBell
                      ? viewingClass.subjectsByBell[idx] || 'Subject Period'
                      : 'Subject Period';
                    const isLunch = bell.type === 'Lunch';
                    const isActivity = bell.type === 'Activity';
                    return (
                      <tr
                        key={idx}
                        className={
                          isLunch
                            ? 'bg-amber-500/20 font-extrabold border-y-2 border-amber-500/40 text-amber-300'
                            : isActivity
                            ? 'bg-purple-500/15 font-bold border-y border-purple-500/30 text-purple-300'
                            : 'hover:bg-slate-900/50 transition-colors'
                        }
                      >
                        <td className="p-3 font-bold text-white flex items-center gap-2">
                          <span className="text-base">{bell.icon}</span>
                          {bell.period}
                        </td>
                        <td className="p-3 font-mono font-bold text-indigo-300">{bell.time}</td>
                        <td className="p-3 font-mono font-bold text-emerald-400">{bell.duration}</td>
                        <td className="p-3 font-semibold">
                          {isLunch ? (
                            <span className="text-amber-300 flex items-center gap-1.5 font-bold">
                              <Utensils className="w-4 h-4 text-amber-400" /> LUNCH BREAK 🍱 (01:00 PM - 01:30 PM • 30 Mins)
                            </span>
                          ) : isActivity ? (
                            <span className="text-purple-300 flex items-center gap-1.5 font-bold">
                              <Sparkles className="w-4 h-4 text-purple-400" /> ACTIVITY / OTHER BLOCK (11:30 AM - 01:00 PM • 1.5 Hours)
                            </span>
                          ) : (
                            <span className="text-white">{subjectAssigned}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setViewingClass(null)}>
                Close Timetable
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingClass}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingClass(null);
        }}
        title={editingClass ? 'Edit Class Allocation' : 'Add New Class & Grade'}
      >
        <form onSubmit={handleSaveClass} className="space-y-4">
          <Input
            label="Class Full Name *"
            placeholder="Class 10 (Board Batch)"
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
                <option value="Nursery">Nursery</option>
                <option value="LKG">LKG</option>
                <option value="UKG">UKG</option>
                <option value="Class 1">Class 1</option>
                <option value="Class 2">Class 2</option>
                <option value="Class 3">Class 3</option>
                <option value="Class 4">Class 4</option>
                <option value="Class 5">Class 5</option>
                <option value="Class 6">Class 6</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 8">Class 8</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
              </select>
            </div>
            <Input
              label="Sections (Comma separated) *"
              placeholder="Sec A, Sec B, Sec C"
              value={formData.sections}
              onChange={(e) => setFormData({ ...formData, sections: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Homeroom Teacher *"
              placeholder="Sunil Sir"
              value={formData.classTeacher}
              onChange={(e) => setFormData({ ...formData, classTeacher: e.target.value })}
              required
            />
            <Input
              label="Assigned Classroom / Lab *"
              placeholder="Room 302"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              required
            />
          </div>

          <Input
            label="Enrolled Student Capacity *"
            type="number"
            value={formData.totalStudents}
            onChange={(e) => setFormData({ ...formData, totalStudents: Number(e.target.value) })}
            required
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
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
              {editingClass ? 'Save Changes' : 'Add Class'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deletingClass} onClose={() => setDeletingClass(null)} title="Confirm Remove Class">
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to remove <b>"{deletingClass?.name}"</b> from the class allocations?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingClass(null)}>
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
