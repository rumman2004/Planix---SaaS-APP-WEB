import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 24, className = '' }) {
  return (
    <div className="flex items-center justify-center w-full h-full p-4">
      <Loader2 
        size={size} 
        className={`animate-spin text-primary ${className}`} 
        strokeWidth={2.5}
      />
    </div>
  );
}