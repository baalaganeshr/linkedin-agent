import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LinkedInLoginMinimal from './components/LinkedInLoginMinimal';
import AuthCallback from './pages/AuthCallbackPhase2';
import DashboardMinimal from './pages/DashboardMinimal';
import { colors } from './styles/colors';

// Import global styles
import './styles/global.css';

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: colors.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: colors.textSecondary,
          fontSize: '15px',
          fontWeight: 500
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid transparent',
            borderTop: `2px solid ${colors.purple}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Loading...
        </div>
      </div>
    );
  }
  
  return token ? children : <Navigate to="/" />;
}

function ErrorPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: colors.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '16px',
      padding: '24px'
    }}>
      <div style={{
        fontSize: '48px',
        marginBottom: '16px'
      }}>
        ⚠️
      </div>
      <h1 style={{
        fontSize: '24px',
        fontWeight: 600,
        color: colors.text,
        marginBottom: '8px',
        textAlign: 'center'
      }}>
        Authentication Error
      </h1>
      <p style={{
        fontSize: '16px',
        color: colors.textSecondary,
        textAlign: 'center',
        maxWidth: '400px',
        lineHeight: '24px'
      }}>
        There was a problem signing you in. Please try again.
      </p>
      <button
        onClick={() => window.location.href = '/'}
        style={{
          marginTop: '24px',
          padding: '12px 24px',
          background: colors.purple,
          color: colors.text,
          border: 'none',
          borderRadius: '8px',
          fontSize: '15px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => e.target.style.background = colors.purpleHover}
        onMouseLeave={(e) => e.target.style.background = colors.purple}
      >
        Back to Login
      </button>
    </div>
  );
}

function AppMinimal() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LinkedInLoginMinimal />} />
          <Route path="/auth/success" element={<AuthCallback />} />
          <Route path="/auth/error" element={<ErrorPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardMinimal />
            </ProtectedRoute>
          } />
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default AppMinimal;