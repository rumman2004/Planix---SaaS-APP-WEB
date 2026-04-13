import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function Input({ 
  label, 
  error, 
  icon: Icon, 
  className = '', 
  id,
  ...props 
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="flex items-center gap-1.5 text-[10px] md:text-xs uppercase tracking-widest font-bold text-on-surface-variant font-label">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-outline">
            <Icon size={16} />
          </div>
        )}
        
        <input
          id={id}
          className={`w-full bg-surface-container-low border hover:border-outline-variant/40 rounded-xl py-3 text-sm font-medium text-on-surface outline-none transition-all placeholder:text-outline/50
            ${Icon ? 'pl-11 pr-4' : 'px-4'}
            ${error 
              ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20' 
              : 'border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/20'
            }
            ${className}
          `}
          {...props}
        />
      </div>

      {error && (
        <span className="flex items-center gap-1 mt-0.5 text-xs font-bold text-error">
          <AlertCircle size={12} /> {error}
        </span>
      )}
    </div>
  );
}