import { useState, useRef, useEffect } from 'react';
import { ArrowDownUp, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export type SortOption = 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'newest' | 'oldest';

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const options: { value: SortOption; label: string }[] = [
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' },
  { value: 'price_asc', label: 'Price ($ - $$$)' },
  { value: 'price_desc', label: 'Price ($$$ - $)' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
];

export const SortSelect = ({ value, onChange }: SortSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
        ref={containerRef}
        className="relative group z-30" 
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
    >
      {/* 觸發按鈕 */}
      <button 
        className={cn(
            "glass-panel w-10 h-10 flex items-center justify-center rounded-xl transition-colors cursor-pointer active:scale-95",
            isOpen ? "text-cyan-600 border-cyan-400" : "text-slate-600 hover:text-cyan-600"
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Sort products"
      >
        <ArrowDownUp size={20} />
      </button>

      {/* 下拉選單 */}
      <div className={cn(
          "absolute right-0 top-full mt-2 w-48 py-2 rounded-xl glass-panel border border-white/40 shadow-xl backdrop-blur-xl transition-all duration-200 origin-top-right",
          isOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
      )}>
         {options.map((option) => (
             <button
                key={option.value}
                onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                }}
                className={cn(
                    "w-full px-4 py-2.5 text-xs font-mono font-bold text-left flex items-center justify-between hover:bg-cyan-50/50 hover:text-cyan-700 transition-colors",
                    value === option.value ? "text-cyan-600 bg-cyan-50/30" : "text-slate-600"
                )}
             >
                 {option.label}
                 {value === option.value && <Check size={14} className="text-cyan-500" />}
             </button>
         ))}
      </div>
    </div>
  );
};