// src/components/ui/Button.tsx
import React from 'react';
import { cn } from '../../utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'lg', isLoading, icon, children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    const primaryStyles = cn(
      "bg-transparent backdrop-blur-[4px] border border-white/20", 
      "text-stone-600", 
      "shadow-[-2px_-4px_6px_-2px_rgba(34,211,238,0.05),2px_10px_15px_-3px_rgba(34,211,238,0.1)]",
      
      "hover:text-white",
      "hover:bg-gradient-to-br hover:from-blue-600 hover:to-cyan-400", 
      "hover:shadow-[-2px_-4px_6px_-2px_rgba(34,211,238,0.1),2px_10px_15px_-3px_rgba(34,211,238,0.2)]",
      "hover:border-blue-500/30",

      "active:bg-gradient-to-br",
      "active:from-blue-600/40 active:to-cyan-400/40", 
      "active:text-stone-50",
      "active:shadow-inner active:scale-[0.98]"
    );

    const outlineStyles = cn(
      "bg-transparent border-2 border-slate-300 text-slate-500",
      "hover:border-cyan-400",
      "hover:bg-gradient-to-br hover:from-blue-600 hover:to-cyan-400 hover:bg-clip-text hover:text-transparent",
      "hover:shadow-lg hover:shadow-cyan-500/10",
      "active:scale-[0.98] active:opacity-60"
    );

    const linkStyles = cn(
      "bg-transparent border-2 border-transparent",
      "bg-gradient-to-br from-blue-600 to-cyan-400 bg-clip-text text-transparent",
      "hover:border-cyan-400",
      "active:opacity-60 active:border-cyan-400",
      "disabled:!bg-none disabled:!text-stone-400 disabled:border-transparent disabled:cursor-not-allowed"
    );

    const variants = {
      primary: primaryStyles,
      outline: outlineStyles,
      link: linkStyles,
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-transparent",
      ghost: "hover:bg-slate-100 text-slate-600 border border-transparent",
      danger: "bg-red-500 text-white hover:bg-red-600 shadow-md border border-transparent",
    };

    const textSizes = {
      sm: "gap-2 px-4 py-2 rounded-md text-sm", 
      md: "gap-2 px-4 py-3 rounded-lg text-base",
      lg: "gap-2 px-6 py-4 rounded-xl text-lg",
    };

    const iconSizes = {
      sm: "text-[16px]",
      md: "text-[24px]",
      lg: "text-[32px]",
    };

    const iconBaseStyles = "p-2 rounded-lg aspect-square flex items-center justify-center leading-none";

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          icon ? iconSizes[size] : textSizes[size],
          icon && iconBaseStyles, 
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className={cn("animate-spin", icon ? "" : "mr-2")}>⌛</span> 
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";