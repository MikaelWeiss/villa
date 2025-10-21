import React from 'react';

function Skeleton({ className = '', width, height, variant = 'rectangle' }) {
  const variants = {
    rectangle: 'rounded',
    circle: 'rounded-full',
    text: 'rounded h-4',
  };

  const variantClass = variants[variant] || variants.rectangle;

  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`bg-secondary-200 animate-pulse ${variantClass} ${className}`}
      style={style}
    />
  );
}

function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={i === lines - 1 ? 'w-3/4' : 'w-full'}
        />
      ))}
    </div>
  );
}

Skeleton.Text = SkeletonText;

export default Skeleton;
