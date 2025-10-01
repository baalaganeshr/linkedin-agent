import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { colors, spacing } from '../styles/colors';
import { fadeIn, staggerChildren } from '../utils/animations';

export default function DashboardMinimal() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const features = [
    {
      title: 'Generate Resume',
      description: 'AI-powered ATS-optimized resumes tailored for your profile',
      icon: '📄',
      status: 'Active',
      color: colors.purple,
      onClick: () => navigate('/resume-generator')
    },
    {
      title: 'Optimize Profile',
      description: 'Get personalized LinkedIn optimization tips and recommendations',
      icon: '✨',
      status: 'Coming Soon',
      color: colors.success
    },
    {
      title: 'Network Hub',
      description: 'Smart connection suggestions and networking strategies',
      icon: '🤝',
      status: 'Coming Soon',
      color: colors.warning
    }
  ];

  const stats = [
    { label: 'Profile Score', value: '85%', change: '+12%' },
    { label: 'Connections', value: '234', change: '+18' },
    { label: 'Views', value: '1.2k', change: '+156' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: colors.bg }}>
      {/* Header */}
      <header style={{
        borderBottom: `1px solid ${colors.border}`,
        padding: `${spacing.md} ${spacing.lg}`,
        background: colors.bg,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: colors.text,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            LinkedInScholar
          </motion.h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              padding: `${spacing.sm} ${spacing.md}`,
              background: colors.bgElevated,
              borderRadius: '8px',
              border: `1px solid ${colors.border}`
            }}>
              {user?.profilePicture && (
                <img 
                  src={user.profilePicture} 
                  alt="Profile" 
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%'
                  }}
                />
              )}
              <span style={{
                fontSize: '14px',
                color: colors.textSecondary,
                fontWeight: 500
              }}>
                {user?.fullName?.split(' ')[0]}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: `${spacing['2xl']} ${spacing.lg}`
      }}>
        {/* Welcome Section */}
        <motion.div 
          {...fadeIn}
          style={{ marginBottom: spacing['2xl'] }}
        >
          <h2 style={{
            fontSize: '30px',
            fontWeight: 600,
            color: colors.text,
            marginBottom: spacing.sm,
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, sans-serif'
          }}>
            Welcome back, {user?.fullName?.split(' ')[0]}
          </h2>
          <p style={{
            fontSize: '16px',
            color: colors.textSecondary,
            lineHeight: '24px'
          }}>
            Ready to boost your LinkedIn presence and career opportunities?
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: spacing.lg,
            marginBottom: spacing['2xl']
          }}
        >
          {stats.map((stat, index) => (
            <Card key={stat.label} padding={spacing.lg}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: spacing.sm
              }}>
                <p style={{
                  fontSize: '13px',
                  color: colors.textSecondary,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {stat.label}
                </p>
                <span style={{
                  fontSize: '12px',
                  color: colors.success,
                  fontWeight: 500
                }}>
                  {stat.change}
                </span>
              </div>
              <p style={{
                fontSize: '24px',
                fontWeight: 600,
                color: colors.text,
                fontFamily: 'Inter, sans-serif'
              }}>
                {stat.value}
              </p>
            </Card>
          ))}
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={staggerChildren}
          initial="initial"
          animate="animate"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: spacing.lg
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={fadeIn}
              transition={{ delay: index * 0.1 }}
              onClick={feature.onClick}
              style={{ cursor: feature.onClick ? 'pointer' : 'default' }}
            >
              <Card hover padding={spacing.xl}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: spacing.md,
                  marginBottom: spacing.lg
                }}>
                  <div style={{
                    fontSize: '28px',
                    lineHeight: 1
                  }}>
                    {feature.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: colors.text,
                      marginBottom: spacing.sm,
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {feature.title}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: colors.textSecondary,
                      lineHeight: '20px',
                      marginBottom: spacing.md
                    }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '12px',
                    color: feature.status === 'Active' ? colors.purple : colors.textTertiary,
                    padding: `4px 8px`,
                    background: feature.status === 'Active' ? 'rgba(139, 92, 246, 0.1)' : colors.bgHover,
                    borderRadius: '6px',
                    fontWeight: 500
                  }}>
                    {feature.status}
                  </span>
                  <Button variant="secondary" size="sm">
                    {feature.status === 'Active' ? 'Get Started' : 'Learn More'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          style={{
            marginTop: spacing['3xl'],
            textAlign: 'center',
            padding: spacing['2xl'],
            background: colors.bgElevated,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px'
          }}
        >
          <h3 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: colors.text,
            marginBottom: spacing.sm,
            fontFamily: 'Inter, sans-serif'
          }}>
            Ready for Phase 3?
          </h3>
          <p style={{
            fontSize: '15px',
            color: colors.textSecondary,
            marginBottom: spacing.lg,
            maxWidth: '500px',
            margin: `0 auto ${spacing.lg} auto`,
            lineHeight: '22px'
          }}>
            The infrastructure is complete. Next phase will add real AI functionality with Groq integration.
          </p>
          <Button variant="primary" size="lg">
            View Roadmap
          </Button>
        </motion.div>
      </main>
    </div>
  );
}