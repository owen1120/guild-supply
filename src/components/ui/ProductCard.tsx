// src/components/ui/ProductCard.tsx
import { type Product } from '../../types/inventory';
import { cn } from '../../utils/cn';

interface ProductCardProps {
  product: Product;
  adventureMode?: boolean; // ✨ 新增 Props
}

export const ProductCard = ({ product, adventureMode = false }: ProductCardProps) => {
  const { basic_info, pricing, rpg_tuning, media } = product;

  // 取得三種型態的圖片
  // 注意：實際資料可能沒有那麼多張圖，要做好 fallback (備案)
  const imgDefault = media.images?.[0]?.url || ''; // 第一張
  const imgHoverNormal = media.images?.[1]?.url || imgDefault; // 第二張 (沒有就用第一張)
  const imgHoverAdventure = media.images?.[2]?.url || imgHoverNormal; // 第三張 (沒有就用第二張)

  // 稀有度顏色 (保持不變)
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'SSR': return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10';
      case 'SR': return 'text-purple-400 border-purple-500/50 bg-purple-500/10';
      case 'R': return 'text-blue-400 border-blue-500/50 bg-blue-500/10';
      default: return 'text-slate-400 border-slate-500/50 bg-slate-500/10';
    }
  };

  return (
    <div className={cn(
        "group relative flex flex-col rounded-3xl overflow-hidden transition-all duration-500",
        // 💎 1. 預設狀態：所有卡片套用 glass-panel (根據你的需求)
        "glass-panel border-transparent",
        
        // 💎 2. Hover 效果邏輯
        adventureMode 
            ? "hover:glass-panel-cyan hover:shadow-[0_0_30px_var(--color-cyan-glow)] hover:-translate-y-2" // Adventure Mode: 發光 + 浮起
            : "hover:bg-white hover:shadow-xl hover:-translate-y-1" // Normal Mode: 變白 + 輕微浮起
    )}>
      
      {/* 🖼️ 圖片區域 (使用 aspect-[4/5] 讓它長一點，像卡牌) */}
      <div className="relative aspect-4/5 overflow-hidden rounded-2xl m-2 bg-slate-100">
        
        {/* Layer 1: 預設圖片 (永遠存在，但在 Hover 時會淡出) */}
        <img 
            src={imgDefault} 
            alt={basic_info.name}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />

        {/* Layer 2: Hover 圖片 (預設透明，Hover 時顯現) */}
        <img 
            src={adventureMode ? imgHoverAdventure : imgHoverNormal} 
            alt={`${basic_info.name} alternate`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 scale-110 group-hover:scale-100"
        />
        
        {/* 右上角：稀有度 (Adventure Mode 下可能會有不同樣式，這裡暫時維持一致) */}
        <div className={cn(
          "absolute top-3 right-3 px-2 py-1 text-xs font-bold rounded backdrop-blur-md border z-10",
          getRarityColor(rpg_tuning.rarity)
        )}>
          {rpg_tuning.rarity}
        </div>

        {/* 左上角：Ribbons (只顯示第一個) */}
        {basic_info.ribbons.length > 0 && (
            <div className="absolute top-3 left-3 z-10">
                <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-black/70 backdrop-blur-md rounded">
                {basic_info.ribbons[0]}
                </span>
            </div>
        )}

        {/* ✨ Adventure Mode 特效：數值儀表板 (Hover 時才出現) */}
        {adventureMode && (
             <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col gap-1 text-white">
                <div className="flex justify-between text-xs font-mono">
                    <span>DEF</span>
                    <span className="text-cyan-400">{rpg_tuning.stats.def || '---'}</span>
                </div>
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400" style={{ width: `${(rpg_tuning.stats.def || 0) / 10}%` }}></div>
                </div>
             </div>
        )}
      </div>

      {/* 📝 內容區域 (Adventure Mode 下，Hover 時隱藏標題，讓圖片最大化？
          或者保持顯示。這裡先依照一般電商邏輯：保持顯示) 
      */}
      <div className="px-4 pb-4 pt-2 flex flex-col flex-1 gap-1">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            {basic_info.brand}
        </p>
        <h3 className="font-bold text-slate-800 line-clamp-1 leading-tight group-hover:text-cyan-700 transition-colors">
            {basic_info.name}
        </h3>
        
        <div className="mt-auto pt-2 flex items-center justify-between">
             <span className="text-sm font-black text-slate-900 font-mono">
               ${pricing.base_price.toLocaleString()}
             </span>
        </div>
      </div>
    </div>
  );
};