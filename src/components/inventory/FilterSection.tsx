// src/components/inventory/FilterSection.tsx
import { Plus } from 'lucide-react';
import { type ReactNode } from 'react';
import { cn } from '../../utils/cn'; // 引入我們的樣式合併工具

interface FilterSectionProps {
  label: string;
  active?: boolean; // 這就是那個被嫌棄的變數
  children?: ReactNode;
}

export const FilterSection = ({ label, active }: FilterSectionProps) => {
  return (
    <button 
      className={cn(
        // 1. 基礎樣式 (Base Styles)
        "group w-full flex items-center justify-between p-4 rounded-2xl border shadow-sm transition-all duration-300 active:scale-[0.98]",
        
        // 2. 狀態樣式判斷 (Conditionals)
        active 
          ? "bg-cyan-50/50 border-cyan-400 shadow-cyan-100" // ✨ 如果 active 為真，變亮！
          : "bg-white border-slate-100 hover:shadow-md hover:border-cyan-200" // 否則維持原樣
      )}
    >
      {/* 標題文字：Active 時變深色 */}
      <span className={cn(
        "font-serif font-bold tracking-wide text-sm transition-colors",
        active ? "text-cyan-800" : "text-slate-800"
      )}>
        {label}
      </span>
      
      {/* 右側圓圈圖示：Active 時也要跟著變色 */}
      <div className={cn(
        "w-6 h-6 rounded-full border flex items-center justify-center transition-colors",
        active
          ? "bg-cyan-200 border-cyan-400 text-cyan-700" // ✨ Active 樣式
          : "bg-slate-50 border-slate-200 text-slate-400 group-hover:bg-cyan-50 group-hover:border-cyan-200 group-hover:text-cyan-500"
      )}>
        <Plus size={14} />
      </div>
    </button>
  );
};