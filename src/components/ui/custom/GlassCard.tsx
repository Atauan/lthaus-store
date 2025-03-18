
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  borderEffect?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className,
  hoverEffect = false,
  borderEffect = false,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "glass-effect rounded-lg p-6",
        "shadow-soft transition-all duration-300",
        hoverEffect && "hover:shadow-soft-lg hover:translate-y-[-2px]",
        borderEffect && "border border-primary/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
