// Authentication Context for LinkedInScholar
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Auth Context
const AuthContext = createContext();

// Auth Actions
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial State
const initialState = {
  user: null,
  token: localStorage.getItem('linkedinscholar_token'),
  isAuthenticated: false,
  loading: true,
  error: null
};

// Auth Reducer
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
}

// Auth Provider Component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Setup axios interceptors
  useEffect(() => {
    // Request interceptor to add token
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('linkedinscholar_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle auth errors
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
          localStorage.removeItem('linkedinscholar_token');
          localStorage.removeItem('linkedinscholar_user');
          toast.error('Session expired. Please login again.');
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('linkedinscholar_token');
      const savedUser = localStorage.getItem('linkedinscholar_user');

      if (token && savedUser) {
        try {
          // Verify token with backend
          const response = await axios.get('/api/auth/me');
          
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              user: response.data.data.user,
              token: token
            }
          });
        } catch (error) {
          console.error('Auth check failed:', error);
          // Clear invalid token
          localStorage.removeItem('linkedinscholar_token');
          localStorage.removeItem('linkedinscholar_user');
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  // Auth Actions
  const login = async (token, userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });

      // Store token and user data
      localStorage.setItem('linkedinscholar_token', token);
      localStorage.setItem('linkedinscholar_user', JSON.stringify(userData));

      // Get fresh user data from API
      const response = await axios.get('/api/auth/me');

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: response.data.data.user,
          token: token
        }
      });

      toast.success(`Welcome back, ${response.data.data.user.firstName}!`);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      
      // Clear storage on login failure
      localStorage.removeItem('linkedinscholar_token');
      localStorage.removeItem('linkedinscholar_user');

      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('linkedinscholar_token');
      localStorage.removeItem('linkedinscholar_user');
      
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      toast.success('Logged out successfully');
    }
  };

  const updateUser = (userData) => {
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: userData
    });

    // Update localStorage
    const currentUser = JSON.parse(localStorage.getItem('linkedinscholar_user') || '{}');
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem('linkedinscholar_user', JSON.stringify(updatedUser));
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Get LinkedIn authorization URL
  const getLinkedInAuthUrl = async () => {
    try {
      const response = await axios.get('/api/auth/linkedin/authorize');
      return response.data.authUrl;
    } catch (error) {
      console.error('Failed to get LinkedIn auth URL:', error);
      toast.error('Failed to initialize LinkedIn authentication');
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/api/auth/profile', profileData);
      
      updateUser(response.data.data.user);
      toast.success('Profile updated successfully');
      
      return { success: true, user: response.data.data.user };
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Check if user has premium subscription
  const isPremium = () => {
    return state.user?.subscription?.plan === 'premium' && 
           state.user?.subscription?.status === 'active' &&
           new Date() < new Date(state.user?.subscription?.endDate);
  };

  // Check if user can use a feature
  const canUseFeature = (featureType) => {
    if (isPremium()) return true;
    
    const usage = state.user?.usage || {};
    const limits = {
      resumesGenerated: 3,
      profileOptimizations: 5,
      networkingSuggestions: 10
    };
    
    return (usage[featureType] || 0) < (limits[featureType] || 0);
  };

  // Get usage stats
  const getUsageStats = () => {
    const usage = state.user?.usage || {};
    const limits = {
      resumesGenerated: isPremium() ? 'unlimited' : 3,
      profileOptimizations: isPremium() ? 'unlimited' : 5,
      networkingSuggestions: isPremium() ? 'unlimited' : 10
    };

    return {
      resumesGenerated: {
        current: usage.resumesGenerated || 0,
        limit: limits.resumesGenerated,
        canUse: canUseFeature('resumesGenerated')
      },
      profileOptimizations: {
        current: usage.profileOptimizations || 0,
        limit: limits.profileOptimizations,
        canUse: canUseFeature('profileOptimizations')
      },
      networkingSuggestions: {
        current: usage.networkingSuggestions || 0,
        limit: limits.networkingSuggestions,
        canUse: canUseFeature('networkingSuggestions')
      }
    };
  };

  const value = {
    // State
    ...state,
    
    // Actions
    login,
    logout,
    updateUser,
    clearError,
    getLinkedInAuthUrl,
    updateProfile,
    
    // Utilities
    isPremium: isPremium(),
    canUseFeature,
    getUsageStats
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Export context for advanced usage
export { AuthContext };