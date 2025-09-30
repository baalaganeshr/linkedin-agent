// Auth Callback Page - Handles LinkedIn OAuth callback
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { AlertCircle } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get token and user data from URL params
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          setError(decodeURIComponent(errorParam));
          return;
        }

        if (!token || !userParam) {
          setError('Missing authentication data');
          return;
        }

        // Parse user data
        const userData = JSON.parse(decodeURIComponent(userParam));

        // Login with token and user data
        const result = await login(token, userData);

        if (result.success) {
          // Redirect to dashboard
          navigate('/dashboard', { replace: true });
        } else {
          setError(result.error || 'Authentication failed');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setError('Failed to process authentication');
      }
    };

    handleCallback();
  }, [searchParams, login, navigate]);

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>

          {/* Error Message */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white">
              Authentication Failed
            </h2>
            <p className="text-gray-400">
              {error}
            </p>
          </div>

          {/* Retry Button */}
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  return <LoadingSpinner message="Completing authentication..." />;
};

export default AuthCallback;