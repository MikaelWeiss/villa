import React from 'react';

function Card({
  children,
  className = '',
  padding = 'md',
  variant = 'default',
  interactive = false,
  loading = false,
  ...props
}) {
  const baseStyles = 'bg-white rounded-xl border border-secondary-100 transition-all duration-300';

  const variants = {
    default: 'shadow-sm',
    elevated: 'shadow-md',
    flat: 'shadow-none',
    outline: 'border-2 shadow-none',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const variantClasses = variants[variant] || variants.default;
  const paddingClasses = paddings[padding] || paddings.md;
  const interactiveClasses = interactive
    ? 'cursor-pointer'
    : '';

  if (loading) {
    return (
      <div className={`${baseStyles} ${variantClasses} ${paddingClasses} ${className}`} {...props}>
        <div className="animate-pulse">
          <div className="h-4 bg-secondary-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-secondary-200 rounded"></div>
            <div className="h-3 bg-secondary-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${baseStyles} ${variantClasses} ${paddingClasses} ${interactiveClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className = '', withBorder = false }) {
  return (
    <div className={`mb-4 ${withBorder ? 'pb-4 border-b border-secondary-100' : ''} ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({ children, className = '', subtitle }) {
  return (
    <div>
      <h3 className={`text-lg font-semibold text-secondary-900 ${className}`}>
        {children}
      </h3>
      {subtitle && (
        <p className="text-sm text-secondary-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
}

function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

function CardFooter({ children, className = '', withBorder = true }) {
  return (
    <div className={`mt-6 ${withBorder ? 'pt-6 border-t border-secondary-100' : ''} ${className}`}>
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
 