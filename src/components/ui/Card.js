import React from 'react';

function Card({ children, className = '', padding = 'md', ...props }) {
  const baseStyles = 'bg-white rounded-lg shadow transition-smooth';

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const paddingClasses = paddings[padding] || paddings.md;

  return (
    <div className={`${baseStyles} ${paddingClasses} ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-xl font-semibold text-secondary-800 ${className}`}>
      {children}
    </h3>
  );
}

function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-6 pt-4 border-t border-secondary-200 ${className}`}>
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
