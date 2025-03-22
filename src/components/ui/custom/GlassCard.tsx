
import React from 'react';
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
