import React from 'react';

function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full';

  const variants = {
    default: 'bg-secondary-100 text-secondary-700',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    error: 'bg-error-100 text-error-700',
    // Status-specific variants
    open: 'bg-error-100 text-error-700',
    'in-progress': 'bg-warning-100 text-warning-700',
    resolved: 'bg-success-100 text-success-700',
    // Severity-specific variants
    low: 'bg-success-100 text-success-700',
    medium: 'bg-primary-100 text-primary-700',
    high: 'bg-warning-100 text-warning-700',
    urgent: 'bg-error-100 text-error-700',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const variantClasses = variants[variant] || variants.default;
  const sizeClasses = sizes[size] || sizes.md;

  return (
    <span className={`${baseStyles} ${variantClasses} ${sizeClasses} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;
