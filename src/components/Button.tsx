
const Button = ({ children, onClick,  variant = 'primary', className = '', disabled = false }) => {
    const getStyles = () => {
        const base = {
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '600',
            fontSize: '14px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
            transition: 'all 0.2s',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
        };

        if (variant === 'primary') {
            return {
                ...base,
                backgroundColor: '#0f172a',
                color: '#ffffff',
            };
        } else if (variant === 'secondary') {
            return {
                ...base,
                backgroundColor: '#f1f5f9',
                color: '#0f172a',
                border: '1px solid #e2e8f0',
            };
        } else if (variant === 'success') {
            return {
                ...base,
                backgroundColor: '#4ade80',
                color: '#0f172a',
            };
        }

        return base;
    };

    return (
        <button
            // type={type}
            onClick={onClick}
            disabled={disabled}
            className={`btn-${variant} ${className}`}
            style={getStyles()}
        >
            {children}
        </button>
    );
};

export default Button;
