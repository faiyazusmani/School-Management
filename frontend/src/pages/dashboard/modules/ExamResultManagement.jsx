import React, { useEffect, useState } from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { examAPI, resultAPI } from '../../../services/api';
import { toast } from '../../../components/ui/toast';
import { Edit3, Trash2, Calendar, Award } from 'lucide-react';

import { useAuth } from '../../../context/AuthContext';

export const ExamResultManagement = () => {
  const { user } = useAuth();
  const isStudentOrParent = user?.role === 'student' || user?.role === 'parent';

  const [activeSubTab, setActiveSubTab] = useState('exams'); // 'exams' or 'results'
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Exam state
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [deletingExam, setDeletingExam] = useState(null);
  const [examForm, setExamForm] = useState({
    name: '',
    term: 'Mid-Term',
    className: 'Grade 11-A',
    subject: 'Advanced Physics',
    examDate: '',
    maxMarks: 100,
    passingMarks: 40,
    room: 'Hall A',
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

  useEffect(() => {
    fetchExamData();
  }, []);

  const fetchExamData = async () => {
    setLoading(true);
    try {
      const [resEx, resRes] = await Promise.all([examAPI.getAll(), resultAPI.getAll()]);
      if (resEx.success && resEx.data) setExams(resEx.data);
      if (resRes.success && resRes.data) setResults(resRes.data);
    } catch (err) {
      toast.error(err.message || 'Failed to load exam data');
    } finally {
      setLoading(false);
    }
  };

  // --- EXAM HANDLERS ---
  const handleSaveExam = async (e) => {
    e.preventDefault();
    if (!examForm.name || !examForm.subject) return;

    try {
      if (editingExam) {
        await examAPI.update(editingExam._id || editingExam.id, examForm);
        setExams((prev) =>
          prev.map((x) => ((x._id || x.id) === (editingExam._id || editingExam.id) ? { ...x, ...examForm } : x))
        );
        toast.success('Exam updated successfully!');
        setEditingExam(null);
      } else {
        const res = await examAPI.create(examForm);
        if (res.data) setExams((prev) => [res.data, ...prev]);
        toast.success('Exam scheduled successfully!');
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
      await examAPI.delete(deletingExam._id || deletingExam.id);
      setExams((prev) => prev.filter((x) => (x._id || x.id) !== (deletingExam._id || deletingExam.id)));
      toast.success('Exam deleted successfully');
      setDeletingExam(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete exam');
    }
  };

  const resetExamForm = () => {
    setExamForm({
      name: '',
      term: 'Mid-Term',
      className: 'Grade 11-A',
      subject: 'Advanced Physics',
      examDate: '',
      maxMarks: 100,
      passingMarks: 40,
      room: 'Hall A',
      status: 'Scheduled',
    });
  };

  // --- RESULT HANDLERS ---
  const handleSaveResult = async (e) => {
    e.preventDefault();
    if (!resultForm.studentName || !resultForm.rollNumber) return;

    try {
      if (editingResult) {
        await resultAPI.update(editingResult._id || editingResult.id, resultForm);
        const score = Number(resultForm.marksObtained);
        const max = Number(resultForm.maxMarks) || 100;
        const pct = ((score / max) * 100).toFixed(1);
        let gr = 'F';
        if (pct >= 90) gr = 'A';
        else if (pct >= 80) gr = 'B';
        else if (pct >= 70) gr = 'C';
        else if (pct >= 60) gr = 'D';

        setResults((prev) =>
          prev.map((r) =>
            (r._id || r.id) === (editingResult._id || editingResult.id)
              ? { ...r, ...resultForm, percentage: pct, grade: gr, status: pct >= 40 ? 'Pass' : 'Fail' }
              : r
          )
        );
        toast.success('Result record updated successfully!');
        setEditingResult(null);
      } else {
        const res = await resultAPI.create(resultForm);
        if (res.data) setResults((prev) => [res.data, ...prev]);
        toast.success(`Result published for ${resultForm.studentName}`);
        setIsResultModalOpen(false);
      }
      resetResultForm();
    } catch (err) {
      toast.error(err.message || 'Failed to save result record');
    }
  };

  const handleDeleteResultConfirm = async () => {
    if (!deletingResult) return;
    try {
      await resultAPI.delete(deletingResult._id || deletingResult.id);
      setResults((prev) => prev.filter((r) => (r._id || r.id) !== (deletingResult._id || deletingResult.id)));
      toast.success('Result record deleted successfully');
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

  // Columns definitions
  const examColumns = [
    {
      header: 'Exam Title & Term',
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-100 block">{row.name}</span>
          <span className="text-[11px] text-slate-400">{row.term}</span>
        </div>
      ),
    },
    { header: 'Subject', accessor: 'subject' },
    { header: 'Class', accessor: 'className' },
    {
      header: 'Exam Date',
      cell: (row) => <span>{row.examDate ? row.examDate.split('T')[0] : 'N/A'}</span>,
    },
    {
      header: 'Max Marks',
      cell: (row) => <span className="font-mono text-xs">{row.maxMarks || 100}</span>,
    },
    { header: 'Hall/Room', accessor: 'room' },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setEditingExam(row);
              setExamForm({
                name: row.name || '',
                term: row.term || 'Mid-Term',
                className: row.className || 'Grade 11-A',
                subject: row.subject || 'Advanced Physics',
                examDate: row.examDate ? row.examDate.split('T')[0] : '',
                maxMarks: row.maxMarks || 100,
                passingMarks: row.passingMarks || 40,
                room: row.room || 'Hall A',
                status: row.status || 'Scheduled',
              });
            }}
            title="Edit Exam"
            className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeletingExam(row)}
            title="Delete Exam"
            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const resultColumns = [
    {
      header: 'Student Name',
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-100 block">{row.studentName}</span>
          <span className="text-[11px] font-mono text-indigo-400">Roll #{row.rollNumber}</span>
        </div>
      ),
    },
    { header: 'Subject', accessor: 'subject' },
    {
      header: 'Score (Obtained / Max)',
      cell: (row) => (
        <span className="font-bold text-slate-200">
          {row.marksObtained} / {row.maxMarks || 100}
        </span>
      ),
    },
    {
      header: 'Percentage',
      cell: (row) => (
        <span className="font-mono text-xs text-indigo-300 font-bold">
          {row.percentage || (((row.marksObtained || 0) / (row.maxMarks || 100)) * 100).toFixed(1)}%
        </span>
      ),
    },
    {
      header: 'Grade',
      cell: (row) => (
        <Badge variant={row.grade === 'F' ? 'danger' : 'success'}>{row.grade || 'A'}</Badge>
      ),
    },
    {
      header: 'Result Status',
      cell: (row) => (
        <Badge variant={row.status === 'Fail' ? 'danger' : 'success'}>
          {row.status || 'Pass'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setEditingResult(row);
              setResultForm({
                studentName: row.studentName || '',
                rollNumber: row.rollNumber || '',
                className: row.className || 'Grade 11-A',
                subject: row.subject || 'Advanced Physics',
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

  const activeExamColumns = isStudentOrParent ? examColumns.filter((c) => c.header !== 'Actions') : examColumns;
  const activeResultColumns = isStudentOrParent ? resultColumns.filter((c) => c.header !== 'Actions') : resultColumns;

  return (
    <div className="space-y-6">
      {/* Sub Tab Selection */}
      <div className="flex items-center gap-2 sm:gap-3 border-b border-slate-800 pb-3 flex-wrap">
        <button
          onClick={() => setActiveSubTab('exams')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'exams'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4 shrink-0" /> Exam Schedules ({exams.length})
        </button>
        <button
          onClick={() => setActiveSubTab('results')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'results'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4 shrink-0" /> Academic Results & Grades ({results.length})
        </button>
      </div>

      {activeSubTab === 'exams' ? (
        <DataTable
          title="Examination Schedule Catalog"
          subtitle="Configure upcoming term examinations, test dates, and hall seating allocations"
          columns={activeExamColumns}
          data={exams}
          loading={loading}
          filterKey="term"
          filterOptions={['Unit Test 1', 'Half Yearly Examination', 'Unit Test 2', 'Pre-Board Examination', 'Annual Examination', 'Mid-Term']}
          emptyStateTitle="No exams found."
          onAdd={!isStudentOrParent ? () => {
            resetExamForm();
            setEditingExam(null);
            setIsExamModalOpen(true);
          } : undefined}
        />
      ) : (
        <DataTable
          title="Student Gradebook & Performance Records"
          subtitle="Publish student test marks, automatically calculate percentage & letter grades"
          columns={activeResultColumns}
          data={results}
          loading={loading}
          filterKey="subject"
          filterOptions={['Advanced Physics', 'AP Calculus BC', 'Mathematics', 'Chemistry', 'English', 'Computer Science']}
          emptyStateTitle="No exam results found."
          onAdd={!isStudentOrParent ? () => {
            resetResultForm();
            setEditingResult(null);
            setIsResultModalOpen(true);
          } : undefined}
        />
      )}

      {/* Add / Edit Exam Modal */}
      <Modal
        isOpen={isExamModalOpen || !!editingExam}
        onClose={() => {
          setIsExamModalOpen(false);
          setEditingExam(null);
        }}
        title={editingExam ? 'Edit Scheduled Exam' : 'Schedule New Examination'}
      >
        <form onSubmit={handleSaveExam} className="space-y-4">
          <Input
            label="Exam Title *"
            placeholder="Half Yearly Examination"
            value={examForm.name}
            onChange={(e) => setExamForm({ ...examForm, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Exam Term</label>
              <select
                value={examForm.term}
                onChange={(e) => setExamForm({ ...examForm, term: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="Unit Test 1">Unit Test 1</option>
                <option value="Half Yearly Examination">Half Yearly Examination</option>
                <option value="Unit Test 2">Unit Test 2</option>
                <option value="Pre-Board Examination">Pre-Board Examination</option>
                <option value="Annual Examination">Annual Examination</option>
                <option value="Mid-Term">Mid-Term</option>
              </select>
            </div>
            <Input
              label="Subject *"
              placeholder="Mathematics"
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
            <Input
              label="Exam Date *"
              type="date"
              value={examForm.examDate}
              onChange={(e) => setExamForm({ ...examForm, examDate: e.target.value })}
              required
            />
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
              placeholder="Hall A"
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
              label="Subject *"
              placeholder="Advanced Physics"
              value={resultForm.subject}
              onChange={(e) => setResultForm({ ...resultForm, subject: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Marks Obtained *"
              type="number"
              value={resultForm.marksObtained}
              onChange={(e) => setResultForm({ ...resultForm, marksObtained: e.target.value })}
              required
            />
            <Input
              label="Max Marks"
              type="number"
              value={resultForm.maxMarks}
              onChange={(e) => setResultForm({ ...resultForm, maxMarks: e.target.value })}
            />
          </div>
          <Input
            label="Faculty Remarks"
            placeholder="Excellent analytical performance"
            value={resultForm.remarks}
            onChange={(e) => setResultForm({ ...resultForm, remarks: e.target.value })}
          />
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
      <Modal isOpen={!!deletingExam} onClose={() => setDeletingExam(null)} title="Confirm Delete Exam">
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to remove exam schedule <b>"{deletingExam?.name}"</b>?
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
      <Modal isOpen={!!deletingResult} onClose={() => setDeletingResult(null)} title="Confirm Delete Result Record">
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to delete the result record for <b>{deletingResult?.studentName}</b>?
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
