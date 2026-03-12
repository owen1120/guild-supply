import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Backpack, Trash2, Diamond, ShieldAlert, Loader2, ArrowRight } from 'lucide-react';
import { useCartStore } from '../features/cart/store/useCartStore';

export default function Cart() {
  const navigate = useNavigate();
  const { items, totalAmount, isLoading, fetchCart, updateQuantity, removeItem, clearCart } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (isLoading && items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500 mb-4" />
        <p className="font-mono text-slate-500 tracking-widest animate-pulse">Opening backpack...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-slate-400">
        <div className="w-24 h-24 bg-slate-100/50 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Backpack className="w-12 h-12 text-slate-300" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-slate-700 mb-2">Your Armory is Empty</h2>
        <p className="font-mono text-sm">Venture into the equipment hall to find supplies.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full gap-8 md:gap-12 min-h-0">
      
      <div className="w-3/5 flex flex-col h-full relative min-h-0">
        <div className="flex items-center gap-3 mb-6 shrink-0">
          <Backpack className="w-6 h-6 text-cyan-600" />
          <h1 className="text-3xl font-serif font-bold text-slate-900">My Backpack</h1>
          <span className="font-mono text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full ml-auto">
            {items.length} Items
          </span>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 flex flex-col gap-4 pb-12">
          {items.map((item) => (
            <div key={item.id} className="glass-panel p-4 rounded-3xl flex gap-6 items-center border border-white/60 hover:shadow-md transition-shadow">
              
              <div className="w-24 h-24 shrink-0 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                {(item.image?.url || item.imageUrl) ? (
                  <img src={item.image?.url || item.imageUrl} alt={item.title} className="w-4/5 h-4/5 object-contain" />
                ) : (
                  <ShieldAlert className="w-8 h-8 text-slate-300" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-sans font-bold text-slate-800 truncate mb-1">{item.title}</h3>
                {item.options && Object.entries(item.options).map(([key, value]) => (
                  <p key={key} className="font-mono text-xs text-slate-500 mb-2">
                    {key}: <span className="text-cyan-700">{value as string}</span>
                  </p>
                ))}
                
                <div className="flex items-center gap-2 font-mono text-cyan-600 font-bold">
                  <Diamond className="w-4 h-4" />
                  {item.price}
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 shrink-0">
                <button 
                  onClick={() => removeItem(item.id)}
                  disabled={isLoading}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                  title="Discard Item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 bg-slate-100/80 rounded-xl p-1 border border-slate-200/50">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                    disabled={item.quantity <= 1 || isLoading} 
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm hover:text-cyan-600 disabled:opacity-50 transition-all"
                  >-</button>
                  <span className="font-mono font-bold w-6 text-center text-slate-800 text-sm">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                    disabled={item.quantity >= item.stock || isLoading} 
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm hover:text-cyan-600 disabled:opacity-50 transition-all"
                  >+</button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      <div className="w-2/5 h-full flex flex-col pt-14">
        <div className="glass-panel p-8 rounded-4xl flex flex-col gap-6 shadow-xl border border-white/60 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-xl font-serif font-bold text-slate-800 border-b border-slate-200/60 pb-4">
            Order Summary
          </h2>

          <div className="flex flex-col gap-4 font-mono text-sm">
            <div className="flex justify-between items-center text-slate-600">
              <span>Subtotal</span>
              <span className="flex items-center gap-1"><Diamond className="w-4 h-4 text-cyan-500"/> {totalAmount}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Guild Logistics (Shipping)</span>
              <span className="text-green-500 font-bold">Calculated in next step</span>
            </div>
          </div>

          <div className="w-full h-px bg-slate-200/60" />

          <div className="flex justify-between items-end">
            <span className="font-mono text-sm font-bold text-slate-500 uppercase tracking-widest">Total</span>
            <span className="flex items-center gap-2 text-3xl font-mono font-bold text-slate-900">
              <Diamond className="w-6 h-6 text-cyan-500" />
              {totalAmount}
            </span>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <button 
              className="w-full py-4 rounded-2xl bg-cyan-500 text-white font-mono font-bold text-sm tracking-widest flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(34,211,238,0.4)] hover:bg-cyan-400 hover:shadow-[0_4px_25px_rgba(34,211,238,0.6)] active:scale-95 transition-all"
              onClick={() => navigate('/checkout')}
            >
              PROCEED TO CHECKOUT <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={clearCart}
              disabled={isLoading}
              className="w-full py-3 rounded-2xl text-slate-400 font-mono font-bold text-xs tracking-widest hover:bg-slate-100 hover:text-slate-600 transition-all disabled:opacity-50"
            >
              CLEAR BACKPACK
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}