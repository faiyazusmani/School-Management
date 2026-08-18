import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  Briefcase,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Lock,
  Mail,
  User,
  Phone,
  Check,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { apiCall } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/ui/toast';

export const RoleSelectionOnboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setToken, setUser } = useAuth();

  const [step, setStep] = useState(1); // Step 1: Select Role, Step 2: Onboarding Form, Step 3: Credentials & Finalize
  const [selectedRole, setSelectedRole] = useState(null); // 'student', 'teacher', or 'parent'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && (user.role === 'super_admin' || user.email?.toLowerCase().includes('admin'))) {
      navigate('/dashboard', { replace: true });
      return;
    }

    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        avatar: user.avatar || prev.avatar,
      }));
    }

    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam && ['student', 'teacher', 'parent'].includes(roleParam)) {
      setSelectedRole(roleParam);
      setStep(2);
    }

    const prefilled = location.state?.prefilled;
    if (prefilled) {
      setFormData((prev) => ({
        ...prev,
        name: prefilled.name || prev.name,
        email: prefilled.email || prev.email,
        avatar: prefilled.avatar || prev.avatar,
      }));
    }
  }, [location.search, location.state, user]);

  const [formData, setFormData] = useState({
    // Account details
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',

    // Student Demographics & Academic
    fatherName: '',
    motherName: '',
    dob: '2008-05-14',
    gender: 'Male',
    bloodGroup: 'O+',
    gradeLevel: 'Grade 11',
    section: 'A',
    rollNumber: `10${Math.floor(Math.random() * 89 + 10)}`,
    admissionNumber: `ADM-2026-${Math.floor(Math.random() * 899 + 100)}`,
    previousSchool: 'St. Xavier High School',

    // Parent Onboarding
    linkedStudentAdmissionNumber: '',
    occupation: 'Business Professional',

    // Teacher Onboarding
    qualification: 'M.Sc. Physics',
    specialization: 'Quantum Mechanics',
    experienceYears: '5',
    employeeId: `EMP-${Math.floor(Math.random() * 899 + 100)}`,
    department: 'Science Department',
  });

  const [errors, setErrors] = useState({});

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep(2); // Instantly advance to the onboarding form step
    toast.success(`Selected Role: ${role.charAt(0).toUpperCase() + role.slice(1)}`);
  };

  const handleFormValidation = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full Legal Name is required';

    if (selectedRole === 'student') {
      if (!formData.fatherName.trim()) newErrors.fatherName = "Father's Name is required";
      if (!formData.motherName.trim()) newErrors.motherName = "Mother's Name is required";
    }

    if (selectedRole === 'parent') {
      if (!formData.linkedStudentAdmissionNumber.trim()) {
        newErrors.linkedStudentAdmissionNumber = 'Child Admission ID or Email is required';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please complete all required fields');
      return false;
    }

    setErrors({});
    return true;
  };

  const handleFormStepNext = () => {
    if (handleFormValidation()) {
      setStep(3); // Advance to Account Credentials step
    }
  };

  const handleSubmitOnboarding = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Full Legal Name is required');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Email address is required');
      return;
    }
    if (!user && formData.password && formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    if (!user && formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const updatedUser = {
        ...user,
        id: user?.id || `usr_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '+91 98765 43210',
        role: selectedRole || 'student',
        fatherName: formData.fatherName || 'N/A',
        motherName: formData.motherName || 'N/A',
        gradeLevel: formData.gradeLevel || 'Grade 11',
        section: formData.section || 'A',
        rollNumber: formData.rollNumber || '101',
        admissionNumber: formData.admissionNumber || 'ADM-2026-101',
        previousSchool: formData.previousSchool || 'St. Xavier High School',
        occupation: formData.occupation || 'Business Professional',
        linkedStudentAdmissionNumber: formData.linkedStudentAdmissionNumber || 'ADM-2026-101',
        qualification: formData.qualification || 'M.Sc. Physics',
        specialization: formData.specialization || 'Quantum Mechanics',
        experienceYears: formData.experienceYears || '5',
        employeeId: formData.employeeId || 'EMP-101',
        department: formData.department || 'Science Department',
        onboardingCompleted: true,
        status: 'active',
        avatar: user?.avatar || formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      };

      try {
        await apiCall('/auth/register', 'POST', updatedUser);
      } catch (err) {}

      localStorage.setItem('edumanage_user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      try {
        const profiles = JSON.parse(localStorage.getItem('edumanage_registered_profiles') || '[]');
        const existingIdx = profiles.findIndex((p) => p && p.email && updatedUser.email && p.email.toLowerCase() === updatedUser.email.toLowerCase());
        if (existingIdx !== -1) {
          profiles[existingIdx] = { ...profiles[existingIdx], ...updatedUser };
          localStorage.setItem('edumanage_registered_profiles', JSON.stringify(profiles));
        } else {
          localStorage.setItem('edumanage_registered_profiles', JSON.stringify([updatedUser, ...profiles]));
        }
        window.dispatchEvent(new Event('storage'));
      } catch (e) {}

      if (selectedRole === 'student') {
        toast.success(`Profile onboarding completed! Welcome, ${updatedUser.name}.`);
        navigate('/', { replace: true });
      } else {
        toast.success(`Profile onboarding completed! Welcome to ${selectedRole} portal.`);
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Server error during onboarding registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(99,102,241,0.15),transparent_60%)]" />

      <div className="w-full max-w-3xl relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (step > 1) setStep(step - 1);
              else navigate('/login');
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">
            Step {step} of 3
          </span>
        </div>

        <Card className="p-4 sm:p-8 border-slate-800 shadow-2xl bg-slate-900/90 backdrop-blur-xl">
          {/* STEP 1: CHOOSE ROLE CARDS */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-black tracking-tight text-white">Join EduManage Pro</h1>
                <p className="text-sm text-slate-400">Choose your institutional role to start onboarding profile</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Student Card */}
                <div
                  onClick={() => handleRoleSelect('student')}
                  className="group relative cursor-pointer p-6 rounded-2xl border border-slate-800 bg-slate-950/60 hover:bg-indigo-600/10 hover:border-indigo-500 transition-all text-center flex flex-col justify-between space-y-4 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-white group-hover:text-indigo-300">🎓 Student</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Access homework, check class schedules, and view academic reports.
                    </p>
                  </div>
                  <div className="pt-2 text-xs font-bold text-indigo-400 flex items-center justify-center gap-1 group-hover:translate-x-1 transition-transform">
                    Select Student <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Teacher Card */}
                <div
                  onClick={() => handleRoleSelect('teacher')}
                  className="group relative cursor-pointer p-6 rounded-2xl border border-slate-800 bg-slate-950/60 hover:bg-indigo-600/10 hover:border-indigo-500 transition-all text-center flex flex-col justify-between space-y-4 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                >
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                    <Briefcase className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-white group-hover:text-indigo-300">👩‍🏫 Teacher</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Grade exam sheets, log attendance rate, and coordinate courses.
                    </p>
                  </div>
                  <div className="pt-2 text-xs font-bold text-indigo-400 flex items-center justify-center gap-1 group-hover:translate-x-1 transition-transform">
                    Select Teacher <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Parent Card */}
                <div
                  onClick={() => handleRoleSelect('parent')}
                  className="group relative cursor-pointer p-6 rounded-2xl border border-slate-800 bg-slate-950/60 hover:bg-indigo-600/10 hover:border-indigo-500 transition-all text-center flex flex-col justify-between space-y-4 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                >
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                    <Users className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-white group-hover:text-indigo-300">👨‍👩‍👧 Parent</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Link accounts with children, trace fee vouchers, and monitor attendance.
                    </p>
                  </div>
                  <div className="pt-2 text-xs font-bold text-indigo-400 flex items-center justify-center gap-1 group-hover:translate-x-1 transition-transform">
                    Select Parent <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ONBOARDING DEMOGRAPHIC PROFILE */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <Badge variant="purple" className="uppercase">{selectedRole} Details</Badge>
                <h2 className="text-2xl font-black text-white">Profile Onboarding Information</h2>
                <p className="text-xs text-slate-400">Please provide accurate details to create your school profile</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Legal Full Name *"
                  placeholder="e.g. Faiyaz Usmani"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name}
                  required
                />
                <Input
                  label="Mobile Contact *"
                  placeholder="e.g. +91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />

                {/* Role specific profile fields */}
                {selectedRole === 'student' && (
                  <>
                    <Input
                      label="Father's Full Name *"
                      placeholder="e.g. Mohammed Usmani"
                      value={formData.fatherName}
                      onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                      error={errors.fatherName}
                      required
                    />
                    <Input
                      label="Mother's Full Name *"
                      placeholder="e.g. Ayesha Usmani"
                      value={formData.motherName}
                      onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                      error={errors.motherName}
                      required
                    />
                    <Input
                      label="Enrolled Class/Grade"
                      placeholder="e.g. Grade 11"
                      value={formData.gradeLevel}
                      onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                    />
                    <Input
                      label="Section"
                      placeholder="A"
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    />
                  </>
                )}

                {selectedRole === 'teacher' && (
                  <>
                    <Input
                      label="Academic Qualification *"
                      placeholder="e.g. Ph.D. Physics"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      required
                    />
                    <Input
                      label="Specialization Domain"
                      placeholder="e.g. Electromagnetism"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    />
                    <Input
                      label="Employee Roster ID"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    />
                  </>
                )}

                {selectedRole === 'parent' && (
                  <>
                    <Input
                      label="Child Student Admission ID / Email *"
                      placeholder="e.g. ADM-2026-101"
                      value={formData.linkedStudentAdmissionNumber}
                      onChange={(e) => setFormData({ ...formData, linkedStudentAdmissionNumber: e.target.value })}
                      error={errors.linkedStudentAdmissionNumber}
                      required
                    />
                    <Input
                      label="Occupation"
                      placeholder="e.g. Software Consultant"
                      value={formData.occupation}
                      onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    />
                  </>
                )}
              </div>

              <div className="flex justify-between pt-6 border-t border-slate-800">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button type="button" variant="primary" onClick={handleFormStepNext}>
                  Next: Account Details <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: ACCOUNT CREDENTIALS & SUBMIT */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <Badge variant="purple">Account Security</Badge>
                <h2 className="text-2xl font-black text-white">Create Account Security</h2>
                <p className="text-xs text-slate-400">Attach email address and credentials to finalize registration</p>
              </div>

              <form onSubmit={handleSubmitOnboarding} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email Address *"
                    type="email"
                    icon={Mail}
                    placeholder="sarah@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <div />
                  <Input
                    label="Account Password *"
                    type="password"
                    icon={Lock}
                    placeholder="Minimum 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <Input
                    label="Confirm Password *"
                    type="password"
                    icon={Lock}
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="flex justify-between pt-6 border-t border-slate-800">
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button type="submit" variant="success" className="px-6" disabled={loading}>
                    {loading ? 'Setting up portal...' : 'Complete Profile Setup'}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
