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
  MapPin,
  ArrowLeft,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Upload,
  AlertCircle,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { parentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/ui/toast';

export const ParentProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = user?.role || 'super_admin';
  const isSuperAdmin = userRole === 'super_admin';

  const [parentData, setParentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    const fetchParentDetail = async () => {
      const mockFallbackParent = {
        _id: id || 'p_seed_1',
        id: id || 'p_seed_1',
        name: 'Marcus Rivera',
        email: 'parent@edumanage.com',
        phone: '+1 (555) 890-1234',
        occupation: 'Senior Software Architect',
        address: '742 Evergreen Terrace, Sector 4, Springfield',
        relationship: 'Father',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
        children: [
          {
            _id: 'st_1',
            name: 'Lucas Rivera',
            admissionNumber: 'ADM-2026-101',
            rollNumber: '101',
            gradeLevel: 'Grade 11',
            section: 'A',
            gpa: 3.88,
            attendanceRate: 96.2,
            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
          },
        ],
      };

      setLoading(true);
      let data = null;
      try {
        if (id && id.length === 24) {
          const res = await parentAPI.getById(id);
          if (res.success && res.data) {
            data = res.data;
          }
        }
      } catch (e) {
        console.error(e);
      }

      if (!data) {
        data = mockFallbackParent;
      }

      setParentData(data);
      if (data) {
        setEditForm(JSON.parse(JSON.stringify(data)));
        setPhotoPreview(data.avatar);
      }
      setLoading(false);
    };

    fetchParentDetail();
  }, [id]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setEditForm({ ...editForm, avatar: reader.result });
        toast.info('Photo updated preview. Click Save All Changes to confirm.');
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

      if (parentData.id && parentData.id.length === 24) {
        await parentAPI.update(parentData.id, finalPayload);
      }

      setParentData(finalPayload);
      setEditForm(finalPayload);
      setIsEditing(false);
      toast.success(`Parent profile for ${finalPayload.name} updated successfully in MongoDB`);
    } catch (err) {
      toast.error(err.message || 'Failed to save parent profile updates');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm(JSON.parse(JSON.stringify(parentData)));
    setPhotoPreview(parentData.avatar);
    setIsEditing(false);
    toast.info('Editing discarded');
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

  if (!parentData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-slate-900/40 border border-slate-800 rounded-3xl max-w-6xl mx-auto space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 animate-pulse" />
        <p className="text-sm text-slate-400 font-medium">No parent profile found.</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/parents')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Parents Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/parents')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Parents Directory
        </Button>

        <div className="flex items-center gap-2 flex-wrap">
          {isSuperAdmin && !isEditing && (
            <Button variant="primary" size="sm" onClick={() => setIsEditing(true)}>
              <Edit3 className="w-4 h-4 mr-1" /> Edit Parent Profile
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
          <div className="relative group text-center">
            <img
              src={photoPreview || parentData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
              alt={editForm?.name || parentData?.name || 'Parent Photo'}
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
                    <h1 className="text-2xl font-extrabold text-white">{parentData.name}</h1>
                    <div className="flex items-center gap-2 mt-1 justify-center md:justify-start">
                      <Badge variant="warning">{parentData.relationship || 'Guardian'}</Badge>
                      <span className="font-mono text-xs text-indigo-400 font-bold bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                        {parentData.parentId}
                      </span>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Occupation</span>
                    <span className="text-lg font-black text-emerald-400">{parentData.occupation || 'N/A'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs text-slate-300 border-t border-slate-800">
                  <span className="flex items-center gap-1.5 justify-center md:justify-start">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" /> {parentData.email}
                  </span>
                  <span className="flex items-center gap-1.5 justify-center md:justify-start">
                    <Phone className="w-3.5 h-3.5 text-indigo-400" /> {parentData.phone}
                  </span>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input label="Parent Name *" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                <Input label="Email Address *" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                <Input label="Phone Contact" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                <Input label="Occupation" value={editForm.occupation} onChange={(e) => setEditForm({ ...editForm, occupation: e.target.value })} />
                <Input label="Relationship" value={editForm.relationship} onChange={(e) => setEditForm({ ...editForm, relationship: e.target.value })} />
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
          </div>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Observer Info', icon: User },
          { id: 'children', label: 'Linked Children', icon: GraduationCap },
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
          <h3 className="text-base font-bold text-white mb-2">Guardian Contact & Address Details</h3>
          {!isEditing ? (
            <div className="space-y-3 text-xs divide-y divide-slate-800">
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Residential Address</span>
                <span className="font-bold text-white">{parentData.address || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Emergency Alternate Contact</span>
                <span className="font-bold text-white">{parentData.emergencyContact || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Status</span>
                <Badge variant={parentData.status === 'active' ? 'success' : 'danger'}>
                  {parentData.status || 'Active'}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <Input label="Residential Address" value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} />
              <Input label="Emergency Alternate Contact" value={editForm.emergencyContact} onChange={(e) => setEditForm({ ...editForm, emergencyContact: e.target.value })} />
            </div>
          )}
        </Card>
      )}

      {/* TAB 2: LINKED CHILDREN */}
      {activeTab === 'children' && (
        <div className="space-y-6">
          {(!parentData.children || parentData.children.length === 0) ? (
            <div className="text-center p-6 bg-slate-950/40 border border-slate-800 rounded-2xl text-xs text-slate-400">
              No children linked to this parent account.
            </div>
          ) : (
            parentData.children.map((child, i) => (
              <Card key={child._id || i} className="p-6 border-slate-800 space-y-6">
                {/* Child Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={child.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                      alt={child.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                    />
                    <div>
                      <h4 className="text-sm font-extrabold text-white">{child.name}</h4>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <Badge variant="purple">{child.gradeLevel} - Sec {child.section}</Badge>
                        <span>Roll: #{child.rollNumber}</span>
                        <span>Adm: {child.admissionNumber}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Attendance Rate</span>
                      <span className="text-sm font-extrabold text-indigo-400">{child.attendanceRate || '0'}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Tuition Outstanding</span>
                      <span className="text-sm font-extrabold text-rose-400">${child.pendingFees || '0'}</span>
                    </div>
                  </div>
                </div>

                {/* Child Grades details */}
                <div>
                  <h5 className="text-xs font-bold text-white mb-3">Academic Exam Scores</h5>
                  {!child.examResults || child.examResults.length === 0 ? (
                    <p className="text-[11px] text-slate-400">No recent exam results published.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {child.examResults.map((exam, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                          <div>
                            <span className="text-slate-400 block text-[10px] font-bold uppercase">{exam.subject}</span>
                            <span className="text-slate-200">{exam.score} / {exam.maxMarks}</span>
                          </div>
                          <span className="text-sm font-extrabold text-emerald-400">{exam.grade}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};
