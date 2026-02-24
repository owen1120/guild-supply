import { create } from 'zustand';
import { cartService, type CartItem, type AddToCartPayload, type CartData } from '../services/cartService';

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

const processCartData = (data: Partial<CartData>) => {
  const items = data.items || [];
  const calcTotalQty = items.reduce((sum: number, item: CartItem) => sum + (item.quantity || 1), 0);
  const calcTotalAmount = items.reduce((sum: number, item: CartItem) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
  
  return {
    items,
    totalAmount: data.totalAmount ? data.totalAmount : calcTotalAmount,
    totalQuantity: data.totalQuantity ? data.totalQuantity : calcTotalQty
  };
};

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
      set(processCartData(data));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch cart' });
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await cartService.addToCart(payload);
      set(processCartData(data));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add item to cart' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuantity: async (itemId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const data = await cartService.updateQuantity(itemId, quantity);
      set(processCartData(data));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update quantity' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  removeItem: async (itemId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await cartService.removeItem(itemId);
      set(processCartData(data));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to remove item' });
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
      set({ error: error instanceof Error ? error.message : 'Failed to clear cart' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));