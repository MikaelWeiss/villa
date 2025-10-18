import React from 'react';
import Card from './Card';

function StatCard({ title, value, icon, color = 'primary', className = '' }) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-500',
    success: 'bg-success-50 text-success-500',
    warning: 'bg-warning-50 text-warning-500',
    error: 'bg-error-50 text-error-500',
    secondary: 'bg-secondary-50 text-secondary-500',
  };

  const colorClass = colorClasses[color] || colorClasses.primary;

  return (
    <Card className={`flex items-center justify-between ${className}`}>
      <div className="flex-1">
        <p className="text-sm font-medium text-secondary-500 mb-1">
          {title}
        </p>
        <p className="text-3xl font-bold text-secondary-800">
          {value}
        </p>
      </div>
      {icon && (
        <div className={`p-3 rounded-full ${colorClass}`}>
          {icon}
        </div>
      )}
    </Card>
  );
}

export default StatCard;
