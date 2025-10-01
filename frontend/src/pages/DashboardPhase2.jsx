import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: 'white'
          }}>
            Welcome, {user?.fullName}
          </h1>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(139, 92, 246, 0.1)',
              color: '#8B5CF6',
              padding: '8px 24px',
              borderRadius: '8px',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {['Generate Resume', 'Optimize Profile', 'Network Hub'].map(title => (
            <div key={title} style={{
              background: 'rgba(10, 10, 10, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '16px'
              }}>
                {title}
              </h3>
              <p style={{ color: '#9CA3AF' }}>Coming Soon</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}