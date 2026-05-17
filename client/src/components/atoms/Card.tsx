import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`bg-surface-900/60 backdrop-blur-sm border border-surface-800 rounded-2xl p-6 ${hover ? 'hover:border-surface-700 hover:bg-surface-900/80 transition-all duration-300' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
