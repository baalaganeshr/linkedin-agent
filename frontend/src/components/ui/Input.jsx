import React from 'react';
import { colors } from '../../styles/colors';

const Input = React.memo(function Input({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  label,
  required = false,
  disabled = false,
  id,
  ariaDescribedBy,
  autoComplete
}) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label 
          htmlFor={inputId}
          style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            color: colors.text,
            marginBottom: '6px'
          }}>
          {label}
          {required && <span style={{ color: colors.error, marginLeft: '4px' }} aria-label="required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={[errorId, ariaDescribedBy].filter(Boolean).join(' ') || undefined}
        aria-label={!label ? placeholder : undefined}
        style={{
          width: '100%',
          padding: '12px 16px',
          background: colors.bgElevated,
          border: `1px solid ${error ? colors.error : colors.border}`,
          borderRadius: '8px',
          color: colors.text,
          fontSize: '15px',
          fontFamily: 'Inter, sans-serif',
          outline: 'none',
          transition: 'all 0.2s ease',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'text'
        }}
        onFocus={(e) => {
          if (!disabled) {
            e.target.style.borderColor = error ? colors.error : colors.purple;
            e.target.style.boxShadow = `0 0 0 3px ${error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(139, 92, 246, 0.1)'}`;
          }
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? colors.error : colors.border;
          e.target.style.boxShadow = 'none';
        }}
      />
      {error && (
        <p 
          id={errorId}
          role="alert"
          aria-live="polite"
          style={{
            color: colors.error,
            fontSize: '13px',
            marginTop: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
          <span aria-hidden="true">⚠️</span> {error}
        </p>
      )}
    </div>
  );
});

export default Input;