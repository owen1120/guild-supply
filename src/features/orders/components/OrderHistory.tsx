import { useEffect } from 'react';
import { Package, Clock, CheckCircle2, Truck, Diamond, Loader2, XCircle } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import { cn } from '../../../utils/cn';

const getStatusConfig = (status: string) => {
  switch (status.toUpperCase()) {
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
      return { icon: Package, color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200', label: status };
  }
};

export default function OrderHistory() {
  const { orders, isLoading, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // 載入中畫面
  if (isLoading && orders.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full min-h-0">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500 mb-4" />
        <p className="font-mono text-slate-500 tracking-widest animate-pulse">Retrieving guild contracts...</p>
      </div>
    );
  }

  // 空狀態畫面 (沒有訂單時)
  if (orders.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full min-h-0 text-slate-400">
        <div className="w-24 h-24 bg-slate-100/50 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Package className="w-12 h-12 text-slate-300" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-slate-700 mb-2">No Contracts Found</h2>
        <p className="font-mono text-sm">You haven't established any logistics contracts yet.</p>
      </div>
    );
  }

  // 訂單列表展示
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar pr-2 pb-4">
      {orders.map((order) => {
        const statusConfig = getStatusConfig(order.status);
        const StatusIcon = statusConfig.icon;
        
        // 日期格式化處理
        const dateObj = new Date(order.createdAt);
        const formattedDate = isNaN(dateObj.getTime()) 
          ? order.createdAt 
          : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(dateObj);

        return (
          <div 
            key={order.id} 
            className="glass-panel p-6 rounded-3xl border border-white/60 hover:shadow-md hover:border-cyan-200 transition-all duration-300 flex flex-col gap-4 group"
          >
            {/* 上半部：日期 & 狀態標籤 */}
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm text-slate-500">{formattedDate}</span>
              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-full border font-mono text-xs font-bold uppercase tracking-widest transition-colors", 
                statusConfig.bg, 
                statusConfig.color
              )}>
                <StatusIcon className="w-3.5 h-3.5" />
                {statusConfig.label}
              </div>
            </div>

            {/* 下半部：訂單編號、項目數量 & 總金額 */}
            <div className="flex items-end justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-800 flex items-center gap-2 group-hover:text-cyan-700 transition-colors">
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </h3>
                <p className="font-mono text-xs text-slate-400 mt-1">
                  {order.items && order.items.length > 0 
                    ? `${order.items.length} items in this contract` 
                    : 'Contract details sealed'}
                </p>
              </div>
              
              <div className="text-right">
                <p className="font-mono text-[10px] text-slate-500 mb-1 uppercase tracking-widest">Total Amount</p>
                <div className="flex items-center gap-1.5 font-mono font-bold text-2xl text-cyan-600">
                  <Diamond className="w-5 h-5" />
                  {order.total.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}