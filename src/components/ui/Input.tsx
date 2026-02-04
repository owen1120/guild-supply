// src/components/ui/Input.tsx
import React, { forwardRef, useRef } from 'react';
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'filled' | 'typing';
  inputSize?: 'lg' | 'md' | 'sm';
  error?: string | boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', inputSize = 'md', error, startIcon, endIcon, disabled, onClear, onChange, ...props }, ref) => {
    
    const innerRef = useRef<HTMLInputElement>(null);
    const targetRef = (ref || innerRef) as React.RefObject<HTMLInputElement>;

    const handleClear = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (targetRef.current) {
        targetRef.current.value = '';
        
        const event = new Event('input', { bubbles: true });
        targetRef.current.dispatchEvent(event);
        
        if (onChange) {
           const syntheticEvent = {
             ...e,
             target: targetRef.current,
             currentTarget: targetRef.current
           } as unknown as React.ChangeEvent<HTMLInputElement>;
           onChange(syntheticEvent);
        }
        
        targetRef.current.focus();
      }

      if (onClear) onClear();
    };

    const sizeClasses = {
      lg: "py-4 px-6 gap-2 rounded-xl text-base",
      md: "py-3 px-4 gap-2 rounded-lg text-sm",
      sm: "py-2 px-4 gap-2 rounded-md text-xs",
    };

    const containerClasses = cn(
      // Base styles
      "group flex items-center w-full transition-all duration-200 border-[1.5px] font-sans relative",
      "shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]",
      
      sizeClasses[inputSize],

      // Error State
      error ? [
        "bg-stone-100 border-red-500 text-slate-400",
        "focus-within:border-red-500"
      ] : [
        disabled ? [
            "bg-stone-100 cursor-not-allowed text-slate-400",
            "border-transparent border-l-slate-400 border-b-slate-400",
        ] : [
            // Default
            variant === 'default' && [
                "bg-stone-100 text-slate-400",
                "border-t-transparent border-r-transparent border-l-slate-600 border-b-slate-600",
                "hover:bg-stone-50 hover:border-cyan-300 hover:text-slate-400",
                "focus-within:bg-stone-100 focus-within:border-cyan-400 focus-within:text-slate-400",
                "active:bg-stone-100 active:border-cyan-400 active:text-slate-400"
            ],
            // Filled
            variant === 'filled' && [
                "bg-stone-50 text-slate-600",
                "border-slate-600",
                "hover:bg-stone-50 hover:border-cyan-300 hover:text-slate-400",
                "focus-within:bg-stone-100 focus-within:border-cyan-400 focus-within:text-slate-400",
                "active:bg-stone-100 active:border-cyan-400 active:text-slate-400"
            ],
            // Typing
            variant === 'typing' && [
                "bg-stone-100 text-slate-600",
                "border-cyan-400",
            ]
        ]
      ],
      className
    );

    return (
      <div className="flex flex-col gap-2 w-full">
        <div className={containerClasses}>
          
          {startIcon && <span className="text-slate-400 shrink-0 select-none">{startIcon}</span>}

          <input
            ref={targetRef}
            disabled={disabled}
            type="text" 
            className={cn(
              "w-full bg-transparent outline-none border-none p-0 m-0",
              "placeholder:text-slate-400 text-inherit",
              "[&::-webkit-search-cancel-button]:appearance-none"
            )}
            onChange={onChange}
            {...props}
          />

          {!disabled && (
             <button
                type="button"
                onClick={handleClear}
                className={cn(
                    "text-slate-400 hover:text-slate-600 transition-colors shrink-0 outline-none",
                    "hidden",
                    (variant === 'typing') && "block",
                    "group-focus-within:block",
                    "group-active:block"
                )}
             >
                <X size={16} />
             </button>
          )}

          {endIcon && <span className="text-slate-400 shrink-0 select-none">{endIcon}</span>}
        </div>

        {error && typeof error === 'string' && (
            <span className="text-[12px] text-red-500 pl-0.5 animate-in slide-in-from-top-1 fade-in duration-200">
                {error}
            </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";