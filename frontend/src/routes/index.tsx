import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import PublicPortal from '../pages/PublicPortal';
import Login from '../pages/Login';
import StudentDashboard from '../pages/StudentDashboard';
import FacultyDashboard from '../pages/FacultyDashboard';
import HODDashboard from '../pages/HODDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import ProfilePage from '../pages/ProfilePage';
import { useAuth } from '../context/AuthContext';

export const AppRoutes: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  const IndexRedirect = () => {
    if (isAuthenticated && user) {
      const paths: Record<string, string> = {
        student: '/student/dashboard',
        faculty: '/faculty/dashboard',
        hod:     '/hod/dashboard',
        admin:   '/admin/dashboard',
        public:  '/public',
      };
      return <Navigate to={paths[user.role] || '/public'} replace />;
    }
    return <Navigate to="/login" replace />;
  };

  return (
    <Routes>
      {/* Public */}
      <Route path="/"       element={<IndexRedirect />} />
      <Route path="/public" element={<PublicPortal />} />
      <Route path="/login"  element={<Login />} />

      {/* Student */}
      <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"    element={<StudentDashboard defaultTab="overview" />} />
        <Route path="achievements" element={<StudentDashboard defaultTab="achievements" />} />
        <Route path="attainment"   element={<StudentDashboard defaultTab="attainment" />} />
        <Route path="profile"      element={<ProfilePage />} />
      </Route>

      {/* Faculty */}
      <Route path="/faculty" element={<ProtectedRoute allowedRoles={['faculty']}><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<FacultyDashboard defaultTab="overview" />} />
        <Route path="queue"     element={<FacultyDashboard defaultTab="queue" />} />
        <Route path="history"   element={<FacultyDashboard defaultTab="history" />} />
        <Route path="profile"   element={<ProfilePage />} />
      </Route>

      {/* HOD */}
      <Route path="/hod" element={<ProtectedRoute allowedRoles={['hod']}><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"   element={<HODDashboard defaultTab="overview" />} />
        <Route path="analytics"   element={<HODDashboard defaultTab="analytics" />} />
        <Route path="departments" element={<HODDashboard defaultTab="comparison" />} />
        <Route path="profile"     element={<ProfilePage />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard defaultTab="overview" />} />
        <Route path="users"     element={<AdminDashboard defaultTab="users" />} />
        <Route path="outcomes"  element={<AdminDashboard defaultTab="outcomes" />} />
        <Route path="logs"      element={<AdminDashboard defaultTab="logs" />} />
        <Route path="profile"   element={<ProfilePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
