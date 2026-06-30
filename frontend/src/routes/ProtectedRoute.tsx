import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../utils/mockData';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  // 1. If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If authenticated but role is not allowed, redirect to their default landing dashboard
  if (!allowedRoles.includes(user.role)) {
    const defaultRedirect = {
      student: '/student/dashboard',
      faculty: '/faculty/dashboard',
      hod: '/hod/dashboard',
      admin: '/admin/dashboard',
      public: '/'
    }[user.role] || '/';

    return <Navigate to={defaultRedirect} replace />;
  }

  // 3. Allowed, render children
  return children;
};
export default ProtectedRoute;
