import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, className = '' }) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={`relative w-full max-w-lg bg-surface-container-lowest border border-outline-variant/20 shadow-2xl rounded-[2rem] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 ${className}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10 bg-surface-container-low/30">
          <h2 className="text-xl md:text-2xl font-extrabold font-headline text-on-surface tracking-tight">
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-outline-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh] hidden-scrollbar bg-surface-container-lowest">
          {children}
        </div>

      </div>
    </div>
  );
}