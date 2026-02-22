import { Link } from 'react-router-dom';
import { type Product } from '../../types/inventory';
import { cn } from '../../utils/cn';

interface ProductCardProps {
  product: Product;
  adventureMode?: boolean;
  className?: string;
}

interface DisplayStats {
  def: number;
  agi?: number;
  res?: number;
}

export const ProductCard = ({ product, adventureMode = false, className }: ProductCardProps) => {
  const { 
    id, 
    basic_info = { name: 'Unknown Item', description: '', category: 'General' }, 
    pricing = { base_price: 0, currency: 'G' }, 
    rpg_tuning = { rarity: 'N', stats: { def: 0, agi: 0, res: 0 } }, 
    visuals = { icon: '/assets/items/default.png', images: [] }
  } = product || {};
  
  const imgDefault = visuals.icon || '/assets/items/default.png';
  
  // 處理 stats 顯示
  const stats = rpg_tuning.stats as unknown as DisplayStats;

  return (
    <Link 
      to={`/product/${id}`}
      className={cn(
        "group relative block h-full w-full rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer",
        "bg-slate-100 shadow-sm",
        adventureMode 
            ? "hover:shadow-[0_0_30px_var(--color-cyan-glow)] hover:-translate-y-1"
            : "hover:shadow-xl hover:-translate-y-1",
        className
    )}>
      
      {/* 圖層 1: 底圖 */}
      <img 
          src={imgDefault} 
          alt={basic_info.name}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-sm"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=No+Image';
          }}
      />

      {/* 圖層 2: 黑色遮罩 */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        adventureMode ? "bg-slate-900/60" : "bg-slate-900/20"
      )} />

      {/* 圖層 3: 資訊面板 (懸停時浮現) */}
      <div className="absolute inset-0 p-6 flex flex-col opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 z-10">
        
        <div className="text-white drop-shadow-md h-full w-full">
             {adventureMode ? (
                // --- Adventure Mode 儀表板樣式 ---
                <div className="flex flex-col justify-end h-full w-full">
                    
                    <div className="flex flex-col gap-3 w-full">
                        {/* 屬性面板 */}
                        <div className="flex justify-between font-mono text-center bg-slate-900/60 p-2 rounded-xl backdrop-blur-md border border-white/10 w-full">
                            
                            {/* DEF */}
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <p className="text-[10px] text-cyan-200 opacity-70">DEF</p>
                                <p className="font-bold text-lg text-cyan-400">{stats?.def ?? 0}</p>
                            </div>

                            {/* AGI */}
                            <div className="flex-1 flex flex-col items-center justify-center border-l border-white/10">
                                <p className="text-[10px] text-cyan-200 opacity-70">AGI</p>
                                <p className="font-bold text-lg text-cyan-400">{stats?.agi ?? '?'}</p>
                            </div>

                            {/* RES */}
                             <div className="flex-1 flex flex-col items-center justify-center border-l border-white/10">
                                <p className="text-[10px] text-cyan-200 opacity-70">RES</p>
                                <p className="font-bold text-lg text-cyan-400">{stats?.res ?? '?'}</p>
                            </div>
                        </div>

                         {/* 價格 */}
                         <div className="font-mono text-xl font-black text-right text-cyan-300">
                           ${pricing.base_price.toLocaleString()}
                         </div>
                    </div>
                </div>
             ) : (
                // --- 一般模式樣式 ---
                <div className="flex flex-col justify-between h-full text-slate-50 w-full">
                    <div className="flex flex-col items-start w-full">
                        <h2 className="text-base leading-6 font-serif font-bold mb-2 uppercase tracking-wider">
                            {rpg_tuning.rarity}
                        </h2>
                        <h3 className="text-xl leading-7 font-bold line-clamp-2 text-left w-full">
                            {basic_info.name}
                        </h3>
                    </div>
                    <div className="text-xl font-bold leading-6 text-right w-full">
                       ${pricing.base_price.toLocaleString()}
                    </div>
                </div>
             )}
        </div>

      </div>
    </Link>
  );
};