import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const location = useLocation();

  const userToken = sessionStorage.getItem('token');
  const adminToken = sessionStorage.getItem('admintoken');

  if (requireAdmin) {
    if (!adminToken) {
      return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    try {
      const decoded = jwtDecode(adminToken);
      if (decoded.type !== 'admin') {
        return <Navigate to="/signin" replace />;
      }
      return children;
    } catch (err) {
      console.error("Failed to decode admin token:", err);
      return <Navigate to="/signin" state={{ from: location }} replace />;
    }
  }

  if (!userToken && !adminToken) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;