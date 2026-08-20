import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { Login } from '../pages/auth/Login';
import { Signup } from '../pages/auth/Signup';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';
import { AdminOtpVerification } from '../pages/auth/AdminOtpVerification';
import { RoleSelectionOnboarding } from '../pages/auth/RoleSelectionOnboarding';
import { DashboardLayout } from '../pages/dashboard/DashboardLayout';
import { SuperAdminDashboard } from '../pages/dashboard/SuperAdminDashboard';
import { TeacherDashboard } from '../pages/dashboard/TeacherDashboard';
import { StudentDashboard } from '../pages/dashboard/StudentDashboard';

// Module Components
import { StudentManagement } from '../pages/dashboard/modules/StudentManagement';
import { TeacherManagement } from '../pages/dashboard/modules/TeacherManagement';
import { ClassSectionManagement } from '../pages/dashboard/modules/ClassSectionManagement';
import { SubjectManagement } from '../pages/dashboard/modules/SubjectManagement';
import { NoticeBoardManagement } from '../pages/dashboard/modules/NoticeBoardManagement';
import { ExamResultManagement } from '../pages/dashboard/modules/ExamResultManagement';
import { FeeManagement } from '../pages/dashboard/modules/FeeManagement';
import { LibraryManagement } from '../pages/dashboard/modules/LibraryManagement';
import { TransportManagement } from '../pages/dashboard/modules/TransportManagement';
import { AdmissionManagement } from '../pages/dashboard/modules/AdmissionManagement';
import { CalendarEventsManagement } from '../pages/dashboard/modules/CalendarEventsManagement';
import { ProfileManagement } from '../pages/dashboard/modules/ProfileManagement';
import { AuditLogsManagement } from '../pages/dashboard/modules/AuditLogsManagement';
import { RolePermissionManagement } from '../pages/dashboard/modules/RolePermissionManagement';
import { SalaryManagement } from '../pages/dashboard/modules/SalaryManagement';
import { StudentProfileDetail } from '../pages/dashboard/StudentProfileDetail';
import { TeacherProfileDetail } from '../pages/dashboard/TeacherProfileDetail';
import { AttendanceAnalyticsManagement } from '../pages/dashboard/modules/AttendanceAnalyticsManagement';

import { NotFound404 } from '../pages/errors/NotFound404';
import { ServerError500 } from '../pages/errors/ServerError500';
import { Unauthorized403 } from '../pages/errors/Unauthorized403';
import { ProtectedRoute, PublicRoute } from './RouteGuards';
import { useAuth } from '../context/AuthContext';

const DashboardRoleSwitcher = () => {
  const { user } = useAuth();
  const role = user?.role || 'super_admin';

  switch (role) {
    case 'super_admin':
      return <SuperAdminDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'student':
      return <StudentDashboard />;
    default:
      return <SuperAdminDashboard />;
  }
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Auth Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<RoleSelectionOnboarding />} />
        <Route path="/verify-otp" element={<AdminOtpVerification />} />
        <Route path="/register-onboarding" element={<RoleSelectionOnboarding />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardRoleSwitcher />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="students/:id" element={<StudentProfileDetail />} />
          <Route path="users" element={<StudentManagement />} />
          <Route path="teachers" element={<TeacherManagement />} />
          <Route path="teachers/:id" element={<TeacherProfileDetail />} />
          <Route path="salary" element={<SalaryManagement />} />
          <Route path="classes" element={<ClassSectionManagement />} />
          <Route path="subjects" element={<SubjectManagement />} />
          <Route path="notices" element={<NoticeBoardManagement />} />
          <Route path="exams" element={<ExamResultManagement />} />
          <Route path="fees" element={<FeeManagement />} />
          <Route path="finances" element={<FeeManagement />} />
          <Route path="library" element={<LibraryManagement />} />
          <Route path="transport" element={<TransportManagement />} />
          <Route path="admissions" element={<AdmissionManagement />} />
          <Route path="calendar" element={<CalendarEventsManagement />} />
          <Route path="events" element={<CalendarEventsManagement />} />
          <Route path="profile" element={<ProfileManagement />} />
          <Route path="security" element={<ProfileManagement />} />
          <Route path="audit-logs" element={<AuditLogsManagement />} />
          <Route path="permissions" element={<RolePermissionManagement />} />

          {/* Role specific fallbacks */}
          <Route path="timetable" element={<TeacherDashboard />} />
          <Route path="attendance" element={<AttendanceAnalyticsManagement />} />
          <Route path="grades" element={<TeacherDashboard />} />
          <Route path="courses" element={<StudentDashboard />} />
          <Route path="assignments" element={<StudentDashboard />} />
        </Route>
      </Route>

      {/* Error Pages */}
      <Route path="/unauthorized" element={<Unauthorized403 />} />
      <Route path="/500" element={<ServerError500 />} />
      <Route path="*" element={<NotFound404 />} />
    </Routes>
  );
};
