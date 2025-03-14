
import React from 'react';
import { cn } from '@/lib/utils';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'ghost' | 'outline' | 'primary';
  size?: 'sm' | 'md' | 'lg';
}

const IconButton: React.FC<IconButtonProps> = ({ 
  children, 
  className, 
  variant = 'default',
  size = 'md',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'p-1.5 text-sm',
    md: 'p-2',
    lg: 'p-2.5 text-lg'
  };

  const variantClasses = {
    default: 'bg-secondary hover:bg-secondary/80 text-secondary-foreground',
    ghost: 'hover:bg-secondary/50 text-foreground',
    outline: 'border border-input hover:bg-secondary/50 text-foreground',
    primary: 'bg-primary hover:bg-primary/90 text-primary-foreground'
  };

  return (
    <button
      className={cn(
        "rounded-full transition-all duration-200",
        "flex items-center justify-center",
        "disabled:opacity-50 disabled:pointer-events-none focus:outline-none",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;
