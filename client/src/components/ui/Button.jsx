import React from 'react';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled, 
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-headline font-bold transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none";
  
  const variants = {
    primary: "bg-primary text-on-primary shadow-md shadow-primary/20 border-0 hover:bg-primary-dim hover:-translate-y-0.5",
    secondary: "bg-secondary text-on-secondary shadow-md shadow-secondary/20 border-0 hover:bg-secondary/90",
    ghost: "bg-transparent border-0 text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
    outline: "bg-transparent border-2 border-outline-variant/30 text-on-surface-variant hover:border-primary/40 hover:text-primary hover:bg-primary/5",
    danger: "bg-error text-white shadow-md shadow-error/20 border-0 hover:bg-error/90 hover:-translate-y-0.5",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-5 py-2.5 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-2xl",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}