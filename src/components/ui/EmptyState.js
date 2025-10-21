import React from 'react';

function EmptyState({ icon, title, description, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {icon && (
        <div className="mb-4 text-secondary-300">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-lg font-semibold text-secondary-700 mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-secondary-500 mb-6 max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
