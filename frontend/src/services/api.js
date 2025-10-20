// API Service for frontend-backend communication
import axios from 'axios';
import { retryRequest, retryOnNetworkError } from '../utils/retry';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Retry logic for network errors and 5xx errors
    if (!originalRequest._retryCount) {
      originalRequest._retryCount = 0;
    }

    if (
      originalRequest._retryCount < 2 && // Max 2 retries
      retryOnNetworkError(error)
    ) {
      originalRequest._retryCount++;
      
      // Exponential backoff
      const delay = 1000 * Math.pow(2, originalRequest._retryCount);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      console.log(`Retrying request (attempt ${originalRequest._retryCount + 1}/3)...`);
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Get LinkedIn auth URL
  getLinkedInAuthUrl: () => api.get('/auth/linkedin'),
  
  // Handle LinkedIn callback
  handleLinkedInCallback: (code, state) => 
    api.post('/auth/linkedin/callback', { code, state }),
  
  // Get current user profile
  getProfile: () => api.get('/auth/profile'),
  
  // Update user profile
  updateProfile: (data) => api.put('/auth/profile', data),
  
  // Delete account
  deleteAccount: () => api.delete('/auth/profile')
};

// Resume API
export const resumeAPI = {
  // Generate AI resume
  generateResume: (data) => api.post('/resume/generate', data),
  
  // Get user's resumes
  getResumes: () => api.get('/resume'),
  
  // Get specific resume
  getResume: (id) => api.get(`/resume/${id}`),
  
  // Update resume
  updateResume: (id, data) => api.put(`/resume/${id}`, data),
  
  // Delete resume
  deleteResume: (id) => api.delete(`/resume/${id}`),
  
  // Download resume as PDF
  downloadResume: (id) => api.get(`/resume/${id}/download`, { 
    responseType: 'blob' 
  })
};

// Profile API
export const profileAPI = {
  // Analyze LinkedIn profile
  analyzeProfile: (linkedinUrl) => api.post('/profile/analyze', { linkedinUrl }),
  
  // Get optimization suggestions
  getOptimizations: () => api.get('/profile/optimizations'),
  
  // Save optimization
  saveOptimization: (data) => api.post('/profile/optimizations', data)
};

// Networking API
export const networkingAPI = {
  // Get networking suggestions
  getSuggestions: (params) => api.get('/networking/suggestions', { params }),
  
  // Generate connection message
  generateMessage: (data) => api.post('/networking/message', data),
  
  // Get networking history
  getHistory: () => api.get('/networking/history'),
  
  // Save networking action
  saveAction: (data) => api.post('/networking/actions', data)
};

// Usage tracking API
export const usageAPI = {
  // Get current usage stats
  getUsage: () => api.get('/auth/usage'),
  
  // Check feature availability
  checkFeature: (feature) => api.get(`/auth/usage/${feature}`)
};

// Utility functions
export const apiUtils = {
  // Handle API errors consistently
  handleError: (error) => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred. Please try again.';
  },
  
  // Format API responses
  formatResponse: (response) => {
    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Success'
    };
  }
};

export default api;