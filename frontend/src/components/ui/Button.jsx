import { motion } from 'framer-motion';
import { colors } from '../../styles/colors';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick,
  disabled = false,
  fullWidth = false,
  loading = false
}) {
  const variants = {
    primary: {
      background: colors.purple,
      color: colors.text,
      hover: colors.purpleHover,
      border: 'none'
    },
    secondary: {
      background: colors.purpleDim,
      color: colors.purple,
      hover: 'rgba(139, 92, 246, 0.15)',
      border: 'none'
    },
    ghost: {
      background: 'transparent',
      color: colors.textSecondary,
      hover: colors.bgHover,
      border: 'none'
    },
    outline: {
      background: 'transparent',
      color: colors.textSecondary,
      hover: colors.bgHover,
      border: `1px solid ${colors.border}`
    }
  };

  const sizes = {
    sm: { padding: '6px 12px', fontSize: '14px', height: '32px' },
    md: { padding: '10px 20px', fontSize: '15px', height: '40px' },
    lg: { padding: '12px 24px', fontSize: '16px', height: '48px' }
  };

  const style = variants[variant];
  const sizeStyle = sizes[size];

  return (
    <motion.button
      whileHover={disabled || loading ? {} : { scale: 1.02 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        background: style.background,
        color: style.color,
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        height: sizeStyle.height,
        fontWeight: 500,
        border: style.border,
        borderRadius: '8px',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        width: fullWidth ? '100%' : 'auto',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontFamily: 'Inter, sans-serif'
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.target.style.background = style.hover;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.target.style.background = style.background;
        }
      }}
    >
      {loading ? (
        <>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid transparent',
            borderTop: '2px solid currentColor',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Loading...
        </>
      ) : children}
    </motion.button>
  );
}

// Add keyframe animation for loading spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);