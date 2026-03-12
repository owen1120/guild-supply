import { create } from 'zustand';
import { orderService, type Order } from '../services/orderService';

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  
  // 獲取所有訂單
  fetchOrders: () => Promise<void>;
  
  // 清除本地訂單紀錄
  clearLocalOrders: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await orderService.getMyOrders();
      const sortedOrders = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      set({ orders: sortedOrders });
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to fetch guild orders' });
    } finally {
      set({ isLoading: false });
    }
  },

  clearLocalOrders: () => {
    set({ orders: [], error: null });
  }
}));