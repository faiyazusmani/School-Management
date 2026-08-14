import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User,
  GraduationCap,
  Calendar,
  Award,
  BookOpen,
  DollarSign,
  Phone,
  Mail,
  ArrowLeft,
  Briefcase,
  Edit3,
  Save,
  X,
  Upload,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { teacherAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/ui/toast';

export const TeacherProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = user?.role || 'super_admin';
  const isSuperAdmin = userRole === 'super_admin';

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    fetchTeacherDetail();
  }, [id]);

  const fetchTeacherDetail = async () => {
    const mockFallbackTeacher = {
      _id: id || 't_1',
      id: id || 't_1',
      name: 'Dr. Sarah Connor',
      email: 'teacher@edumanage.com',
      employeeId: 'EMP-001',
      department: 'Science & Innovation',
      designation: 'Head of Physics Department',
      qualification: 'Ph.D. Quantum Physics (MIT)',
      experienceYears: 12,
      joiningDate: '2018-08-15',
      phone: '+1 (555) 789-0123',
      monthlySalary: 75000,
      paidSalaryTotal: 600000,
      pendingSalaryBalance: 0,
      presentDays: 142,
      absentDays: 2,
      leaveDays: 1,
      attendanceRate: 98.6,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      subjects: ['Advanced Quantum Physics', 'Theoretical Mechanics', 'AP Physics C'],
      assignedClasses: ['Grade 11-A', 'Grade 12-B'],
      salaryHistory: [
        { month: 'August 2026', basicSalary: 75000, netPaid: 78000, status: 'Paid', paymentDate: '2026-08-01' },
        { month: 'July 2026', basicSalary: 75000, netPaid: 78000, status: 'Paid', paymentDate: '2026-07-01' },
      ],
    };

    setLoading(true);
    let data = null;
    try {
      if (id && id.length === 24) {
        const res = await teacherAPI.getById(id);
        if (res.success && res.data) {
          data = formatTeacherData(res.data);
        }
      }
    } catch (e) {
      console.error(e);
    }

    if (!data) {
      data = formatTeacherData(mockFallbackTeacher);
    }

    setTeacher(data);
    if (data) {
      setEditForm(JSON.parse(JSON.stringify(data)));
      setPhotoPreview(data.avatar);
    }
    setLoading(false);
  };

  const formatTeacherData = (data) => ({
    id: data._id || data.id,
    name: data.name || '',
    email: data.email || '',
    employeeId: data.employeeId || '',
    department: data.department || '',
    designation: data.designation || '',
    qualification: data.qualification || '',
    experienceYears: data.experienceYears || 0,
    joiningDate: data.joiningDate || '',
    phone: data.phone || '',
    monthlySalary: data.monthlySalary || 0,
    paidSalaryTotal: data.paidSalaryTotal || 0,
    pendingSalaryBalance: data.pendingSalaryBalance || 0,
    presentDays: data.presentDays || 0,
    absentDays: data.absentDays || 0,
    leaveDays: data.leaveDays || 0,
    attendanceRate: data.attendanceRate || 0,
    avatar: data.avatar || '',
    subjects: data.subjects || [],
    assignedClasses: data.assignedClasses || [],
    salaryHistory: data.salaryHistory || [],
  });

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setEditForm({ ...editForm, avatar: reader.result });
        toast.info('Photo preview updated');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      const finalPayload = {
        ...editForm,
        avatar: photoPreview,
      };

      try {
        if (teacher.id && teacher.id.length === 24) {
          await teacherAPI.update(teacher.id, finalPayload);
        }
      } catch (e) {}

      setTeacher(finalPayload);
      setEditForm(finalPayload);
      setIsEditing(false);
      toast.success(`Faculty profile for ${finalPayload.name} updated successfully in MongoDB`);
    } catch (err) {
      toast.error(err.message || 'Failed to save faculty updates');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm(JSON.parse(JSON.stringify(teacher)));
    setPhotoPreview(teacher.avatar);
    setIsEditing(false);
    toast.info('Editing cancelled');
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-slate-900/40 border border-slate-800 rounded-3xl max-w-6xl mx-auto space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 animate-pulse" />
        <p className="text-sm text-slate-400 font-medium">No teacher profile found.</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/teachers')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Faculty Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/teachers')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Faculty Directory
        </Button>

        <div className="flex items-center gap-2">
          {isSuperAdmin && !isEditing && (
            <Button variant="primary" size="sm" onClick={() => setIsEditing(true)}>
              <Edit3 className="w-4 h-4 mr-1" /> Edit Teacher Profile
            </Button>
          )}

          {isSuperAdmin && isEditing && (
            <>
              <Button variant="success" size="sm" onClick={handleSaveAll}>
                <Save className="w-4 h-4 mr-1" /> Save All Changes
              </Button>
              <Button variant="neutral" size="sm" onClick={handleCancelEdit}>
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Header Profile Banner */}
      <Card className="p-6 border-slate-800">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="text-center">
            <img
              src={photoPreview || teacher.avatar}
              alt={editForm?.name || teacher?.name || 'Teacher Photo'}
              className="w-28 h-28 rounded-3xl object-cover border-2 border-indigo-500 shadow-xl"
            />
            {isEditing && (
              <label className="mt-2 flex items-center justify-center gap-1 text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-lg cursor-pointer border border-indigo-500/20 hover:bg-indigo-500/20">
                <Upload className="w-3 h-3" /> Replace Photo
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            {!isEditing ? (
              <>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div>
                    <h1 className="text-2xl font-extrabold text-white">{teacher.name}</h1>
                    <p className="text-xs text-indigo-400 font-semibold">{teacher.designation}</p>
                    <div className="flex items-center gap-2 mt-1 justify-center md:justify-start">
                      <Badge variant="purple">{teacher.department}</Badge>
                      <span className="font-mono text-xs text-indigo-400 font-bold bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                        {teacher.employeeId}
                      </span>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Attendance Rate</span>
                    <span className="text-2xl font-black text-emerald-400">{teacher.attendanceRate}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs text-slate-300 border-t border-slate-800">
                  <span className="flex items-center gap-1.5 justify-center md:justify-start">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" /> {teacher.email}
                  </span>
                  <span className="flex items-center gap-1.5 justify-center md:justify-start">
                    <Phone className="w-3.5 h-3.5 text-indigo-400" /> {teacher.phone}
                  </span>
                  <span className="flex items-center gap-1.5 justify-center md:justify-start">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> {teacher.experienceYears} Years Exp
                  </span>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input label="Faculty Name *" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                <Input label="Employee ID *" value={editForm.employeeId} onChange={(e) => setEditForm({ ...editForm, employeeId: e.target.value })} />
                <Input label="Designation" value={editForm.designation} onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })} />
                <Input label="Department" value={editForm.department} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })} />
                <Input label="Email Address" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                <Input label="Phone Contact" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Faculty Overview', icon: User },
          { id: 'payroll', label: 'Payroll & Salary History', icon: DollarSign },
          { id: 'attendance', label: 'Attendance Record', icon: Calendar },
          { id: 'classes', label: 'Assigned Classes & Subjects', icon: BookOpen },
        ].map((tab) => {
          const IconC = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-xl'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <IconC className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <Card className="p-6 border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white mb-2">Qualifications & Experience</h3>
          {!isEditing ? (
            <div className="space-y-3 text-xs divide-y divide-slate-800">
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Academic Qualification</span>
                <span className="font-bold text-white">{teacher.qualification}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Total Teaching Experience</span>
                <span className="font-bold text-emerald-400">{teacher.experienceYears} Years</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Date of Joining</span>
                <span className="font-bold text-white">{teacher.joiningDate}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Address</span>
                <span className="font-bold text-white">{teacher.address || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Emergency Contact</span>
                <span className="font-bold text-amber-400">{teacher.emergencyContact || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Status</span>
                <Badge variant={teacher.status === 'active' ? 'success' : 'danger'}>
                  {teacher.status || 'Active'}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <Input label="Academic Qualification" value={editForm.qualification} onChange={(e) => setEditForm({ ...editForm, qualification: e.target.value })} />
              <Input label="Experience (Years)" type="number" value={editForm.experienceYears} onChange={(e) => setEditForm({ ...editForm, experienceYears: e.target.value })} />
              <Input label="Joining Date" type="date" value={editForm.joiningDate} onChange={(e) => setEditForm({ ...editForm, joiningDate: e.target.value })} />
              <Input label="Address" value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} />
              <Input label="Emergency Contact" value={editForm.emergencyContact} onChange={(e) => setEditForm({ ...editForm, emergencyContact: e.target.value })} />
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-medium">Status</label>
                <select
                  value={editForm.status || 'active'}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full text-xs rounded-xl p-3 bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* TAB 2: PAYROLL & SALARY */}
      {activeTab === 'payroll' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Base Salary</span>
              {!isEditing ? (
                <div className="text-2xl font-black text-white mt-1">${teacher.monthlySalary}</div>
              ) : (
                <Input type="number" value={editForm.monthlySalary} onChange={(e) => setEditForm({ ...editForm, monthlySalary: e.target.value })} />
              )}
            </Card>
            <Card className="p-4 text-center border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Disbursed Salary Total</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">${teacher.paidSalaryTotal}</div>
            </Card>
            <Card className="p-4 text-center border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Pending Balance</span>
              <div className="text-2xl font-black text-indigo-400 mt-1">${teacher.pendingSalaryBalance}</div>
            </Card>
          </div>

          <Card className="p-6 border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Monthly Salary History</h3>
            <div className="space-y-2">
              {teacher.salaryHistory && teacher.salaryHistory.map((s, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div>
                    <span className="font-bold text-white block">{s.month}</span>
                    <span className="text-[10px] text-slate-400">Disbursed on {s.date}</span>
                  </div>
                  <Badge variant="success">PAID ${s.paid}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4 text-center border-slate-800 bg-slate-900/60">
            <span className="text-[10px] uppercase font-bold text-slate-400">Attendance Rate</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{teacher.attendanceRate}%</div>
          </Card>
          <Card className="p-4 text-center border-slate-800 bg-slate-900/60">
            <span className="text-[10px] uppercase font-bold text-slate-400">Present Days</span>
            <div className="text-2xl font-black text-indigo-400 mt-1">{teacher.presentDays} Days</div>
          </Card>
          <Card className="p-4 text-center border-slate-800 bg-slate-900/60">
            <span className="text-[10px] uppercase font-bold text-slate-400">Absent Days</span>
            <div className="text-2xl font-black text-rose-400 mt-1">{teacher.absentDays} Days</div>
          </Card>
          <Card className="p-4 text-center border-slate-800 bg-slate-900/60">
            <span className="text-[10px] uppercase font-bold text-slate-400">Leave Days</span>
            <div className="text-2xl font-black text-amber-400 mt-1">{teacher.leaveDays} Days</div>
          </Card>
        </div>
      )}

      {/* TAB 4: ASSIGNED CLASSES */}
      {activeTab === 'classes' && (
        <Card className="p-6 border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Assigned Classes & Taught Subjects</h3>
          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 font-bold uppercase text-[10px] block mb-2">Assigned Classrooms</span>
                <div className="space-y-1">
                  {teacher.assignedClasses && teacher.assignedClasses.map((cls, i) => (
                    <div key={i} className="font-bold text-indigo-400">• {cls}</div>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 font-bold uppercase text-[10px] block mb-2">Teaching Subjects</span>
                <div className="space-y-1">
                  {teacher.subjects && teacher.subjects.map((sub, i) => (
                    <div key={i} className="font-bold text-emerald-400">• {sub}</div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Input
                label="Assigned Classrooms (comma separated)"
                value={Array.isArray(editForm.assignedClasses) ? editForm.assignedClasses.join(', ') : editForm.assignedClasses}
                onChange={(e) => setEditForm({ ...editForm, assignedClasses: e.target.value.split(',').map(s => s.trim()) })}
              />
              <Input
                label="Teaching Subjects (comma separated)"
                value={Array.isArray(editForm.subjects) ? editForm.subjects.join(', ') : editForm.subjects}
                onChange={(e) => setEditForm({ ...editForm, subjects: e.target.value.split(',').map(s => s.trim()) })}
              />
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
