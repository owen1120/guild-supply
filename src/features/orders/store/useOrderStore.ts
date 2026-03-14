import { create } from 'zustand';
import { orderService, type Order } from '../services/orderService';

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  
  currentOrder: Order | null;
  isDetailLoading: boolean;
  
  fetchOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  clearLocalOrders: () => void;
  clearCurrentOrder: () => void; 
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  isLoading: false,
  error: null,
  
  currentOrder: null,
  isDetailLoading: false,

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

  fetchOrderById: async (id: string) => {
    set({ isDetailLoading: true, error: null });
    try {
      const data = await orderService.getOrderById(id);
      set({ currentOrder: data });
    } catch (error) {
      console.error(`Failed to fetch order ${id}:`, error);
      set({ error: error instanceof Error ? error.message : 'Failed to fetch order details' });
    } finally {
      set({ isDetailLoading: false });
    }
  },

  clearLocalOrders: () => {
    set({ orders: [], currentOrder: null, error: null });
  },

  clearCurrentOrder: () => {
    set({ currentOrder: null, error: null });
  }
}));