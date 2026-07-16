import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`glassmorphism rounded-3xl p-6 shadow-glass shadow-glass-inset transition-all duration-300 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};
