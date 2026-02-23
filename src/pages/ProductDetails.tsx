// src/pages/ProductDetails.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Shield, Diamond, Loader2, AlertCircle } from 'lucide-react';
// 💎 修正 1：明確將 ProductDetail 標記為 type 匯入
import { productService, type ProductDetail as ProductType } from '../features/products/services/productService';
import { cn } from '../utils/cn';

// 定義稀有度的專屬魔法光暈與色彩
const rarityStyles: Record<string, { shadow: string; badge: string }> = {
  Common: { shadow: 'shadow-[0_0_40px_rgba(148,163,184,0.3)]', badge: 'bg-slate-100 text-slate-600 border-slate-200' },
  Uncommon: { shadow: 'shadow-[0_0_40px_rgba(74,222,128,0.3)]', badge: 'bg-green-50 text-green-700 border-green-200' },
  Rare: { shadow: 'shadow-[0_0_40px_rgba(56,189,248,0.4)]', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  Epic: { shadow: 'shadow-[0_0_40px_rgba(168,85,247,0.4)]', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
  Legendary: { shadow: 'shadow-[0_0_40px_rgba(251,191,36,0.5)]', badge: 'bg-amber-50 text-amber-700 border-amber-300' },
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>(); 
  const [product, setProduct] = useState<ProductType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // 🚀 初次渲染時，呼叫 API 取得裝備資料
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await productService.getProductById(id);
        
        // 💎 修正 2 & 3：因為 service 已經處理過 data.data，這裡直接使用 data 即可！
        setProduct(data);
        
        // 💎 修正 4：移除 any。因為 data 已經被判定為 ProductType，TypeScript 會自動推導 img 的型別
        const primaryIndex = (data.images || []).findIndex(img => img.isPrimary);
        setActiveImageIndex(primaryIndex >= 0 ? primaryIndex : 0);
        
      } catch (err) {
        setError('A magical anomaly occurred. Failed to retrieve equipment data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // --- 🪄 畫面渲染邏輯 ---

  // 1. 詠唱中 (載入畫面)
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500 mb-4" />
        <p className="font-mono text-slate-500 tracking-widest animate-pulse">Summoning equipment data...</p>
      </div>
    );
  }

  // 2. 結界異常 (錯誤畫面)
  if (error || !product) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-red-500">
        <AlertCircle className="w-12 h-12 mb-4 opacity-80" />
        <p className="font-mono font-bold">{error || 'Equipment not found.'}</p>
      </div>
    );
  }

  // 取得該稀有度的對應色彩
  const rarityStyle = rarityStyles[product.rarity] || rarityStyles.Common;

  return (
    // 核心排版：無縫雙欄佈局
    <div className="flex h-full w-full gap-8 md:gap-12 min-h-0">
      
      {/* ⚔️ 左側區塊：視覺展示與 RPG 數值 */}
      <div className="w-1/2 flex flex-col gap-6 shrink-0 h-full relative">
        
        {/* 裝備大圖展示區 */}
        <div className={cn(
          "relative flex-1 rounded-4xl bg-slate-50/50 border border-slate-100 flex items-center justify-center overflow-hidden transition-all duration-700",
          rarityStyle.shadow
        )}>
          {/* 稀有度標籤 */}
          <div className={cn(
            "absolute top-6 left-6 px-4 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-widest border backdrop-blur-md",
            rarityStyle.badge
          )}>
            {product.rarity}
          </div>

          {/* 徽章 (Ribbons) */}
          {product.ribbons?.length > 0 && (
            <div className="absolute top-6 right-6 flex flex-col gap-2">
              {product.ribbons.map(ribbon => (
                <span key={ribbon} className="bg-slate-900 text-cyan-400 font-mono text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  {ribbon}
                </span>
              ))}
            </div>
          )}

          {/* 主圖片渲染 */}
          {product.images?.length > 0 && (
            <img 
              src={product.images[activeImageIndex]?.url} 
              alt={product.images[activeImageIndex]?.altText || "Equipment Image"}
              className="w-4/5 h-4/5 object-contain hover:scale-105 transition-transform duration-500"
            />
          )}
        </div>

        {/* 縮圖切換區 */}
        {product.images?.length > 1 && (
          <div className="flex gap-4 h-24 shrink-0">
            {product.images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setActiveImageIndex(idx)}
                className={cn(
                  "w-24 h-full rounded-2xl border-2 overflow-hidden transition-all duration-300",
                  activeImageIndex === idx 
                    ? "border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]" 
                    : "border-transparent bg-slate-50 hover:bg-slate-100"
                )}
              >
                <img src={img.url} alt="thumbnail" className="w-full h-full object-cover opacity-80 hover:opacity-100" />
              </button>
            ))}
          </div>
        )}

        {/* RPG 基礎能力面板 */}
        <div className="glass-panel p-6 rounded-3xl shrink-0 flex flex-col gap-4">
            <h3 className="font-mono text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Base Stats
            </h3>
            
            {/* 數值長條圖 - DEF */}
            <div className="flex items-center gap-4 group">
              <span className="w-10 font-mono font-bold text-slate-700 text-sm">DEF</span>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                  <div className="absolute top-0 left-0 h-full bg-blue-400 transition-all duration-1000 ease-out group-hover:bg-blue-500" style={{ width: `${Math.min(product.def || 0, 100)}%` }} />
              </div>
              <span className="w-8 text-right font-mono text-sm text-slate-500">{product.def || 0}</span>
            </div>

            {/* 數值長條圖 - AGI */}
            <div className="flex items-center gap-4 group">
              <span className="w-10 font-mono font-bold text-slate-700 text-sm">AGI</span>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                  <div className="absolute top-0 left-0 h-full bg-green-400 transition-all duration-1000 ease-out group-hover:bg-green-500" style={{ width: `${Math.min(product.agi || 0, 100)}%` }} />
              </div>
              <span className="w-8 text-right font-mono text-sm text-slate-500">{product.agi || 0}</span>
            </div>

            {/* 數值長條圖 - RES */}
            <div className="flex items-center gap-4 group">
              <span className="w-10 font-mono font-bold text-slate-700 text-sm">RES</span>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                  <div className="absolute top-0 left-0 h-full bg-purple-400 transition-all duration-1000 ease-out group-hover:bg-purple-500" style={{ width: `${Math.min(product.res || 0, 100)}%` }} />
              </div>
              <span className="w-8 text-right font-mono text-sm text-slate-500">{product.res || 0}</span>
            </div>
        </div>

      </div>

      {/* 📝 右側區塊：商品詳細情報 (Step 3 的目標) */}
      <div className="w-1/2 h-full overflow-y-auto pr-4 pb-12 flex flex-col gap-8 custom-scrollbar">
          
          {/* 標題與價格 */}
          <div>
            <p className="font-mono text-sm text-cyan-600 font-bold mb-2">
              Home / {product.category} / {product.brand}
            </p>
            <h1 className="text-4xl font-serif font-bold text-slate-900 leading-tight mb-4">
              {product.title}
            </h1>
            <div className="text-3xl font-mono text-slate-800 flex items-center gap-3">
              <Diamond className="w-6 h-6 text-cyan-500" />
              {product.price}
            </div>
          </div>

          <div className="w-full h-px bg-slate-100" />

          {/* 佔位符：等待 Step 3 注入靈魂 */}
          <div className="flex-1 flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-4xl text-slate-400 font-mono text-center">
              [ Right Panel Pending... ]<br/><br/>
              Options, Lore Description, Specifications, and Cart Actions will be forged here in Step 3!
          </div>

      </div>

    </div>
  );
}