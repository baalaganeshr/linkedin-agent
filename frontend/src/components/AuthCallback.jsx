import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Authenticating with LinkedIn...');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Get authorization code from LinkedIn
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        
        if (error) {
          console.error('LinkedIn OAuth error:', error);
          setStatus('Authentication cancelled or failed');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        if (!code) {
          console.error('No authorization code received');
          setStatus('No authorization code received');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        console.log('Authorization code received:', code.substring(0, 10) + '...');
        setStatus('Exchanging code for access token...');

        // Exchange code for access token
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/linkedin/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ code })
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
          console.log('Authentication successful:', data);
          setStatus('Authentication successful! Welcome!');
          setSuccess(true);
          
          // Store user data and token in localStorage
          if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
          }
          if (data.token) {
            localStorage.setItem('token', data.token);
          }
          
          // Redirect to dashboard after showing success
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          console.error('Authentication failed:', data);
          setStatus(data.message || 'Authentication failed');
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('Connection error. Please try again.');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleAuth();
  }, [searchParams, navigate]);

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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{
          background: '#0A0A0A',
          border: '1px solid #1F1F1F',
          borderRadius: '24px',
          padding: '48px',
          textAlign: 'center',
          maxWidth: '420px',
          width: '100%'
        }}
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          style={{
            fontSize: '64px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          {success ? '✅' : '⏳'}
        </motion.div>

        {/* Status Message */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#FFFFFF',
            marginBottom: '16px',
            letterSpacing: '-0.02em'
          }}
        >
          {success ? 'Welcome to LinkedInScholar!' : 'Connecting...'}
        </motion.h2>

        {/* Status Detail */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            fontSize: '16px',
            color: '#A1A1AA',
            lineHeight: 1.6,
            marginBottom: '32px'
          }}
        >
          {status}
        </motion.p>

        {/* Loading Indicator */}
        {!success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#8B5CF6'
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            style={{
              padding: '16px',
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '12px',
              color: '#22C55E'
            }}
          >
            <p style={{ fontSize: '14px', margin: 0 }}>
              Redirecting to your dashboard...
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}