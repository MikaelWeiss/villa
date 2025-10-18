import React from 'react';

function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className = '',
  leftIcon,
  rightIcon,
  fullWidth = false,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus-ring disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm hover:shadow-md active:shadow-sm hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200 active:bg-secondary-300 hover:-translate-y-0.5 active:translate-y-0',
    accent: 'bg-accent text-white hover:bg-accent-600 active:bg-accent-700 shadow-sm hover:shadow-md active:shadow-sm hover:-translate-y-0.5 active:translate-y-0',
    danger: 'bg-error text-white hover:bg-error-600 active:bg-error-700 shadow-sm hover:shadow-md active:shadow-sm hover:-translate-y-0.5 active:translate-y-0',
    success: 'bg-success text-white hover:bg-success-600 active:bg-success-700 shadow-sm hover:shadow-md active:shadow-sm hover:-translate-y-0.5 active:translate-y-0',
    outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary-50 active:bg-primary-100',
    'outline-secondary': 'border-2 border-secondary-300 text-secondary-700 bg-transparent hover:bg-secondary-50 active:bg-secondary-100',
    ghost: 'text-primary bg-transparent hover:bg-primary-50 active:bg-primary-100',
    'ghost-secondary': 'text-secondary-600 bg-transparent hover:bg-secondary-50 active:bg-secondary-100',
  };

  const sizes = {
    xs: 'px-3 py-1.5 text-xs gap-1.5',
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-5 py-2.5 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
    xl: 'px-8 py-4 text-xl gap-3',
  };

  const iconSizes = {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20,
    xl: 22,
  };

  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.md;
  const iconSize = iconSizes[size] || iconSizes.md;

  const renderIcon = (icon) => {
    if (!icon) return null;
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon, {
        size: iconSize,
        className: 'flex-shrink-0'
      });
    }
    return icon;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantClasses} ${sizeClasses} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {/* Ripple effect background */}
      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 group-active:opacity-20 transition-opacity duration-300"></span>

      {/* Content */}
      <span className="relative flex items-center justify-center gap-inherit">
        {loading && (
          <svg
            className="animate-spin h-[1em] w-[1em]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {!loading && leftIcon && renderIcon(leftIcon)}
        {children}
        {!loading && rightIcon && renderIcon(rightIcon)}
      </span>
    </button>
  );
}

export default Button;
