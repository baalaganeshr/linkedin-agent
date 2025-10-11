import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContextFixed';
import LinkedInLogin from './components/LinkedInLoginFixed';
import AuthCallback from './pages/AuthCallbackPhase2';
import Dashboard from './pages/DashboardMinimal';
import ResumeGenerator from './pages/ResumeGenerator';

// Import the fixed global styles
import './styles/index.css';

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000000',
        color: '#FFFFFF'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', marginBottom: '8px' }}>Loading...</div>
          <div style={{ fontSize: '14px', color: '#71717A' }}>Please wait</div>
        </div>
      </div>
    );
  }
  
  return token ? children : <Navigate to="/" replace />;
}

function AppFixed() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LinkedInLogin />} />
          <Route path="/auth/success" element={<AuthCallback />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route 
            path="/auth/error" 
            element={
              <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#000000',
                color: '#FFFFFF'
              }}>
                <div style={{
                  background: '#0A0A0A',
                  border: '1px solid #1F1F1F',
                  borderRadius: '16px',
                  padding: '32px',
                  textAlign: 'center',
                  maxWidth: '400px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                  <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Authentication Failed</h2>
                  <p style={{ color: '#71717A', marginBottom: '24px' }}>
                    Unable to sign in with LinkedIn
                  </p>
                  <a 
                    href="/" 
                    style={{
                      display: 'inline-block',
                      padding: '10px 20px',
                      background: '#8B5CF6',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 600
                    }}
                  >
                    Try Again
                  </a>
                </div>
              </div>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/resume-generator" 
            element={
              <ProtectedRoute>
                <ResumeGenerator />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default AppFixed;