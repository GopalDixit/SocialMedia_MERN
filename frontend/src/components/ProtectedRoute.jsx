import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, authRoute, redirectPath = '/', feedPath = '/feed' }) => {
  const token = localStorage.getItem('token');

  if (authRoute && token) {
    return <Navigate to={feedPath} replace />;
  }

  if (!authRoute && !token) {
    return <Navigate to={redirectPath} replace />;
  }

  return element;
};

export default ProtectedRoute;
