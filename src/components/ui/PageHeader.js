import React from 'react';

function PageHeader({ title, actions, className = '' }) {
  return (
    <div className={`flex items-center justify-between mb-8 ${className}`}>
      <h1 className="text-4xl font-bold text-secondary-800">{title}</h1>
      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}

export default PageHeader;
