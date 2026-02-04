// src/components/ui/ProductCard.tsx
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
  const { id, basic_info, pricing, rpg_tuning, media } = product;
  
  const imgDefault = media.images?.[0]?.url || '';
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
      
      {/* ================= 圖層 1: 底圖 ================= */}
      <img 
          src={imgDefault} 
          alt={basic_info.name}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-sm"
      />

      {/* ================= 圖層 2: 黑色遮罩 ================= */}
      {/* Adventure Mode 遮罩顏色較深，Normal Mode 較淺以配合設計圖 */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        adventureMode ? "bg-slate-900/60" : "bg-slate-900/20" // Normal Mode 調整為較淺的遮罩
      )} />

      {/* ================= 圖層 3: 資訊面板 (Hover 才出現) ================= */}
      {/* 💎 修改點 1: padding 改為 p-6 (24px) */}
      <div className="absolute inset-0 p-6 flex flex-col opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 z-10">
        
        <div className="text-white drop-shadow-md h-full">
             {adventureMode ? (
                // 🔥 Adventure Mode Hover (維持原樣，但因為父層 padding 變大，這裡也微調了佈局)
                <div className="flex flex-col justify-between h-full">
                    {/* 頂部：稀有度 */}
                    <div className="self-end">
                        <div className="px-2.5 py-1 text-xs font-bold font-mono rounded-md backdrop-blur-md shadow-sm bg-slate-900/60 text-cyan-300 border border-cyan-500/30">
                          {rpg_tuning.rarity}
                        </div>
                    </div>
                    
                    {/* 底部：數值與價格 */}
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between gap-2 font-mono text-center bg-slate-900/60 p-2 rounded-xl backdrop-blur-md border border-white/10">
                            <div className="flex-1">
                                <p className="text-[10px] text-cyan-200 opacity-70">DEF</p>
                                <p className="font-bold text-lg text-cyan-400">{stats.def ?? 0}</p>
                            </div>
                            <div className="flex-1 border-l border-white/10">
                                <p className="text-[10px] text-cyan-200 opacity-70">AGI</p>
                                <p className="font-bold text-lg text-cyan-400">{stats.agi ?? '?'}</p>
                            </div>
                             <div className="flex-1 border-l border-white/10">
                                <p className="text-[10px] text-cyan-200 opacity-70">RES</p>
                                <p className="font-bold text-lg text-cyan-400">{stats.res ?? '?'}</p>
                            </div>
                        </div>
                         <div className="font-mono text-xl font-black text-right text-cyan-300">
                           ${pricing.base_price.toLocaleString()}
                         </div>
                    </div>
                </div>
             ) : (
                // 🌿 💎 修改點 2: Normal Mode Hover 全新排版
                // 使用 flex flex-col justify-between h-full 將內容推到頂部和底部
                // text-slate-900: 參考圖是深色文字，所以這裡不用白色，改回深色
                <div className="flex flex-col justify-between h-full text-slate-900">
                    
                    {/* 上方區塊 */}
                    <div className="flex flex-col items-start">
                        {/* 稀有度: 24px, leading-32px, 襯線體 */}
                        <h2 className="text-2xl leading-8 font-serif font-bold mb-2">
                            {rpg_tuning.rarity}
                        </h2>
                        {/* 產品名稱: 16px, leading-24px */}
                        <h3 className="text-base leading-6 font-medium line-clamp-2 text-left">
                            {basic_info.name}
                        </h3>
                    </div>

                    {/* 下方區塊 (價格) */}
                    {/* 價格: 16px, bold, leading-24px, 靠右對齊 */}
                    <div className="text-base font-bold leading-6 text-right">
                       ${pricing.base_price.toLocaleString()}
                    </div>
                </div>
             )}
        </div>

      </div>
    </Link>
  );
};