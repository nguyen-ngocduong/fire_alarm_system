const Badge = ({ children, variant = 'normal', className = '' }) => {
  const variantClasses = {
    safe: 'bg-safe-bg text-safe',
    warning: 'bg-warning-bg text-warning',
    danger: 'bg-danger-bg text-danger',
    normal: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-light text-primary',
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase
        ${variantClasses[variant]}
        ${className}
      `}
      role="status"
    >
      {children}
    </span>
  );
};

export default Badge;
