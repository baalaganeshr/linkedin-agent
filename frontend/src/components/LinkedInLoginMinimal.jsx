import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Button from './ui/Button';
import { colors, spacing } from '../styles/colors';
import { fadeIn } from '../utils/animations';

export default function LinkedInLoginMinimal() {
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.lg,
      background: colors.bg
    }}>
      <motion.div
        {...fadeIn}
        style={{
          maxWidth: '380px',
          width: '100%'
        }}
      >
        {/* Logo & Tagline */}
        <div style={{
          textAlign: 'center',
          marginBottom: spacing['2xl']
        }}>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            style={{
              fontSize: '24px',
              fontWeight: 600,
              color: colors.text,
              marginBottom: spacing.sm,
              letterSpacing: '-0.02em',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            LinkedInScholar
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={{
              fontSize: '15px',
              color: colors.textSecondary,
              fontWeight: 400
            }}
          >
            AI-powered LinkedIn for students
          </motion.p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={{
            background: colors.bgElevated,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            padding: spacing.xl
          }}
        >
          <div style={{ marginBottom: spacing.lg }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: colors.text,
              marginBottom: spacing.sm,
              fontFamily: 'Inter, sans-serif'
            }}>
              Welcome back
            </h2>
            <p style={{
              fontSize: '14px',
              color: colors.textSecondary,
              lineHeight: '20px'
            }}>
              Sign in with your LinkedIn account to continue
            </p>
          </div>

          <Button
            onClick={handleLogin}
            loading={loading}
            fullWidth
            size="lg"
          >
            {loading ? 'Connecting...' : 'Continue with LinkedIn'}
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          style={{
            textAlign: 'center',
            marginTop: spacing.lg
          }}
        >
          <p style={{
            fontSize: '13px',
            color: colors.textTertiary,
            lineHeight: '18px'
          }}>
            By continuing, you agree to our{' '}
            <span style={{ color: colors.textSecondary }}>Terms</span> and{' '}
            <span style={{ color: colors.textSecondary }}>Privacy Policy</span>
          </p>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          style={{
            marginTop: spacing['2xl'],
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: spacing.md,
            textAlign: 'center'
          }}
        >
          {[
            { icon: '📄', label: 'AI Resume' },
            { icon: '✨', label: 'Profile Tips' },
            { icon: '🤝', label: 'Networking' }
          ].map((feature, index) => (
            <div key={feature.label} style={{
              padding: spacing.md,
              background: colors.bgElevated,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.borderHover;
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{ fontSize: '20px', marginBottom: spacing.xs }}>
                {feature.icon}
              </div>
              <p style={{
                fontSize: '12px',
                color: colors.textSecondary,
                fontWeight: 500
              }}>
                {feature.label}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}