// Ultra-minimalistic color system - Linear/Stripe/Vercel inspired
export const colors = {
  // Backgrounds
  bg: '#000000',              // Main background
  bgElevated: '#0A0A0A',      // Cards, elevated surfaces
  bgHover: '#141414',         // Hover states
  
  // Purple accent (only color in the app)
  purple: '#8B5CF6',
  purpleHover: '#7C3AED',
  purpleDim: 'rgba(139, 92, 246, 0.1)',
  
  // Text
  text: '#FFFFFF',            // Primary text
  textSecondary: '#A1A1AA',   // Secondary text
  textTertiary: '#52525B',    // Placeholder text
  
  // Borders
  border: '#1F1F1F',          // Subtle borders
  borderHover: '#2E2E2E',     // Border hover
  
  // States
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B'
};

// Spacing system - 8px increments only
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px'
};