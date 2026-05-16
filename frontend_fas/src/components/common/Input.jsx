const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-text-primary mb-1">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-text-muted text-xl">{icon}</span>
          </div>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full px-4 py-2 border rounded-lg
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-danger focus:ring-danger' : 'border-border focus:ring-primary'}
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-gray-100 disabled:cursor-not-allowed
            transition-colors duration-200
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}
    </div>
  );
};

export default Input;
