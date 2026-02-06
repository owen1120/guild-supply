import { useState, useRef, useEffect, useCallback } from 'react';
import { DiamondPlus, DiamondMinus, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface FilterState {
  rarity: string[];
  minPrice: string;
  maxPrice: string;
  stats: {
    def: { min: number; max: number };
    agi: { min: number; max: number };
    res: { min: number; max: number };
  };
}

const DualRangeSlider = ({ 
  min = 0, 
  max = 100, 
  value,
  onChange 
}: { 
  min?: number; 
  max?: number;
  value: { min: number; max: number };
  onChange?: (minVal: number, maxVal: number) => void 
}) => {
  const [minVal, setMinVal] = useState(value.min);
  const [maxVal, setMaxVal] = useState(value.max);
  const minValRef = useRef(value.min);
  const maxValRef = useRef(value.max);
  const range = useRef<HTMLDivElement>(null);

  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);
    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);
    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-xs font-mono font-bold text-slate-500 w-8 text-right">{minVal}</span>
      <div className="relative flex-1 h-6 flex items-center">
        <input
            type="range"
            min={min}
            max={max}
            value={minVal}
            onChange={(event) => {
              const val = Math.min(Number(event.target.value), maxVal - 1);
              setMinVal(val);
              minValRef.current = val;
              onChange?.(val, maxVal);
            }}
            className="thumb z-30 w-full absolute top-1/2 -translate-y-1/2 h-0 outline-none pointer-events-none appearance-none"
            style={{ zIndex: minVal > max - 10 ? '5' : '3' }}
        />
        <input
            type="range"
            min={min}
            max={max}
            value={maxVal}
            onChange={(event) => {
              const val = Math.max(Number(event.target.value), minVal + 1);
              setMaxVal(val);
              maxValRef.current = val;
              onChange?.(minVal, val);
            }}
            className="thumb z-40 w-full absolute top-1/2 -translate-y-1/2 h-0 outline-none pointer-events-none appearance-none"
        />
        <div className="relative w-full">
            <div className="absolute top-0 bottom-0 w-full h-1 bg-slate-200 rounded-full"></div>
            <div ref={range} className="absolute top-0 bottom-0 h-1 bg-cyan-500 rounded-full transition-all duration-75"></div>
        </div>
      </div>
      <span className="text-xs font-mono font-bold text-slate-500 w-8 text-left">{maxVal}</span>
      <style>{`
        .thumb::-webkit-slider-thumb { -webkit-appearance: none; pointer-events: auto; height: 14px; width: 14px; border-radius: 50%; background-color: white; border: 2px solid #06b6d4; box-shadow: 0 1px 2px rgba(0,0,0,0.1); cursor: pointer; }
        .thumb::-moz-range-thumb { pointer-events: auto; height: 14px; width: 14px; border-radius: 50%; background-color: white; border: 2px solid #06b6d4; box-shadow: 0 1px 2px rgba(0,0,0,0.1); cursor: pointer; border: none; }
      `}</style>
    </div>
  );
};

const FilterSection = ({ title, isOpen, onToggle, children }: { title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }) => {
  return (
    <div className={cn("glass-panel rounded-3xl overflow-hidden transition-all duration-300", isOpen ? "shadow-md" : "shadow-sm hover:shadow-md")}>
      <button onClick={onToggle} className="w-full h-14 px-5 flex items-center justify-between text-left transition-colors group hover:bg-white/40">
        <span className="font-serif text-lg font-bold tracking-wide text-slate-900 uppercase leading-none translate-y-px">{title}</span>
        <div className={cn("flex items-center justify-center transition-colors duration-300", isOpen ? "text-cyan-600" : "text-slate-400 group-hover:text-cyan-600")}>
            {isOpen ? <DiamondMinus size={24} strokeWidth={1.5} /> : <DiamondPlus size={24} strokeWidth={1.5} />}
        </div>
      </button>
      <div className={cn("grid transition-all duration-300 ease-in-out", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className={cn("min-h-0 px-5 transition-all duration-300 ease-in-out", isOpen ? "pb-5" : "pb-0")}>
            <div className={cn("w-full h-px bg-slate-900/10 mb-5 transition-opacity duration-300", isOpen ? 'opacity-100' : 'opacity-0')}></div>
            {children}
        </div>
      </div>
    </div>
  );
};

interface InventorySidebarProps {
  onApply: (filters: FilterState) => void;
}

export const InventorySidebar = ({ onApply }: InventorySidebarProps) => {
  const [openSections, setOpenSections] = useState({ rarity: true, stats: true, price: true });
  
  const [filters, setFilters] = useState<FilterState>({
    rarity: [],
    minPrice: '',
    maxPrice: '',
    stats: {
      def: { min: 0, max: 100 },
      agi: { min: 0, max: 100 },
      res: { min: 0, max: 100 },
    }
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleRarityChange = (rarity: string) => {
    setFilters(prev => {
      const newRarity = prev.rarity.includes(rarity)
        ? prev.rarity.filter(r => r !== rarity)
        : [...prev.rarity, rarity];
      return { ...prev, rarity: newRarity };
    });
  };

  const handleStatChange = (stat: 'def' | 'agi' | 'res', min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [stat]: { min, max }
      }
    }));
  };

  const hasOpenSection = Object.values(openSections).some(isOpen => isOpen);
  const rarities = ['C', 'R', 'SR', 'SSR'];

  return (
    <aside className="w-72 shrink-0 flex flex-col gap-4 pb-10">
      
      {/* Rarity */}
      <FilterSection title="Rarity" isOpen={openSections.rarity} onToggle={() => toggleSection('rarity')}>
        <div className="grid grid-cols-2 gap-3">
            {rarities.map((rarity) => (
                <label key={rarity} className="flex items-center gap-3 cursor-pointer group">
                    <div className={cn(
                        "relative w-5 h-5 rounded border-2 transition-colors group-hover:bg-white/50",
                        filters.rarity.includes(rarity) ? "border-cyan-500 bg-cyan-500 group-hover:bg-cyan-600" : "border-slate-300"
                    )}>
                        <input 
                            type="checkbox" 
                            className="peer sr-only" 
                            checked={filters.rarity.includes(rarity)}
                            onChange={() => handleRarityChange(rarity)}
                        />
                        <div className={cn(
                             "absolute inset-0 flex items-center justify-center text-white transition-transform",
                             filters.rarity.includes(rarity) ? "scale-100" : "scale-0"
                        )}>
                           <Check size={12} strokeWidth={4} />
                        </div>
                    </div>
                    <span className={cn(
                        "font-mono font-bold transition-colors",
                        filters.rarity.includes(rarity) ? "text-cyan-700" : "text-slate-600 group-hover:text-slate-900"
                    )}>{rarity}</span>
                </label>
            ))}
        </div>
      </FilterSection>

      {/* Stats */}
      <FilterSection title="Stats" isOpen={openSections.stats} onToggle={() => toggleSection('stats')}>
        <div className="flex flex-col gap-5 pt-1">
            {(['def', 'agi', 'res'] as const).map((stat) => (
                <div key={stat} className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-900 font-mono tracking-wider pl-1 uppercase">{stat}</span>
                    <DualRangeSlider 
                        min={0} 
                        max={100} 
                        value={filters.stats[stat]}
                        onChange={(min, max) => handleStatChange(stat, min, max)} 
                    />
                </div>
            ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price Range" isOpen={openSections.price} onToggle={() => toggleSection('price')}>
         <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</span>
                    <input type="number" placeholder="Min" className="w-full bg-white/70 border border-slate-200 rounded-lg pl-6 pr-3 py-2 text-sm font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                        value={filters.minPrice}
                        onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                    />
                </div>
                <span className="text-slate-400">to</span>
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</span>
                    <input type="number" placeholder="Max" className="w-full bg-white/70 border border-slate-200 rounded-lg pl-6 pr-3 py-2 text-sm font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                    />
                </div>
            </div>
         </div>
      </FilterSection>

      {/* Apply Button */}
      <div className={cn("grid transition-all duration-500 ease-in-out sticky bottom-4 z-10", hasOpenSection ? "grid-rows-[1fr] opacity-100 translate-y-0" : "grid-rows-[0fr] opacity-0 translate-y-4")}>
          <div className="min-h-0">
            <button 
                onClick={() => onApply(filters)}
                className="w-full h-12 bg-slate-900 text-white rounded-2xl font-bold text-sm tracking-wider hover:bg-cyan-600 transition-all shadow-lg shadow-slate-900/20 active:scale-[0.98]"
            >
                APPLY FILTER
            </button>
          </div>
      </div>
    </aside>
  );
};