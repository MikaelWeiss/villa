import React from 'react';

function TextArea({
  label,
  error,
  helperText,
  className = '',
  containerClassName = '',
  rows = 4,
  ...props
}) {
  const baseStyles = 'w-full px-4 py-3 border rounded-lg transition-smooth focus-ring bg-white resize-vertical';
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
      <textarea
        rows={rows}
        className={`${baseStyles} ${errorStyles} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-secondary-500">{helperText}</p>
      )}
    </div>
  );
}

export default TextArea;
