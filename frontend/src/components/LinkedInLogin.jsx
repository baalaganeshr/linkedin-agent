import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function LinkedInLogin() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/linkedin/authorize`);
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        role="main"
        aria-labelledby="main-heading"
        style={{
          background: 'rgba(10, 10, 10, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '16px',
          padding: '48px',
          textAlign: 'center',
          maxWidth: '400px'
        }}
      >
        <h1 
          id="main-heading"
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
          LinkedInScholar
        </h1>
        <p style={{ color: '#9CA3AF', marginBottom: '32px' }} role="text">
          AI-powered LinkedIn platform for college students
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
          disabled={loading}
          aria-label={loading ? 'Redirecting to LinkedIn authentication' : 'Sign in with LinkedIn'}
          aria-disabled={loading}
          type="button"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
            color: 'white',
            padding: '12px 32px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
        >
          {loading ? 'Redirecting...' : 'Continue with LinkedIn'}
        </motion.button>
      </motion.div>
    </div>
  );
}