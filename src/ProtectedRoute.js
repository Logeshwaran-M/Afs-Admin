import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFirebase } from './context/FirebaseContext';
import LoadingSpinner from './components/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAdmin } = useFirebase();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    console.log('No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    console.log('Not admin, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('Admin access granted');
  return children;
};

export default ProtectedRoute;