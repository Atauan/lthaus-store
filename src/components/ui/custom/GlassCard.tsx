import React from 'react';
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  borderEffect?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  hoverEffect,
  borderEffect,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-sm",
        hoverEffect && "transition-all duration-200 hover:shadow-md hover:scale-[1.01]",
        borderEffect && "hover:border-primary/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
