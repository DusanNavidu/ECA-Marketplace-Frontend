import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserFromToken } from '../../utils/auth';

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = getUserFromToken();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}