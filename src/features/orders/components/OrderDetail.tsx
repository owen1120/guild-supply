import { useEffect } from 'react';
import { 
  ChevronLeft, Package, Clock, CheckCircle2, Truck, 
  Diamond, XCircle, MapPin, CreditCard, Receipt 
} from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import { Skeleton } from '../../../components/ui/Skeleton';
import { cn } from '../../../utils/cn';

interface ProductSnapshot {
  visuals?: { icon?: string };
  imageUrl?: string;
  basic_info?: { name?: string };
  title?: string;
}

interface PaymentInfo {
  method?: string;
}

const getStatusConfig = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'PENDING':
      return { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200', label: 'Pending Payment' };
    case 'PAID':
      return { icon: Package, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200', label: 'Processing' };
    case 'SHIPPED':
      return { icon: Truck, color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-200', label: 'In Transit' };
    case 'COMPLETED':
      return { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50 border-green-200', label: 'Delivered' };
    case 'CANCELLED':
      return { icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50 border-rose-200', label: 'Cancelled' };
    default:
      return { icon: Package, color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200', label: status || 'Unknown' };
  }
};

interface OrderDetailProps {
  orderId: string;
  onBack: () => void; 
}

export default function OrderDetail({ orderId, onBack }: OrderDetailProps) {
  const { currentOrder, isDetailLoading, fetchOrderById, clearCurrentOrder } = useOrderStore();

  useEffect(() => {
    fetchOrderById(orderId);
    return () => clearCurrentOrder();
  }, [orderId, fetchOrderById, clearCurrentOrder]);

  if (isDetailLoading || !currentOrder) {
    return (
      <div className="flex flex-col h-full overflow-hidden animate-in fade-in duration-300">
        {/* 頂部導航骨架 */}
        <div className="flex items-center gap-4 mb-6 shrink-0">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="w-48 h-6" />
            <Skeleton className="w-32 h-4" />
          </div>
        </div>

        {/* 內容區骨架 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 pb-6">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Skeleton className="w-full h-32 rounded-3xl" />
            <Skeleton className="w-full h-32 rounded-3xl" />
            <Skeleton className="w-full h-32 rounded-3xl" />
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton className="w-full h-48 rounded-3xl" />
            <Skeleton className="w-full h-32 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(currentOrder.status);
  const StatusIcon = statusConfig.icon;
  const dateObj = new Date(currentOrder.createdAt);
  const formattedDate = isNaN(dateObj.getTime()) 
    ? currentOrder.createdAt 
    : new Intl.DateTimeFormat('en-US', { 
        month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
      }).format(dateObj);

  const shipping = currentOrder.shippingInfo as Record<string, string> | undefined;
  const summary = currentOrder.pricingSummary as { subtotal?: number; shippingFee?: number; total?: number } | undefined;
  
  const payment = currentOrder.paymentInfo as unknown as PaymentInfo | undefined;

  return (
    <div className="flex flex-col h-full overflow-hidden animate-in slide-in-from-right-4 fade-in duration-500">
      
      {/* --- 頂部導航與狀態 (Header) --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-cyan-600 hover:border-cyan-200 hover:bg-cyan-50 transition-all shadow-sm active:scale-95 shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
              Contract #{currentOrder.id.slice(0, 8).toUpperCase()}
            </h2>
            <p className="font-mono text-xs text-slate-500 mt-1">{formattedDate}</p>
          </div>
        </div>
        
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full border font-mono text-sm font-bold uppercase tracking-widest shrink-0 w-fit", 
          statusConfig.bg, statusConfig.color
        )}>
          <StatusIcon className="w-4 h-4" />
          {statusConfig.label}
        </div>
      </div>

      {/* --- 內容區 (Content Grid) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 pb-6">
        
        {/* 左側：商品明細列表 */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="font-mono text-sm font-bold text-slate-800 tracking-widest uppercase flex items-center gap-2 pl-2">
            <Package className="w-4 h-4" /> Contract Artifacts
          </h3>
          
          <div className="flex flex-col gap-4">
            {currentOrder.items?.map((item) => {
              const snapshot = item.productSnapshot as unknown as ProductSnapshot | undefined;
              const imageUrl = snapshot?.visuals?.icon || snapshot?.imageUrl || 'https://placehold.co/100';
              const itemName = snapshot?.basic_info?.name || snapshot?.title || 'Unknown Artifact';
              
              return (
                <div key={item.id} className="glass-panel p-4 rounded-3xl border border-white/60 shadow-sm flex gap-4 items-center">
                  <div className="w-20 h-20 shrink-0 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                    <img src={imageUrl} alt={itemName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-base truncate">{itemName}</h4>
                    <p className="font-mono text-xs text-slate-500 mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-mono text-lg font-bold text-slate-700 flex items-center gap-1">
                    <Diamond className="w-4 h-4 text-cyan-500" />
                    {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 右側：金額總計、物流與付款資訊 */}
        <div className="flex flex-col gap-6">
          
          {/* 金額總結面板 */}
          <div className="glass-panel p-6 rounded-3xl border border-white/60 shadow-sm flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />
            
            <h3 className="font-mono text-sm font-bold text-slate-800 tracking-widest uppercase flex items-center gap-2 border-b border-slate-200/60 pb-3">
              <Receipt className="w-4 h-4" /> Summary
            </h3>
            
            <div className="flex flex-col gap-3 font-mono text-sm">
              <div className="flex justify-between items-center text-slate-600">
                <span>Subtotal</span>
                <span>{summary?.subtotal?.toLocaleString() || '---'}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Logistics Fee</span>
                <span>{summary?.shippingFee?.toLocaleString() || '0'}</span>
              </div>
            </div>
            
            <div className="w-full h-px bg-slate-200/60" />
            
            <div className="flex justify-between items-end">
              <span className="font-mono text-sm font-bold text-slate-500 uppercase tracking-widest">Total</span>
              <span className="flex items-center gap-1.5 text-2xl font-mono font-bold text-cyan-600">
                <Diamond className="w-5 h-5" />
                {currentOrder.total?.toLocaleString() || summary?.total?.toLocaleString() || '0'}
              </span>
            </div>
          </div>

          {/* 物流資訊面板 */}
          <div className="glass-panel p-6 rounded-3xl border border-white/60 shadow-sm flex flex-col gap-3">
            <h3 className="font-mono text-sm font-bold text-slate-800 tracking-widest uppercase flex items-center gap-2 border-b border-slate-200/60 pb-3">
              <MapPin className="w-4 h-4" /> Logistics Coordinates
            </h3>
            {shipping ? (
              <div className="flex flex-col gap-1 font-mono text-xs text-slate-600 mt-2">
                <p className="font-bold text-slate-800 text-sm mb-1">{shipping.recipient || 'N/A'}</p>
                <p>{shipping.phone || 'N/A'}</p>
                <p className="leading-relaxed mt-1">
                  {shipping.city} {shipping.district} <br/>
                  {shipping.detail}
                </p>
              </div>
            ) : (
              <p className="font-mono text-xs text-slate-400 mt-2">Logistics coordinates sealed.</p>
            )}
          </div>

          {/* 付款資訊面板 */}
          <div className="glass-panel p-6 rounded-3xl border border-white/60 shadow-sm flex flex-col gap-3">
            <h3 className="font-mono text-sm font-bold text-slate-800 tracking-widest uppercase flex items-center gap-2 border-b border-slate-200/60 pb-3">
              <CreditCard className="w-4 h-4" /> Payment Contract
            </h3>
            <div className="flex items-center gap-3 mt-2">
               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                 <CreditCard className="w-4 h-4 text-slate-500" />
               </div>
               <p className="font-mono text-sm font-bold text-slate-700">
                 {payment?.method || 'Authorized Transaction'}
               </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}