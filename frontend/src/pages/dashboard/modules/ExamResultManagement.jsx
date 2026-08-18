import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { examAPI, resultAPI } from '../../../services/api';
import { toast } from '../../../components/ui/toast';
import { Edit3, Trash2, Calendar, Award, Calendar as CalendarIcon } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export const ExamResultManagement = () => {
  const { user } = useAuth();
  const isStudentOrParent = user?.role === 'student' || user?.role === 'parent';

  const [activeSubTab, setActiveSubTab] = useState('exams'); // 'exams' or 'results'
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const examDateInputRef = useRef(null);

  // Exam state
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [deletingExam, setDeletingExam] = useState(null);
  const [examForm, setExamForm] = useState({
    name: '',
    term: 'Half Yearly Examination',
    className: 'Grade 11-A',
    subject: 'Advanced Physics',
    examDate: '',
    maxMarks: 100,
    passingMarks: 33,
    room: 'Class No 12',
    status: 'Scheduled',
  });

  // Result state
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [deletingResult, setDeletingResult] = useState(null);
  const [resultForm, setResultForm] = useState({
    studentName: '',
    rollNumber: '',
    className: 'Grade 11-A',
    subject: 'Advanced Physics',
    marksObtained: '',
    maxMarks: 100,
    remarks: '',
  });

  const mockExams = [
    {
      _id: 'ex_1',
      id: 'ex_1',
      name: 'Half Yearly Physics Examination',
      term: 'Half Yearly Examination',
      className: 'Grade 11-A',
      subject: 'Advanced Physics',
      examDate: '2026-08-21',
      maxMarks: 100,
      room: 'Class No 12',
      status: 'Scheduled',
    },
    {
      _id: 'ex_2',
      id: 'ex_2',
      name: 'AP Calculus BC Final Exam',
      term: 'Final',
      className: 'Grade 12-B',
      subject: 'Mathematics',
      examDate: '2026-09-20',
      maxMarks: 100,
      room: 'Room 102',
      status: 'Scheduled',
    },
  ];

  const mockResults = [
    {
      _id: 'res_1',
      id: 'res_1',
      studentName: 'Aarav Sharma',
      rollNumber: '101',
      className: 'Grade 11-A',
      subject: 'Advanced Physics',
      marksObtained: 94,
      maxMarks: 100,
      grade: 'A+',
      status: 'Pass',
      remarks: 'Outstanding conceptual mastery in Physics.',
    },
    {
      _id: 'res_2',
      id: 'res_2',
      studentName: 'Owais Usmani',
      rollNumber: '191',
      className: 'Grade 11-A',
      subject: 'Advanced Physics',
      marksObtained: 70,
      maxMarks: 100,
      grade: 'B',
      status: 'Pass',
      remarks: 'Good performance in practical & theory.',
    },
    {
      _id: 'res_3',
      id: 'res_3',
      studentName: 'Ankit',
      rollNumber: '78',
      className: 'Grade 11-A',
      subject: 'Advanced Physics',
      marksObtained: 50,
      maxMarks: 100,
      grade: 'C',
      status: 'Pass',
      remarks: 'Satisfactory performance. Cleared examination.',
    },
    {
      _id: 'res_4',
      id: 'res_4',
      studentName: 'Vicky',
      rollNumber: '100',
      className: 'Grade 11-A',
      subject: 'Advanced Physics',
      marksObtained: 30,
      maxMarks: 100,
      grade: 'F',
      status: 'Fail',
      remarks: 'Needs re-examination & extra guidance.',
    },
  ];

  useEffect(() => {
    fetchExamData();
  }, []);

  // Helper to compute grade & pass/fail status
  const calculateGradeAndStatus = (obtainedMarks, totalMarks = 100) => {
    const obtained = Number(obtainedMarks) || 0;
    const max = Number(totalMarks) || 100;
    const percentage = max > 0 ? (obtained / max) * 100 : 0;

    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 50) grade = 'C';
    else if (percentage >= 33) grade = 'D';

    const status = percentage >= 33 ? 'Pass' : 'Fail';
    return { grade, status };
  };

  const fetchExamData = async () => {
    setLoading(true);
    let localExams = [];
    let localResults = [];
    try {
      localExams = JSON.parse(localStorage.getItem('edumanage_exams') || '[]');
      localResults = JSON.parse(localStorage.getItem('edumanage_results') || '[]');
    } catch (e) {}

    try {
      const [resEx, resRes] = await Promise.all([examAPI.getAll(), resultAPI.getAll()]);
      const baseExams = (resEx.success && resEx.data && resEx.data.length > 0) ? resEx.data : mockExams;
      const combinedExams = [...localExams, ...baseExams];
      const uniqueExams = combinedExams.filter(
        (x, idx, self) => x && (x._id || x.id) && self.findIndex((y) => (y._id || y.id) === (x._id || x.id)) === idx
      );
      setExams(uniqueExams);

      const baseResults = (resRes.success && resRes.data && resRes.data.length > 0) ? resRes.data : mockResults;
      const combinedResults = [...localResults, ...baseResults];
      const normalizedResults = combinedResults.map((r) => {
        const computed = calculateGradeAndStatus(r.marksObtained, r.maxMarks);
        return {
          ...r,
          grade: r.grade && r.grade !== 'F' ? r.grade : computed.grade,
          status: r.status || computed.status,
        };
      });

      const uniqueResults = normalizedResults.filter(
        (r, idx, self) => r && (r._id || r.id || r.studentName) && self.findIndex((y) => (y._id || y.id) === (r._id || r.id)) === idx
      );
      setResults(uniqueResults);
    } catch (err) {
      const combinedExams = [...localExams, ...mockExams];
      const uniqueExams = combinedExams.filter(
        (x, idx, self) => x && (x._id || x.id) && self.findIndex((y) => (y._id || y.id) === (x._id || x.id)) === idx
      );
      setExams(uniqueExams);

      const combinedResults = [...localResults, ...mockResults];
      const normalizedResults = combinedResults.map((r) => {
        const computed = calculateGradeAndStatus(r.marksObtained, r.maxMarks);
        return {
          ...r,
          grade: r.grade && r.grade !== 'F' ? r.grade : computed.grade,
          status: r.status || computed.status,
        };
      });

      const uniqueResults = normalizedResults.filter(
        (r, idx, self) => r && (r._id || r.id || r.studentName) && self.findIndex((y) => (y._id || y.id) === (r._id || r.id)) === idx
      );
      setResults(uniqueResults);
    } finally {
      setLoading(false);
    }
  };

  // --- EXAM HANDLERS ---
  const handleSaveExam = async (e) => {
    e.preventDefault();
    if (!examForm.name || !examForm.subject) return;

    let normalizedTerm = examForm.term;
    if (normalizedTerm.includes('Half Yearly')) normalizedTerm = 'Half Yearly Examination';
    else if (normalizedTerm.includes('Unit Test')) normalizedTerm = 'Unit Test';
    else if (normalizedTerm.includes('Pre-Board') || normalizedTerm.includes('Annual')) normalizedTerm = 'Final';
    else if (normalizedTerm.includes('Mid-Term')) normalizedTerm = 'Mid-Term';

    const payload = {
      ...examForm,
      term: normalizedTerm,
      examDate: examForm.examDate ? examForm.examDate.split('T')[0] : new Date().toISOString().split('T')[0],
    };

    try {
      if (editingExam) {
        try {
          await examAPI.update(editingExam._id || editingExam.id, payload);
        } catch (err) {}
        const updated = exams.map((x) =>
          (x._id || x.id) === (editingExam._id || editingExam.id) ? { ...x, ...payload } : x
        );
        setExams(updated);
        localStorage.setItem('edumanage_exams', JSON.stringify(updated));
        toast.success('Exam schedule updated successfully!');
        setEditingExam(null);
      } else {
        let newExam = {
          _id: `ex_${Date.now()}`,
          id: `ex_${Date.now()}`,
          ...payload,
        };
        try {
          const res = await examAPI.create(payload);
          if (res && res.data) newExam = res.data;
        } catch (err) {}

        const updated = [newExam, ...exams];
        setExams(updated);
        localStorage.setItem('edumanage_exams', JSON.stringify(updated));
        toast.success('New Examination scheduled & saved successfully!');
        setIsExamModalOpen(false);
      }
      resetExamForm();
    } catch (err) {
      toast.error(err.message || 'Failed to save exam schedule');
    }
  };

  const handleDeleteExamConfirm = async () => {
    if (!deletingExam) return;
    try {
      try {
        await examAPI.delete(deletingExam._id || deletingExam.id);
      } catch (e) {}

      const updated = exams.filter((x) => (x._id || x.id) !== (deletingExam._id || deletingExam.id));
      setExams(updated);
      localStorage.setItem('edumanage_exams', JSON.stringify(updated));
      toast.success('Exam deleted successfully');
      setDeletingExam(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete exam');
    }
  };

  const openCalendarPicker = () => {
    if (examDateInputRef.current) {
      if (typeof examDateInputRef.current.showPicker === 'function') {
        examDateInputRef.current.showPicker();
      } else {
        examDateInputRef.current.focus();
      }
    }
  };

  const resetExamForm = () => {
    setExamForm({
      name: '',
      term: 'Half Yearly Examination',
      className: 'Grade 11-A',
      subject: 'Advanced Physics',
      examDate: '',
      maxMarks: 100,
      passingMarks: 33,
      room: 'Class No 12',
      status: 'Scheduled',
    });
  };

  // --- RESULT HANDLERS ---
  const handleSaveResult = async (e) => {
    e.preventDefault();
    if (!resultForm.studentName || !resultForm.marksObtained) return;

    const computed = calculateGradeAndStatus(resultForm.marksObtained, resultForm.maxMarks);

    const payload = {
      ...resultForm,
      grade: computed.grade,
      status: computed.status,
    };

    try {
      if (editingResult) {
        try {
          await resultAPI.update(editingResult._id || editingResult.id, payload);
        } catch (err) {}
        const updated = results.map((r) =>
          (r._id || r.id) === (editingResult._id || editingResult.id) ? { ...r, ...payload } : r
        );
        setResults(updated);
        localStorage.setItem('edumanage_results', JSON.stringify(updated));
        toast.success(`Student result updated: ${computed.status} (${computed.grade})`);
        setEditingResult(null);
      } else {
        let newRecord = {
          _id: `res_${Date.now()}`,
          id: `res_${Date.now()}`,
          ...payload,
        };
        try {
          const res = await resultAPI.create(payload);
          if (res && res.data) newRecord = res.data;
        } catch (err) {}

        const updated = [newRecord, ...results];
        setResults(updated);
        localStorage.setItem('edumanage_results', JSON.stringify(updated));
        toast.success(`Result published for ${resultForm.studentName}: Status ${computed.status} (${computed.grade})`);
        setIsResultModalOpen(false);
      }
      resetResultForm();
    } catch (err) {
      toast.error(err.message || 'Failed to save result');
    }
  };

  const handleDeleteResultConfirm = async () => {
    if (!deletingResult) return;
    try {
      try {
        await resultAPI.delete(deletingResult._id || deletingResult.id);
      } catch (e) {}

      const updated = results.filter((r) => (r._id || r.id) !== (deletingResult._id || deletingResult.id));
      setResults(updated);
      localStorage.setItem('edumanage_results', JSON.stringify(updated));
      toast.success('Result record removed');
      setDeletingResult(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete result');
    }
  };

  const resetResultForm = () => {
    setResultForm({
      studentName: '',
      rollNumber: '',
      className: 'Grade 11-A',
      subject: 'Advanced Physics',
      marksObtained: '',
      maxMarks: 100,
      remarks: '',
    });
  };

  const formatDateClean = (d) => {
    if (!d) return '2026-08-21';
    if (typeof d === 'string' && d.includes('T')) return d.split('T')[0];
    return d;
  };

  const examColumns = [
    { header: 'Examination Title', accessor: 'name' },
    {
      header: 'Exam Term',
      cell: (row) => <Badge variant="purple">{row.term}</Badge>,
    },
    { header: 'Class & Section', accessor: 'className' },
    { header: 'Subject', accessor: 'subject' },
    {
      header: 'Exam Date',
      cell: (row) => <span className="font-mono text-slate-300 text-xs">{formatDateClean(row.examDate)}</span>,
    },
    { header: 'Hall / Room', accessor: 'room' },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            onClick={() => {
              setEditingExam(row);
              setExamForm({
                name: row.name || '',
                term: row.term || 'Half Yearly Examination',
                className: row.className || 'Grade 11-A',
                subject: row.subject || '',
                examDate: formatDateClean(row.examDate),
                maxMarks: row.maxMarks || 100,
                passingMarks: row.passingMarks || 33,
                room: row.room || 'Class No 12',
                status: row.status || 'Scheduled',
              });
            }}
            title="Edit Exam Schedule"
            className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeletingExam(row)}
            title="Delete Exam Schedule"
            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const resultColumns = [
    { header: 'Student Name', accessor: 'studentName' },
    { header: 'Roll No', accessor: 'rollNumber' },
    { header: 'Class', accessor: 'className' },
    { header: 'Subject', accessor: 'subject' },
    {
      header: 'Marks Scored',
      cell: (row) => (
        <span className="font-bold text-white font-mono">
          {row.marksObtained} / {row.maxMarks || 100}
        </span>
      ),
    },
    {
      header: 'Grade',
      cell: (row) => {
        const computed = calculateGradeAndStatus(row.marksObtained, row.maxMarks);
        const gradeVal = row.grade && row.grade !== 'F' ? row.grade : computed.grade;
        return (
          <Badge variant={gradeVal.startsWith('A') || gradeVal === 'B' || gradeVal === 'C' ? 'success' : gradeVal === 'D' ? 'purple' : 'danger'}>
            {gradeVal}
          </Badge>
        );
      },
    },
    {
      header: 'Status',
      cell: (row) => {
        const computed = calculateGradeAndStatus(row.marksObtained, row.maxMarks);
        const statusVal = row.status || computed.status;
        return (
          <Badge variant={statusVal === 'Pass' ? 'success' : 'danger'}>
            {statusVal}
          </Badge>
        );
      },
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            onClick={() => {
              setEditingResult(row);
              setResultForm({
                studentName: row.studentName || '',
                rollNumber: row.rollNumber || '',
                className: row.className || 'Grade 11-A',
                subject: row.subject || '',
                marksObtained: row.marksObtained || '',
                maxMarks: row.maxMarks || 100,
                remarks: row.remarks || '',
              });
            }}
            title="Edit Result"
            className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeletingResult(row)}
            title="Delete Result"
            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const activeExamColumns = isStudentOrParent
    ? examColumns.filter((col) => col.header !== 'Actions')
    : examColumns;

  const activeResultColumns = isStudentOrParent
    ? resultColumns.filter((col) => col.header !== 'Actions')
    : resultColumns;

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex gap-2">
          <Button
            variant={activeSubTab === 'exams' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveSubTab('exams')}
            className="flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" /> Examination Schedules
          </Button>
          <Button
            variant={activeSubTab === 'results' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveSubTab('results')}
            className="flex items-center gap-1.5"
          >
            <Award className="w-4 h-4" /> Student Gradebook & Results
          </Button>
        </div>

        {!isStudentOrParent && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (activeSubTab === 'exams') {
                resetExamForm();
                setEditingExam(null);
                setIsExamModalOpen(true);
              } else {
                resetResultForm();
                setEditingResult(null);
                setIsResultModalOpen(true);
              }
            }}
          >
            + {activeSubTab === 'exams' ? 'Schedule New Examination' : 'Publish Student Result'}
          </Button>
        )}
      </div>

      {activeSubTab === 'exams' ? (
        <DataTable
          title="Examination Schedule Catalog"
          subtitle="Configure exam dates, hall allocations, and subject schedules"
          columns={activeExamColumns}
          data={exams}
          loading={loading}
          filterKey="term"
          filterOptions={['Mid-Term', 'Final', 'Half Yearly Examination', 'Unit Test']}
          emptyStateTitle="No exam schedules found."
          onAdd={
            !isStudentOrParent
              ? () => {
                  resetExamForm();
                  setEditingExam(null);
                  setIsExamModalOpen(true);
                }
              : undefined
          }
        />
      ) : (
        <DataTable
          title="Student Performance & Gradebook"
          subtitle="Filter by Pass, Fail, or All Categories to review student results"
          columns={activeResultColumns}
          data={results}
          loading={loading}
          filterKey="status"
          filterOptions={['Pass', 'Fail']}
          emptyStateTitle="No student results found for selected filter."
          onAdd={
            !isStudentOrParent
              ? () => {
                  resetResultForm();
                  setEditingResult(null);
                  setIsResultModalOpen(true);
                }
              : undefined
          }
        />
      )}

      {/* Add / Edit Exam Modal */}
      <Modal
        isOpen={isExamModalOpen || !!editingExam}
        onClose={() => {
          setIsExamModalOpen(false);
          setEditingExam(null);
        }}
        title={editingExam ? 'Edit Examination Schedule' : 'Schedule New Examination'}
      >
        <form onSubmit={handleSaveExam} className="space-y-4">
          <Input
            label="Exam Title *"
            placeholder="Half Yearly Exam"
            value={examForm.name}
            onChange={(e) => setExamForm({ ...examForm, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Exam Term *</label>
              <select
                value={examForm.term}
                onChange={(e) => setExamForm({ ...examForm, term: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="Half Yearly Examination">Half Yearly Examination</option>
                <option value="Half Yearly">Half Yearly</option>
                <option value="Mid-Term">Mid-Term</option>
                <option value="Final">Final Examination / Board</option>
                <option value="Unit Test">Unit Test</option>
                <option value="Quiz">Quiz / Monthly Test</option>
              </select>
            </div>
            <Input
              label="Subject *"
              placeholder="Physics"
              value={examForm.subject}
              onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Class & Section"
              placeholder="Grade 11-A"
              value={examForm.className}
              onChange={(e) => setExamForm({ ...examForm, className: e.target.value })}
            />

            {/* 📅 Interactive Calendar Date Picker Field */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Exam Date * (Calendar Picker)</label>
              <div className="relative flex items-center">
                <input
                  ref={examDateInputRef}
                  type="date"
                  value={examForm.examDate}
                  onClick={openCalendarPicker}
                  onChange={(e) => setExamForm({ ...examForm, examDate: e.target.value })}
                  required
                  className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none pr-10 cursor-pointer [color-scheme:dark]"
                />
                <button
                  type="button"
                  onClick={openCalendarPicker}
                  className="absolute right-2 p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 hover:text-white transition-colors"
                >
                  <CalendarIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Total Max Marks"
              type="number"
              value={examForm.maxMarks}
              onChange={(e) => setExamForm({ ...examForm, maxMarks: Number(e.target.value) })}
            />
            <Input
              label="Room / Hall Number"
              placeholder="Class No 12"
              value={examForm.room}
              onChange={(e) => setExamForm({ ...examForm, room: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsExamModalOpen(false);
                setEditingExam(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingExam ? 'Save Changes' : 'Schedule Exam'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add / Edit Result Modal */}
      <Modal
        isOpen={isResultModalOpen || !!editingResult}
        onClose={() => {
          setIsResultModalOpen(false);
          setEditingResult(null);
        }}
        title={editingResult ? 'Edit Gradebook Result' : 'Publish New Student Result'}
      >
        <form onSubmit={handleSaveResult} className="space-y-4">
          <Input
            label="Student Full Name *"
            placeholder="Aarav Sharma"
            value={resultForm.studentName}
            onChange={(e) => setResultForm({ ...resultForm, studentName: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Roll Number *"
              placeholder="101"
              value={resultForm.rollNumber}
              onChange={(e) => setResultForm({ ...resultForm, rollNumber: e.target.value })}
              required
            />
            <Input
              label="Class & Section *"
              placeholder="Grade 11-A"
              value={resultForm.className}
              onChange={(e) => setResultForm({ ...resultForm, className: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Subject Name *"
              placeholder="Advanced Physics"
              value={resultForm.subject}
              onChange={(e) => setResultForm({ ...resultForm, subject: e.target.value })}
              required
            />
            <Input
              label="Marks Obtained *"
              type="number"
              placeholder="70"
              value={resultForm.marksObtained}
              onChange={(e) => setResultForm({ ...resultForm, marksObtained: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase text-slate-400">Teacher Remarks / Notes</label>
            <textarea
              rows={3}
              value={resultForm.remarks}
              onChange={(e) => setResultForm({ ...resultForm, remarks: e.target.value })}
              placeholder="Enter student academic performance feedback..."
              className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsResultModalOpen(false);
                setEditingResult(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingResult ? 'Save Changes' : 'Publish Result'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Exam Modal */}
      <Modal isOpen={!!deletingExam} onClose={() => setDeletingExam(null)} title="Confirm Delete Examination">
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to delete exam schedule <b>"{deletingExam?.name}"</b>?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingExam(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteExamConfirm}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Result Modal */}
      <Modal isOpen={!!deletingResult} onClose={() => setDeletingResult(null)} title="Confirm Remove Result">
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to delete result for <b>"{deletingResult?.studentName}"</b> ({deletingResult?.subject})?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingResult(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteResultConfirm}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
