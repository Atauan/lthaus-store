
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className,
  hoverEffect = false,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "glass-effect rounded-lg p-6",
        "shadow-soft transition-all duration-300",
        hoverEffect && "hover:shadow-soft-lg hover:translate-y-[-2px]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
