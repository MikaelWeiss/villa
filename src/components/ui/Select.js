import React from 'react';

function Select({
  label,
  error,
  helperText,
  children,
  className = '',
  containerClassName = '',
  ...props
}) {
  const baseStyles = 'w-full px-4 py-3 border rounded-lg transition-smooth focus-ring bg-white appearance-none cursor-pointer';
  const errorStyles = error
    ? 'border-error focus:ring-error'
    : 'border-secondary-300 focus:border-primary';

  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`}>
      {label && (
        <label className="text-sm font-semibold text-secondary-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`${baseStyles} ${errorStyles} ${className}`}
          {...props}
        >
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
          <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-secondary-500">{helperText}</p>
      )}
    </div>
  );
}

export default Select;
