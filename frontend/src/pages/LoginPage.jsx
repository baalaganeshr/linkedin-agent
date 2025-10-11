// Login Page Component
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LinkedInLogin from '../components/Auth/LinkedInLogin';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LinkedInLogin />;
};

export default LoginPage;