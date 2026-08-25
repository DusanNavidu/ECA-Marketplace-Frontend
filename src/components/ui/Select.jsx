import React from 'react';

export default function Select({ options, value, onChange, id, required = false, className = '' }) {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary bg-white transition duration-200 cursor-pointer ${className}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}