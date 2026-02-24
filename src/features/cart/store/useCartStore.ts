import { create } from 'zustand';
import { cartService, type CartItem, type AddToCartPayload } from '../services/cartService';

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalQuantity: number;
  isLoading: boolean;
  error: string | null;

  fetchCart: () => Promise<void>;
  addToCart: (payload: AddToCartPayload) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalAmount: 0,
  totalQuantity: 0,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await cartService.getCart();
      const calcTotalQty = (data.items || []).reduce((sum, item) => sum + item.quantity, 0);
      
      set({ 
        items: data.items || [], 
        totalAmount: data.totalAmount || 0,
        totalQuantity: data.totalQuantity !== undefined ? data.totalQuantity : calcTotalQty
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch cart';
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await cartService.addToCart(payload);
      const calcTotalQty = (data.items || []).reduce((sum, item) => sum + item.quantity, 0);
      
      set({ 
        items: data.items || [], 
        totalAmount: data.totalAmount || 0,
        totalQuantity: data.totalQuantity !== undefined ? data.totalQuantity : calcTotalQty
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add item to cart';
      set({ error: message });
      throw error; 
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuantity: async (itemId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const data = await cartService.updateQuantity(itemId, quantity);
      const calcTotalQty = (data.items || []).reduce((sum, item) => sum + item.quantity, 0);
      
      set({ 
        items: data.items || [], 
        totalAmount: data.totalAmount || 0,
        totalQuantity: data.totalQuantity !== undefined ? data.totalQuantity : calcTotalQty
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update quantity';
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  removeItem: async (itemId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await cartService.removeItem(itemId);
      const calcTotalQty = (data.items || []).reduce((sum, item) => sum + item.quantity, 0);
      
      set({ 
        items: data.items || [], 
        totalAmount: data.totalAmount || 0,
        totalQuantity: data.totalQuantity !== undefined ? data.totalQuantity : calcTotalQty
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to remove item';
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      await cartService.clearCart();
      set({ items: [], totalAmount: 0, totalQuantity: 0 });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to clear cart';
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));