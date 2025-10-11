import { colors } from '../../styles/colors';

export default function Card({ 
  children, 
  hover = false, 
  padding = '24px',
  onClick,
  className = ''
}) {
  const isClickable = !!onClick;

  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: colors.bgElevated,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        padding: padding,
        transition: 'all 0.2s ease',
        cursor: isClickable ? 'pointer' : 'default'
      }}
      onMouseEnter={(e) => {
        if (hover || isClickable) {
          e.currentTarget.style.borderColor = colors.borderHover;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover || isClickable) {
          e.currentTarget.style.borderColor = colors.border;
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {children}
    </div>
  );
}