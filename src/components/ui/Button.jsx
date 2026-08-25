import React from 'react';

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button', 
  className = '', 
  disabled = false 
}) {
  const baseStyle = "px-6 py-2 rounded font-semibold transition duration-300 flex items-center justify-center";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover active:bg-blue-800",
    secondary: "bg-secondary text-white hover:opacity-90 active:bg-green-700",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-200"
  };

  const disabledStyle = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabledStyle} ${className}`}
    >
      {children}
    </button>
  );
}