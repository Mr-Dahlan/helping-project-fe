import React from 'react';

const InputField = ({ label, type = 'text', placeholder, value, onChange, className = '', required = false, name }) => {
    return (
        <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
            {label && <label style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', textAlign: 'left' }}>{label}</label>}
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className={`form-input ${className}`}
                style={{
                    padding: '12px 16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#f9fafb',
                    width: '100%',
                    boxSizing: 'border-box'
                }}
            />
        </div>
    );
};

export default InputField;
