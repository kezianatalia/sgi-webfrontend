// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
// import { useAuth } from './layouts/auth/AuthProvider';

const ProtectedRoute = ({ element, roles, ...rest }) => {
  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role");

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return element;
};

export default ProtectedRoute;
