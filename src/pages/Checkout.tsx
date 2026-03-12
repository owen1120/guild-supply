import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Diamond, MapPin, CreditCard, Coins, CheckCircle2, 
  Loader2, ArrowRight, ShieldCheck, Backpack 
} from 'lucide-react';
import { useCartStore } from '../features/cart/store/useCartStore';
import { useProfileStore } from '../features/profile/store/useProfileStore';
import { orderService } from '../features/orders/services/orderService';
import { cn } from '../utils/cn';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCartStore();
  const { addresses, fetchAddresses } = useProfileStore();

  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<string>('CREDIT_CARD');
  
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [finalTotal, setFinalTotal] = useState<number>(totalAmount);
  
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 1. 載入物流座標
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // 2. 自動選擇預設座標
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr.id);
    }
  }, [addresses, selectedAddressId]);

  // 3. 預覽訂單計算 (當地址或付款方式改變時觸發)
  useEffect(() => {
    const fetchPreview = async () => {
      if (!selectedAddressId || items.length === 0) return;
      
      setIsPreviewing(true);
      try {
        const result = await orderService.previewOrder({
          addressId: selectedAddressId,
          paymentMethod: selectedPayment
        });
        
        if (result && result.shippingFee !== undefined) {
          setShippingFee(result.shippingFee as number);
          setFinalTotal(result.total as number);
        }
      } catch (error) {
        console.warn('Preview API unavailable or failed. Using local fallback estimation.', error);
        const fakeShipping = 50;
        setShippingFee(fakeShipping);
        setFinalTotal(totalAmount + fakeShipping);
      } finally {
        setIsPreviewing(false);
      }
    };

    fetchPreview();
  }, [selectedAddressId, selectedPayment, items.length, totalAmount]);

  // 4. 正式送出訂單
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert('Please select a logistics coordinate (Delivery Address).');
      return;
    }

    setIsSubmitting(true);
    try {
      await orderService.createOrder({
        addressId: selectedAddressId,
        paymentMethod: selectedPayment,
        remark: 'Handle with care. Guild artifacts inside.'
      });
      
      // 結帳成功！清空行囊並顯示成功畫面
      await clearCart();
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      alert('Contract failed! The guild treasury rejected your request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 防呆：如果購物車是空的，且還沒結帳成功，直接踢回行囊頁
  if (items.length === 0 && !isSuccess) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full gap-4 text-slate-500">
        <Backpack className="w-12 h-12 opacity-50" />
        <p className="font-mono text-sm tracking-widest">Your backpack is empty.</p>
        <button onClick={() => navigate('/inventory')} className="text-cyan-600 font-bold hover:underline">
          Return to Armory
        </button>
      </div>
    );
  }

  // 視圖：結帳成功 (Success State)
  if (isSuccess) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(74,222,128,0.4)]">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">Contract Sealed!</h1>
        <p className="font-mono text-slate-500 mb-8 text-center max-w-md">
          Your guild logistics have been arranged.<br/> The items will be teleported to your coordinates shortly.
        </p>
        <button 
          onClick={() => navigate('/profile')} 
          className="px-8 py-4 rounded-2xl bg-slate-900 text-white font-mono font-bold tracking-widest hover:bg-slate-800 transition-colors shadow-xl active:scale-95"
        >
          VIEW MY ORDERS
        </button>
      </div>
    );
  }

  // 視圖：結帳大廳 (Checkout Form)
  return (
    <div className="flex h-full w-full gap-8 md:gap-12 min-h-0">
      
      {/* 左側：設定區 (地址與付款) */}
      <div className="w-3/5 flex flex-col h-full overflow-y-auto custom-scrollbar pr-4 pb-12 gap-8">
        
        <div className="shrink-0 pt-4">
          <h1 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-cyan-600" />
            Secure Checkout
          </h1>
          <p className="font-mono text-sm text-slate-500 mt-2">Establish coordinates and sign the payment contract.</p>
        </div>

        {/* 區塊 1：物流座標 (Delivery Address) */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-mono font-bold text-slate-700 tracking-widest uppercase flex items-center gap-2">
            <MapPin className="w-5 h-5" /> 1. Logistics Coordinates
          </h2>
          
          {addresses.length === 0 ? (
            <div className="glass-panel p-6 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center gap-2">
              <span className="font-mono text-slate-400 text-sm">No coordinates found.</span>
              <button onClick={() => navigate('/profile')} className="text-cyan-600 font-bold hover:underline font-mono text-sm">
                Go to Address Book to set up
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map(addr => (
                <div 
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={cn(
                    "p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300",
                    selectedAddressId === addr.id 
                      ? "border-cyan-500 bg-cyan-50/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]" 
                      : "border-slate-200 bg-white/50 hover:border-slate-300"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-slate-800 font-sans">{addr.recipient}</span>
                    {selectedAddressId === addr.id && <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0" />}
                  </div>
                  <p className="font-mono text-xs text-slate-500 mb-1">{addr.phone}</p>
                  <p className="font-mono text-xs text-slate-600 line-clamp-2">
                    {addr.city} {addr.district} {addr.detail}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 區塊 2：付款方式 (Payment Method) */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-mono font-bold text-slate-700 tracking-widest uppercase flex items-center gap-2">
            <CreditCard className="w-5 h-5" /> 2. Payment Contract
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              onClick={() => setSelectedPayment('CREDIT_CARD')}
              className={cn(
                "p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center gap-4",
                selectedPayment === 'CREDIT_CARD' 
                  ? "border-cyan-500 bg-cyan-50/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]" 
                  : "border-slate-200 bg-white/50 hover:border-slate-300"
              )}
            >
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", selectedPayment === 'CREDIT_CARD' ? "bg-cyan-500 text-white" : "bg-slate-100 text-slate-400")}>
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 font-sans">Credit Card</span>
                <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">Visa / Mastercard</span>
              </div>
            </div>

            <div 
              onClick={() => setSelectedPayment('GUILD_COIN')}
              className={cn(
                "p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center gap-4",
                selectedPayment === 'GUILD_COIN' 
                  ? "border-amber-500 bg-amber-50/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]" 
                  : "border-slate-200 bg-white/50 hover:border-slate-300"
              )}
            >
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", selectedPayment === 'GUILD_COIN' ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-400")}>
                <Coins className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 font-sans">Guild Credits</span>
                <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">Use your points</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 右側：結算面板 (Order Summary) */}
      <div className="w-2/5 h-full flex flex-col pt-4">
        <div className="glass-panel p-8 rounded-4xl flex flex-col gap-6 shadow-xl border border-white/60 relative overflow-hidden h-full">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-xl font-serif font-bold text-slate-800 border-b border-slate-200/60 pb-4 shrink-0">
            Contract Summary
          </h2>

          {/* 購物清單預覽 */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-4">
            {items.map(item => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="w-16 h-16 shrink-0 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                  <img src={item.image?.url || item.imageUrl || 'https://placehold.co/100'} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate">{item.title}</p>
                  <p className="font-mono text-xs text-slate-500">Qty: {item.quantity}</p>
                </div>
                <div className="font-mono text-sm font-bold text-slate-700">
                  {item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div className="w-full h-px bg-slate-200/60 shrink-0" />

          {/* 金額計算區 */}
          <div className="flex flex-col gap-3 font-mono text-sm shrink-0">
            <div className="flex justify-between items-center text-slate-600">
              <span>Subtotal</span>
              <span>{totalAmount}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-2">
                Logistics Fee 
                {isPreviewing && <Loader2 className="w-3 h-3 animate-spin text-cyan-500" />}
              </span>
              <span>{shippingFee}</span>
            </div>
          </div>

          <div className="w-full h-px bg-slate-200/60 shrink-0" />

          <div className="flex justify-between items-end shrink-0">
            <span className="font-mono text-sm font-bold text-slate-500 uppercase tracking-widest">Total</span>
            <span className="flex items-center gap-2 text-3xl font-mono font-bold text-slate-900">
              <Diamond className="w-6 h-6 text-cyan-500" />
              {finalTotal}
            </span>
          </div>

          <button 
            onClick={handlePlaceOrder}
            disabled={isSubmitting || !selectedAddressId || isPreviewing}
            className="w-full py-4 rounded-2xl bg-cyan-500 text-white font-mono font-bold text-sm tracking-widest flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(34,211,238,0.4)] hover:bg-cyan-400 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 shrink-0"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>SEAL CONTRACT <ArrowRight className="w-5 h-5" /></>
            )}
          </button>

        </div>
      </div>

    </div>
  );
}