import React from 'react';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const BentoCard: React.FC<BentoCardProps> = ({ children, className = '', hoverEffect = false }) => {
  return (
    <div 
      className={`
        bg-nest-card rounded-bento overflow-hidden relative shadow-sm transition-all duration-500 ease-out
        ${hoverEffect ? 'hover:shadow-lg hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default BentoCard;