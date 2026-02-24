import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Shield, Diamond, Loader2, AlertCircle, ShoppingCart, Zap, List, CheckCircle2 } from 'lucide-react';
import { productService, type ProductDetail as ProductType } from '../features/products/services/productService';
import { useCartStore } from '../features/cart/store/useCartStore'; // 💎 引入全域金庫
import { cn } from '../utils/cn';

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

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  
  const [showToast, setShowToast] = useState(false);

  const addToCart = useCartStore(state => state.addToCart);
  const isCartLoading = useCartStore(state => state.isLoading);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
        
        const primaryIndex = (data.images || []).findIndex(img => img.isPrimary);
        setActiveImageIndex(primaryIndex >= 0 ? primaryIndex : 0);

        const initialOptions: Record<string, string> = {};
        data.options?.forEach(opt => {
          if (opt.values && opt.values.length > 0) {
            initialOptions[opt.id] = opt.values[0];
          }
        });
        setSelectedOptions(initialOptions);
        setQuantity(1);

      } catch (err) {
        setError('A magical anomaly occurred. Failed to retrieve equipment data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart({
        productId: product.id,
        quantity: quantity,
        options: selectedOptions
      });
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error(err);
      alert('結界異常！無法將物品存入行囊。');
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500 mb-4" />
        <p className="font-mono text-slate-500 tracking-widest animate-pulse">Summoning equipment data...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-red-500">
        <AlertCircle className="w-12 h-12 mb-4 opacity-80" />
        <p className="font-mono font-bold">{error || 'Equipment not found.'}</p>
      </div>
    );
  }

  const rarityStyle = rarityStyles[product.rarity] || rarityStyles.Common;
  const glowBarClass = "absolute top-0 left-0 h-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.7)] transition-all duration-1000 ease-out group-hover:bg-cyan-300 group-hover:shadow-[0_0_16px_rgba(34,211,238,0.9)]";

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => {
      const newQuantity = prev + delta;
      if (newQuantity < 1) return 1;
      if (newQuantity > product.stock) return product.stock;
      return newQuantity;
    });
  };

  return (
    <div className="flex h-full w-full gap-8 md:gap-12 min-h-0 relative">
      
      <div className={cn(
        "absolute top-4 right-8 z-50 flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl transition-all duration-500 transform",
        showToast ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
      )}>
        <CheckCircle2 className="w-6 h-6 text-cyan-400" />
        <span className="font-mono font-bold">Successfully added to cart!</span>
      </div>

      <div className="w-1/2 flex flex-col gap-6 shrink-0 h-full relative">
        <div className="flex gap-4 flex-1 min-h-0">
          <div className={cn(
            "relative flex-1 rounded-4xl bg-slate-50/50 border border-slate-100 flex items-center justify-center overflow-hidden transition-all duration-700",
            rarityStyle.shadow
          )}>
            <div className={cn("absolute top-6 left-6 px-4 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-widest border backdrop-blur-md", rarityStyle.badge)}>
              {product.rarity}
            </div>
            {product.ribbons?.length > 0 && (
              <div className="absolute top-6 right-6 flex flex-col gap-2">
                {product.ribbons.map(ribbon => (
                  <span key={ribbon} className="bg-slate-900 text-cyan-400 font-mono text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md">{ribbon}</span>
                ))}
              </div>
            )}
            {product.images?.length > 0 && (
              <img src={product.images[activeImageIndex]?.url} alt={product.images[activeImageIndex]?.altText || "Equipment Image"} className="w-4/5 h-4/5 object-contain hover:scale-105 transition-transform duration-500" />
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex flex-col gap-4 w-24 shrink-0 overflow-y-auto custom-scrollbar pr-1 pb-1">
              {product.images.map((img, idx) => (
                <button key={img.id} onClick={() => setActiveImageIndex(idx)} className={cn("w-full aspect-square rounded-2xl border-2 overflow-hidden transition-all duration-300 shrink-0", activeImageIndex === idx ? "border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]" : "border-transparent bg-slate-50 hover:bg-slate-100")}>
                  <img src={img.url} alt="thumbnail" className="w-full h-full object-cover opacity-80 hover:opacity-100" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="glass-panel p-6 rounded-3xl shrink-0 flex flex-col gap-4">
            <h3 className="font-mono text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Base Stats
            </h3>
            <div className="flex items-center gap-4 group">
              <span className="w-10 font-mono font-bold text-slate-700 text-sm">DEF</span>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden relative"><div className={glowBarClass} style={{ width: `${Math.min(product.def || 0, 100)}%` }} /></div>
              <span className="w-8 text-right font-mono text-sm text-slate-500">{product.def || 0}</span>
            </div>
            <div className="flex items-center gap-4 group">
              <span className="w-10 font-mono font-bold text-slate-700 text-sm">AGI</span>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden relative"><div className={glowBarClass} style={{ width: `${Math.min(product.agi || 0, 100)}%` }} /></div>
              <span className="w-8 text-right font-mono text-sm text-slate-500">{product.agi || 0}</span>
            </div>
            <div className="flex items-center gap-4 group">
              <span className="w-10 font-mono font-bold text-slate-700 text-sm">RES</span>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden relative"><div className={glowBarClass} style={{ width: `${Math.min(product.res || 0, 100)}%` }} /></div>
              <span className="w-8 text-right font-mono text-sm text-slate-500">{product.res || 0}</span>
            </div>
        </div>
      </div>

      <div className="w-1/2 h-full overflow-y-auto pr-4 pb-6 flex flex-col gap-8 custom-scrollbar">
          
          <div>
            <p className="font-mono text-sm text-cyan-600 font-bold mb-2">
              Home / {product.category} / {product.brand}
            </p>
            <h1 className="text-4xl font-sans font-bold text-slate-900 leading-tight mb-4">
              {product.title}
            </h1>
            <div className="text-3xl font-mono text-slate-800 flex items-center gap-3">
              <Diamond className="w-6 h-6 text-cyan-500" />
              {product.price}
            </div>
          </div>

          <div className="w-full h-px bg-slate-100 shrink-0" />

          {product.options?.length > 0 && (
            <div className="flex flex-col gap-6 shrink-0">
              {product.options.map(option => (
                <div key={option.id}>
                  <h3 className="text-sm font-bold text-slate-700 font-mono mb-3 uppercase tracking-widest">{option.name}</h3>
                  <div className="flex flex-wrap gap-3">
                    {option.values.map(val => (
                      <button
                        key={val}
                        onClick={() => setSelectedOptions(prev => ({ ...prev, [option.id]: val }))}
                        className={cn(
                          "px-5 py-2.5 rounded-xl border text-sm font-mono transition-all duration-300",
                          selectedOptions[option.id] === val
                            ? "border-cyan-500 bg-cyan-50 text-cyan-700 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        )}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="shrink-0 bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
            <div 
              className="text-slate-600 leading-relaxed font-sans 
                         [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-slate-800 [&>h3]:mb-3 [&>h3]:mt-6 [&>h3:first-child]:mt-0 [&>h3]:flex [&>h3]:items-center [&>h3]:gap-2
                         [&>p]:mb-4 [&>p:last-child]:mb-0
                         [&>ul]:list-none [&>ul]:space-y-3 [&>ul]:mb-4
                         [&>ul>li]:relative [&>ul>li]:pl-6 [&>ul>li]:text-slate-600
                         [&>ul>li::before]:content-[''] [&>ul>li::before]:absolute [&>ul>li::before]:left-0 [&>ul>li::before]:top-2 [&>ul>li::before]:w-2 [&>ul>li::before]:h-2 [&>ul>li::before]:bg-cyan-400 [&>ul>li::before]:rounded-sm [&>ul>li::before]:shadow-[0_0_8px_rgba(34,211,238,0.6)]
                         [&>ul>li>strong]:text-slate-800 [&>ul>li>strong]:font-bold"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>

          {product.sections?.length > 0 && (
            <div className="shrink-0 flex flex-col gap-4">
              <h3 className="font-mono text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <List className="w-4 h-4" /> Specifications
              </h3>
              <div className="grid grid-cols-1 gap-0 bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                {product.sections.map((sec, idx) => (
                  <div key={sec.id} className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4", idx !== 0 && "border-t border-slate-100")}>
                    <span className="text-slate-500 font-mono text-sm">{sec.title}</span>
                    <span className="text-slate-800 font-bold font-sans text-sm sm:text-right">{sec.content}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto pt-8 px-4 shrink-0 sticky bottom-0 z-10">
            <div className="glass-panel p-6 rounded-4xl flex flex-col gap-6 shadow-lg border border-white/60">
              
              <div className="flex items-center justify-between px-2">
                <span className="text-slate-500 font-mono text-sm flex items-center gap-2">
                  <span className={cn("w-2 h-2 rounded-full animate-pulse", product.stock > 0 ? "bg-green-400" : "bg-red-400")}></span>
                  {product.stock > 0 ? `${product.stock} in armory` : 'Out of stock'}
                </span>
                
                <div className="flex items-center gap-4 bg-slate-100/80 rounded-2xl p-1.5 border border-slate-200/50">
                  <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1 || isCartLoading} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm hover:text-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all">-</button>
                  <span className="font-mono font-bold w-6 text-center text-slate-800">{quantity}</span>
                  <button onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock || isCartLoading} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm hover:text-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all">+</button>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isCartLoading}
                  className="flex-1 py-4 rounded-2xl border-2 border-cyan-500 text-cyan-600 font-mono font-bold text-sm tracking-widest flex items-center justify-center gap-2 hover:bg-cyan-50 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
                >
                  {isCartLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />} 
                  {isCartLoading ? 'ADDING...' : 'CART'}
                </button>
                <button 
                  disabled={product.stock === 0 || isCartLoading}
                  className="flex-1 py-4 rounded-2xl bg-cyan-500 text-white font-mono font-bold text-sm tracking-widest flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(34,211,238,0.4)] hover:bg-cyan-400 hover:shadow-[0_4px_25px_rgba(34,211,238,0.6)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                >
                  <Zap className="w-5 h-5" /> BUY NOW
                </button>
              </div>

            </div>
          </div>

      </div>

    </div>
  );
}