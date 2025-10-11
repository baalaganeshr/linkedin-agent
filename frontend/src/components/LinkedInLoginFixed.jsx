import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function LinkedInLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/linkedin/authorize`);
      
      if (response.data.authUrl) {
        window.location.href = response.data.authUrl;
      } else {
        setError('Failed to get authorization URL');
        setLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to server. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: '#000000'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          maxWidth: '420px',
          width: '100%'
        }}
      >
        {/* Logo & Title */}
        <div style={{
          textAlign: 'center',
          marginBottom: '64px'
        }}>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: '28px',
              fontWeight: 600,
              color: '#FFFFFF',
              marginBottom: '12px',
              letterSpacing: '-0.03em'
            }}
          >
            LinkedInScholar
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: '15px',
              color: '#71717A',
              fontWeight: 400
            }}
          >
            AI-powered LinkedIn for students
          </motion.p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: '#0A0A0A',
            border: '1px solid #1F1F1F',
            borderRadius: '16px',
            padding: '40px 32px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle gradient overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #8B5CF6, transparent)',
            opacity: 0.3
          }} />

          <h2 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#FFFFFF',
            marginBottom: '8px'
          }}>
            Welcome back
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#71717A',
            marginBottom: '32px'
          }}>
            Sign in with your LinkedIn account to continue
          </p>

          {/* LinkedIn Login Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 24px',
              background: loading ? '#6D28D9' : '#8B5CF6',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.background = '#7C3AED';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.background = '#8B5CF6';
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span>Redirecting</span>
                <span className="loading-dots">...</span>
              </span>
            ) : (
              'Continue with LinkedIn'
            )}
          </motion.button>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: '16px',
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                color: '#EF4444',
                fontSize: '13px'
              }}
            >
              {error}
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            textAlign: 'center',
            fontSize: '13px',
            color: '#52525B',
            marginTop: '32px',
            lineHeight: 1.6
          }}
        >
          By continuing, you agree to our{' '}
          <a href="#" style={{ color: '#8B5CF6', textDecoration: 'none' }}>Terms</a>
          {' '}and{' '}
          <a href="#" style={{ color: '#8B5CF6', textDecoration: 'none' }}>Privacy Policy</a>
        </motion.p>

        {/* Feature Preview Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginTop: '48px'
          }}
        >
          {[
            { icon: '📄', label: 'AI Resume' },
            { icon: '✨', label: 'Profile Tips' },
            { icon: '🤝', label: 'Networking' }
          ].map((item, index) => (
            <div
              key={index}
              style={{
                background: '#0A0A0A',
                border: '1px solid #1F1F1F',
                borderRadius: '12px',
                padding: '16px 12px',
                textAlign: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#2E2E2E';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#1F1F1F';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
              <div style={{ fontSize: '12px', color: '#71717A', fontWeight: 500 }}>
                {item.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* CSS for loading animation */}
      <style>{`
        @keyframes dots {
          0%, 20% { content: '.'; }
          40% { content: '..'; }
          60%, 100% { content: '...'; }
        }
        .loading-dots {
          display: inline-block;
          animation: dots 1.5s infinite;
        }
      `}</style>
    </div>
  );
}