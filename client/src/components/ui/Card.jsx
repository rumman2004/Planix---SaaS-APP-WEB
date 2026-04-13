import React from 'react';

export default function Card({ children, className = '', noPadding = false }) {
  return (
    <div className={`bg-surface-container-lowest/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] border border-outline-variant/20 shadow-sm transition-all ${noPadding ? '' : 'p-5 md:p-6'} ${className}`}>
      {children}
    </div>
  );
}