import React from 'react';

export default function ErrorMessage({ message, className = '' }) {
  if (!message) return null;
  
  return (
    <p className={`text-red-500 text-sm mt-1 bg-red-50 p-2 rounded border border-red-200 ${className}`}>
      {message}
    </p>
  );
}