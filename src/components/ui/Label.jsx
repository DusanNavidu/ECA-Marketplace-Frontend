import React from 'react';

export default function Label({ children, htmlFor, className = '' }) {
  return (
    <label 
      htmlFor={htmlFor} 
      className={`block text-sm font-medium text-text-main mb-1 ${className}`}
    >
      {children}
    </label>
  );
}