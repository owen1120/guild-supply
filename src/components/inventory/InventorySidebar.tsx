// src/components/inventory/InventorySidebar.tsx
import { useState } from 'react';
import { DiamondPlus, DiamondMinus, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface FilterState {
  rarity: string[];
  minPrice: string;
  maxPrice: string;
  stats: {
    def: { min: string; max: string };
    agi: { min: string; max: string };
    res: { min: string; max: string };
  };
}

// 一體化玻璃面板組件
const FilterSection = ({ 
  title, 
  isOpen, 
  onToggle, 
  children 
}: { 
  title: string; 
  isOpen: boolean; 
  onToggle: () => void; 
  children: React.ReactNode 
}) => {
  return (
    <div className={cn(
        "glass-panel rounded-3xl overflow-hidden transition-all duration-300",
        isOpen ? "shadow-md" : "shadow-sm hover:shadow-md"
    )}>
      {/* 標題按鈕 */}
      <button 
        onClick={onToggle}
        className="w-full h-14 px-5 flex items-center justify-between text-left transition-colors group hover:bg-white/40"
      >
        <span className="font-serif text-lg font-bold tracking-wide text-slate-900 uppercase leading-none translate-y-[1px]">
          {title}
        </span>
        
        <div className={cn(
            "flex items-center justify-center transition-colors duration-300",
            isOpen ? "text-cyan-600" : "text-slate-400 group-hover:text-cyan-600"
        )}>
            {isOpen ? (
                <DiamondMinus size={24} strokeWidth={1.5} />
            ) : (
                <DiamondPlus size={24} strokeWidth={1.5} />
            )}
        </div>
      </button>

      {/* 內容區域動畫容器 */}
      <div className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}>
        {/* 💎 修改重點：
            1. 加入 transition-all duration-300 ease-in-out 讓 Padding 變化有動畫
            2. 使用 isOpen ? "pb-5" : "pb-0" 讓底部內距在收合時完全消失
        */}
        <div className={cn(
            "min-h-0 px-5 transition-all duration-300 ease-in-out",
            isOpen ? "pb-5" : "pb-0"
        )}>
            {/* 分隔線 */}
            <div className={cn("w-full h-px bg-slate-900/10 mb-5 transition-opacity duration-300", isOpen ? 'opacity-100' : 'opacity-0')}></div>
            {children}
        </div>
      </div>
    </div>
  );
};

export const InventorySidebar = () => {
  const [openSections, setOpenSections] = useState({
    rarity: true,
    stats: true,
    price: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const hasOpenSection = Object.values(openSections).some(isOpen => isOpen);
  const rarities = ['N', 'R', 'SR', 'SSR', 'UR', 'LR'];

  return (
    <aside className="w-72 shrink-0 flex flex-col gap-4 pb-10">
      
      {/* 1. Rarity Filter */}
      <FilterSection 
        title="Rarity" 
        isOpen={openSections.rarity} 
        onToggle={() => toggleSection('rarity')}
      >
        <div className="grid grid-cols-2 gap-3">
            {rarities.map((rarity) => (
                <label key={rarity} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative w-5 h-5 rounded border-2 border-slate-300 transition-colors group-hover:border-cyan-500 group-hover:bg-white/50">
                        <input type="checkbox" className="peer sr-only" />
                        <div className="absolute inset-0 bg-cyan-500 scale-0 peer-checked:scale-100 transition-transform flex items-center justify-center text-white">
                           <Check size={12} strokeWidth={4} />
                        </div>
                    </div>
                    <span className="font-mono font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                        {rarity}
                    </span>
                </label>
            ))}
        </div>
      </FilterSection>

      {/* 2. Stats Filter */}
      <FilterSection 
        title="Stats" 
        isOpen={openSections.stats} 
        onToggle={() => toggleSection('stats')}
      >
        <div className="flex flex-col gap-4">
            {['DEF', 'AGI', 'RES'].map((stat) => (
                <div key={stat} className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-600 font-mono tracking-wider">{stat}</span>
                    <div className="flex items-center gap-2">
                        <input 
                            type="number" 
                            placeholder="0"
                            className="w-full bg-white/70 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                        <span className="text-slate-400">-</span>
                        <input 
                            type="number" 
                            placeholder="999"
                            className="w-full bg-white/70 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                    </div>
                </div>
            ))}
        </div>
      </FilterSection>

      {/* 3. Price Range Filter */}
      <FilterSection 
        title="Price Range" 
        isOpen={openSections.price} 
        onToggle={() => toggleSection('price')}
      >
         <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</span>
                    <input 
                        type="number" 
                        placeholder="Min"
                        className="w-full bg-white/70 border border-slate-200 rounded-lg pl-6 pr-3 py-2 text-sm font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                </div>
                <span className="text-slate-400">to</span>
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</span>
                    <input 
                        type="number" 
                        placeholder="Max"
                        className="w-full bg-white/70 border border-slate-200 rounded-lg pl-6 pr-3 py-2 text-sm font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                </div>
            </div>
         </div>
      </FilterSection>

      {/* 4. APPLY FILTER 按鈕 */}
      <div className={cn(
          "grid transition-all duration-500 ease-in-out sticky bottom-4 z-10",
          hasOpenSection ? "grid-rows-[1fr] opacity-100 translate-y-0" : "grid-rows-[0fr] opacity-0 translate-y-4"
      )}>
          <div className="min-h-0">
            <button className="w-full h-12 bg-slate-900 text-white rounded-2xl font-bold text-sm tracking-wider hover:bg-cyan-600 transition-all shadow-lg shadow-slate-900/20 active:scale-[0.98]">
                APPLY FILTER
            </button>
          </div>
      </div>

    </aside>
  );
};