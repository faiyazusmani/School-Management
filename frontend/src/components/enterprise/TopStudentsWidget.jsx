import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Trophy, Award, Star, CheckCircle, ExternalLink, Edit3, Camera, Upload, Image as ImageIcon } from 'lucide-react';
import { studentAPI } from '../../services/api';
import { compressImage, safeSetItem } from '../../utils/imageCompressor';
import { toast } from '../ui/toast';

export const TopStudentsWidget = () => {
  const navigate = useNavigate();
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Inline Edit Modal state
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', gradeLevel: 'Grade 11', avatar: '' });
  const fileInputRef = useRef(null);

  const mockTopStudents = [
    { id: 'st_ankit', _id: 'st_ankit', name: 'Ankit Kumar', email: 'ankit@student.edu', gradeLevel: 'Grade 12', attendanceRate: 98.8, presentDays: 144, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
    { id: 'st_aarav', _id: 'st_aarav', name: 'Aarav Sharma', email: 'aarav.sharma@student.edu', gradeLevel: 'Grade 12', attendanceRate: 98.2, presentDays: 142, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200' },
    { id: 'st_ananya', _id: 'st_ananya', name: 'Ananya Verma', email: 'ananya.verma@student.edu', gradeLevel: 'Grade 11', attendanceRate: 97.5, presentDays: 140, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
    { id: 'st_rohan', _id: 'st_rohan', name: 'Rohan Gupta', email: 'rohan.gupta@student.edu', gradeLevel: 'Grade 11', attendanceRate: 96.9, presentDays: 139, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
    { id: 'st_anas', _id: 'st_anas', name: 'Anas Usmani', email: 'anas.usmani@student.edu', gradeLevel: 'Grade 8', attendanceRate: 96.2, presentDays: 140, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200' },
  ];

  useEffect(() => {
    fetchTopStudents();
    window.addEventListener('storage', fetchTopStudents);
    return () => window.removeEventListener('storage', fetchTopStudents);
  }, []);

  const fetchTopStudents = async () => {
    setLoading(true);
    let savedLocal = [];
    try {
      savedLocal = JSON.parse(localStorage.getItem('edumanage_students') || '[]');
    } catch (e) {}

    let apiData = [];
    try {
      const res = await studentAPI.getAll({ limit: 50 });
      if (res.success && res.data && res.data.length > 0) {
        apiData = res.data;
      }
    } catch (e) {}

    const combined = [...savedLocal, ...apiData, ...mockTopStudents];

    // Deduplicate students & attach custom email-locked avatar
    const unique = [];
    const seenEmails = new Set();

    for (const st of combined) {
      if (!st || (!st.email && !st.name)) continue;
      const key = (st.email || st.name).toLowerCase();
      if (!seenEmails.has(key)) {
        seenEmails.add(key);
        const customAvatar = st.email ? localStorage.getItem(`edumanage_avatar_${st.email}`) : null;
        unique.push({
          ...st,
          id: st.id || st._id || `st_${key.replace(/[^a-z0-9]/g, '')}`,
          _id: st._id || st.id || `st_${key.replace(/[^a-z0-9]/g, '')}`,
          attendanceRate: st.attendanceRate || 96.0,
          presentDays: st.presentDays || 140,
          avatar: customAvatar || st.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(st.name)}&background=6366f1&color=fff&size=200`,
        });
      }
    }

    const sorted = unique
      .sort((a, b) => b.attendanceRate - a.attendanceRate)
      .slice(0, 5);

    setTopStudents(sorted);
    setLoading(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressedBase64 = await compressImage(file, 300, 300, 0.7);
      setEditForm((prev) => ({ ...prev, avatar: compressedBase64 }));
      toast.success('Photo compressed & loaded! Click Save to apply.');
    }
  };

  const handleSaveInlineEdit = async (e) => {
    e.preventDefault();
    if (!editingStudent) return;

    try {
      const compressedAvatar = editForm.avatar ? await compressImage(editForm.avatar, 300, 300, 0.7) : editForm.avatar;
      const updatedPayload = {
        ...editingStudent,
        name: editForm.name,
        email: editForm.email,
        gradeLevel: editForm.gradeLevel,
        avatar: compressedAvatar,
      };

      // Save to localStorage safely
      if (updatedPayload.email) {
        safeSetItem(`edumanage_avatar_${updatedPayload.email}`, compressedAvatar);
      }
      safeSetItem(`edumanage_student_${updatedPayload.id || updatedPayload._id}`, JSON.stringify(updatedPayload));

      const savedList = JSON.parse(localStorage.getItem('edumanage_students') || '[]');
      const updatedList = savedList.map((st) =>
        (st._id || st.id) === (updatedPayload._id || updatedPayload.id) || (st.email && st.email === updatedPayload.email)
          ? { ...st, ...updatedPayload }
          : st
      );
      if (!savedList.some((st) => (st._id || st.id) === (updatedPayload._id || updatedPayload.id))) {
        updatedList.unshift(updatedPayload);
      }
      safeSetItem('edumanage_students', JSON.stringify(updatedList));

      // Also update in registered profiles
      try {
        const profiles = JSON.parse(localStorage.getItem('edumanage_registered_profiles') || '[]');
        const updatedProfiles = profiles.map((p) =>
          p && p.email && updatedPayload.email && p.email.toLowerCase() === updatedPayload.email.toLowerCase()
            ? { ...p, ...updatedPayload }
            : p
        );
        safeSetItem('edumanage_registered_profiles', JSON.stringify(updatedProfiles));
      } catch (e) {}

      window.dispatchEvent(new Event('storage'));
      fetchTopStudents();
      setEditingStudent(null);
      toast.success(`Student profile & photo for ${updatedPayload.name} updated permanently! 📸`);
    } catch (err) {
      toast.error(err.message || 'Failed to update student details');
    }
  };

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return <span className="flex items-center text-amber-400 font-extrabold text-xs bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 shadow-sm"><Trophy className="w-3.5 h-3.5 mr-1" /> Rank #1</span>;
      case 2:
        return <span className="flex items-center text-slate-300 font-bold text-xs bg-slate-500/10 px-2.5 py-1 rounded-full border border-slate-500/20"><Award className="w-3.5 h-3.5 mr-1" /> Rank #2</span>;
      case 3:
        return <span className="flex items-center text-amber-600 font-bold text-xs bg-amber-700/10 px-2.5 py-1 rounded-full border border-amber-700/20"><Star className="w-3.5 h-3.5 mr-1" /> Rank #3</span>;
      default:
        return <span className="font-bold text-xs text-slate-400">Rank #{rank}</span>;
    }
  };

  return (
    <Card className="p-4 sm:p-6 border-slate-800">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" /> Top Performing Students
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400">Ranked automatically by attendance rate & present days (Click to View or Quick Edit)</p>
        </div>
        <Badge variant="success" className="text-[10px] shrink-0">Auto-Updated</Badge>
      </div>

      <div className="space-y-2.5 sm:space-y-3">
        {topStudents.map((student, index) => {
          const customAv = student.email ? localStorage.getItem(`edumanage_avatar_${student.email}`) : null;
          const displayAvatar = customAv || student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=6366f1&color=fff&size=200`;
          const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=6366f1&color=fff&size=200`;
          const targetId = student._id || student.id;

          return (
            <div
              key={targetId || index}
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/90 transition-all gap-2"
            >
              <div
                onClick={() => navigate(`/dashboard/students/${targetId}`)}
                className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
              >
                <img
                  src={displayAvatar}
                  alt={student.name}
                  onError={(e) => {
                    e.target.src = fallbackAvatar;
                  }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-slate-700 group-hover:border-indigo-500 transition-colors shrink-0 bg-slate-950"
                />
                <div className="min-w-0">
                  <div className="font-bold text-white text-xs sm:text-sm group-hover:text-indigo-400 flex items-center gap-1.5 transition-colors truncate">
                    <span className="truncate">{student.name}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                  <div className="text-[11px] text-slate-400">{student.gradeLevel || 'Grade 11'}</div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 pl-12 sm:pl-0 border-t sm:border-t-0 border-slate-800/60 pt-2 sm:pt-0">
                <div className="text-left sm:text-right">
                  <div className="text-emerald-400 font-extrabold text-xs sm:text-sm">{student.attendanceRate}%</div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-start sm:justify-end gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-400" /> {student.presentDays} Days
                  </div>
                </div>

                <div className="shrink-0">{getRankBadge(index + 1)}</div>

                {/* Quick Edit Button Right in Overview Section */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingStudent(student);
                    setEditForm({
                      name: student.name || '',
                      email: student.email || '',
                      gradeLevel: student.gradeLevel || 'Grade 11',
                      avatar: displayAvatar,
                    });
                  }}
                  title="Quick Edit Student Photo & Details"
                  className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30 transition-colors text-xs font-semibold flex items-center gap-1 shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Edit Modal directly on Overview Page */}
      {editingStudent && (
        <Modal
          isOpen={!!editingStudent}
          onClose={() => setEditingStudent(null)}
          title={`Edit Overview Student: ${editingStudent.name}`}
        >
          <form onSubmit={handleSaveInlineEdit} className="space-y-4">
            {/* Avatar Preview & Upload */}
            <div className="flex flex-col items-center gap-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div className="relative group">
                <img
                  src={editForm.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(editForm.name)}&background=6366f1&color=fff&size=200`}
                  alt={editForm.name}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(editForm.name)}&background=6366f1&color=fff&size=200`;
                  }}
                  className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500 shadow-xl bg-slate-900"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-slate-950/70 flex flex-col items-center justify-center text-white cursor-pointer border-2 border-indigo-400"
                >
                  <Camera className="w-5 h-5 text-indigo-400 mb-0.5" />
                  <span className="text-[8px] font-bold uppercase">Upload</span>
                </button>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-400" /> Upload New Student Photo
              </Button>
            </div>

            <Input
              label="Student Name *"
              placeholder="Indian Name (e.g. Aarav Sharma, Ankit Kumar)"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              required
            />
            <Input
              label="Email Address *"
              type="email"
              placeholder="student@edumanage.com"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              required
            />
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Grade Level</label>
              <select
                value={editForm.gradeLevel}
                onChange={(e) => setEditForm({ ...editForm, gradeLevel: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditingStudent(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Overview Details 📸
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </Card>
  );
};
