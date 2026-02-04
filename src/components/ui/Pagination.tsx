// src/components/ui/Pagination.tsx
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  
  if (totalPages <= 1) return null;

  const baseButtonClass = "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 glass-panel cursor-pointer active:scale-95 text-base leading-6 font-serif";

  // 頁碼演算法
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      
      {/* 第一頁 */}
      <button 
        onClick={() => onPageChange(1)} 
        disabled={currentPage === 1}
        className={cn(baseButtonClass, "text-slate-600 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed")}
      >
        <ChevronsLeft size={24} />
      </button>

      {/* 上一頁 */}
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={cn(baseButtonClass, "text-slate-600 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed")}
      >
        <ChevronLeft size={24} />
      </button>

      {/* 數字區 */}
      {getPageNumbers().map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="text-slate-400 px-1 font-sans">...</span>
        ) : (
          <button
            key={index}
            onClick={() => onPageChange(page as number)}
            className={cn(
              baseButtonClass,
              currentPage === page 
                ? [
                    "text-cyan-400 font-bold",
                    "shadow-[0_0_15px_var(--color-cyan-glow)] border-cyan-200/40"
                  ]
                : [
                    "text-slate-600 hover:text-cyan-400"
                  ]
            )}
          >
            {page}
          </button>
        )
      ))}

      {/* 下一頁 */}
      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={cn(baseButtonClass, "text-slate-600 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed")}
      >
        <ChevronRight size={24} />
      </button>

      {/* 最後一頁 */}
      <button 
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={cn(baseButtonClass, "text-slate-600 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed")}
      >
        <ChevronsRight size={24} />
      </button>
    </div>
  );
};