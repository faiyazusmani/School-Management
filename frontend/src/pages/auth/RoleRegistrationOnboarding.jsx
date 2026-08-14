import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  User,
  GraduationCap,
  Briefcase,
  Users,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ShieldCheck,
  Upload,
  Lock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { apiCall } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/ui/toast';

export const RoleRegistrationOnboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, setUser } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const initialRole = queryParams.get('role') || 'student';

  const [role, setRole] = useState(initialRole);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Account Credentials
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    alternateMobile: '',

    // Personal Demographics
    fatherName: '',
    motherName: '',
    dob: '2008-05-14',
    gender: 'Male',
    bloodGroup: 'O+',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',

    // Address Details
    address: '',
    city: '',
    state: '',
    pincode: '',

    // Student Academic
    gradeLevel: 'Grade 11',
    section: 'A',
    rollNumber: `10${Math.floor(Math.random() * 89 + 10)}`,
    admissionNumber: `ADM-2026-${Math.floor(Math.random() * 899 + 100)}`,
    previousSchool: 'St. Xavier High School',

    // Parent / Guardian
    fatherMobile: '',
    fatherEmail: '',
    motherMobile: '',
    motherEmail: '',
    guardianName: '',
    guardianRelationship: 'Father',
    emergencyContact: '',
    linkedStudentAdmissionNumber: '',

    // Teacher Professional
    qualification: 'M.Sc. Physics',
    specialization: 'Quantum Mechanics',
    experienceYears: '8',
    employeeId: `EMP-${Math.floor(Math.random() * 899 + 100)}`,
    department: 'Science & Innovation',
    occupation: 'Senior Software Engineer',
    company: 'TechCorp Solutions',
  });

  const [errors, setErrors] = useState({});

  const handleNextStep = () => {
    // Validate current step
    const newErrors = {};
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Full Name is required';
      if (!formData.fatherName.trim() && role === 'student') newErrors.fatherName = "Father's Name is required";
      if (!formData.motherName.trim() && role === 'student') newErrors.motherName = "Mother's Name is required";
    } else if (step === 2) {
      if (!formData.email.trim()) newErrors.email = 'Email address is required';
      if (!formData.phone.trim()) newErrors.phone = 'Mobile number is required';
    } else if (step === 3) {
      if (role === 'parent' && !formData.linkedStudentAdmissionNumber.trim()) {
        newErrors.linkedStudentAdmissionNumber = 'Child Admission # or Student ID is required';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please complete all required fields on this step');
      return;
    }

    setErrors({});
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        role,
      };

      const res = await apiCall('/auth/register', 'POST', payload);
      if (res.success && res.token && res.user) {
        localStorage.setItem('edumanage_token', res.token);
        localStorage.setItem('edumanage_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        toast.success(`Account registration successful. Welcome to EduManage Pro!`);
        navigate('/dashboard');
      } else {
        toast.error(res.message || 'Registration failed');
      }
    } catch (err) {
      toast.error(err.message || 'Server error during account registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(99,102,241,0.15),transparent_60%)]" />

      <div className="w-full max-w-3xl relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Return to Login
          </Button>
          <Badge variant="purple" className="text-xs uppercase">
            {role} Profile Onboarding
          </Badge>
        </div>

        <Card className="p-8 border-slate-800 shadow-2xl bg-slate-900/90 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-2xl font-black text-white capitalize">{role} Account Onboarding</h1>
            <p className="text-xs text-slate-400">Complete your profile setup to join EduManage Pro</p>

            {/* Step Progress Bar */}
            <div className="flex items-center justify-center gap-2 pt-4">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      step === s
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20'
                        : step > s
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                  </div>
                  {s < 4 && <div className={`w-12 h-1 rounded-full ${step > s ? 'bg-emerald-500' : 'bg-slate-800'}`} />}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmitRegistration} className="space-y-6">
            {/* STEP 1: PERSONAL INFORMATION */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Step 1: Personal Demographics</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Legal Name *"
                    placeholder="e.g. Faiyaz Usmani"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={errors.name}
                    required
                  />
                  {role === 'student' && (
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
                    </>
                  )}
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  />
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full text-xs rounded-xl px-3 py-2 bg-slate-950 border border-slate-800 text-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <Input
                    label="Blood Group"
                    placeholder="O+"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* STEP 2: CONTACT & RESIDENTIAL ADDRESS */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Step 2: Contact Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email Address *"
                    type="email"
                    placeholder="faiyaz@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={errors.email}
                    required
                  />
                  <Input
                    label="Mobile Number *"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    error={errors.phone}
                    required
                  />
                  <Input
                    label="Alternate Mobile Number"
                    placeholder="+91 9876543211"
                    value={formData.alternateMobile}
                    onChange={(e) => setFormData({ ...formData, alternateMobile: e.target.value })}
                  />
                  <Input
                    label="Residential Address"
                    placeholder="124 Innovation Way"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                  <Input
                    label="City"
                    placeholder="Mumbai"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                  <Input
                    label="State"
                    placeholder="Maharashtra"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                  <Input
                    label="Pincode"
                    placeholder="400001"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* STEP 3: ROLE ACADEMIC / PROFESSIONAL / CHILD LINK */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
                  Step 3: {role === 'student' ? 'Academic Details' : role === 'teacher' ? 'Professional Experience' : 'Child Account Link'}
                </h3>

                {role === 'student' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Enrolled Class *"
                      placeholder="e.g. 12"
                      value={formData.gradeLevel}
                      onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                    />
                    <Input
                      label="Section"
                      placeholder="A"
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    />
                    <Input
                      label="Roll Number"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    />
                    <Input
                      label="Admission Number"
                      value={formData.admissionNumber}
                      onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                    />
                    <Input
                      label="Previous Attended School"
                      placeholder="St. Xavier Academy"
                      value={formData.previousSchool}
                      onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                    />
                  </div>
                )}

                {role === 'teacher' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Academic Qualification *"
                      placeholder="Ph.D. Quantum Physics"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    />
                    <Input
                      label="Specialization"
                      placeholder="Advanced Physics"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    />
                    <Input
                      label="Years of Experience"
                      type="number"
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    />
                    <Input
                      label="Employee ID"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    />
                  </div>
                )}

                {role === 'parent' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Child Student Admission # / Email *"
                      placeholder="e.g. ADM-2026-101 or student@example.com"
                      value={formData.linkedStudentAdmissionNumber}
                      onChange={(e) => setFormData({ ...formData, linkedStudentAdmissionNumber: e.target.value })}
                      error={errors.linkedStudentAdmissionNumber}
                      required
                    />
                    <Input
                      label="Parent Occupation"
                      placeholder="Senior Software Engineer"
                      value={formData.occupation}
                      onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    />
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: ACCOUNT SECURITY & SETUP */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Step 4: Account Password & Finalize</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Account Password *"
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <Input
                    label="Confirm Password *"
                    type="password"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            {/* Step Control Buttons */}
            <div className="flex justify-between pt-6 border-t border-slate-800">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={handlePrevStep}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Previous Step
                </Button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <Button type="button" variant="primary" onClick={handleNextStep}>
                  Next Step <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button type="submit" variant="success" className="px-8 py-2.5" disabled={loading}>
                  {loading ? 'Finalizing Account...' : 'Complete Registration'}
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
