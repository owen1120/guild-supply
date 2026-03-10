import { create } from 'zustand';
import { wishlistService, type WishlistItem } from '../services/wishlistService';

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  error: string | null;
  
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  
  checkIsWishlisted: (productId: string) => boolean;
  clearLocalWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchWishlist: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await wishlistService.getWishlist();
      set({ items: data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch wishlist' });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleWishlist: async (productId: string) => {
    const { items } = get();
    const existingItem = items.find(item => item.productId === productId);

    try {
      if (existingItem) {
        await wishlistService.removeWishlist(existingItem.id);
        set({ items: items.filter(item => item.id !== existingItem.id) });
      } else {
        const newItem = await wishlistService.addWishlist(productId);
        set({ items: [...items, newItem] });
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      get().fetchWishlist();
      throw error;
    }
  },

  checkIsWishlisted: (productId: string) => {
    return get().items.some(item => item.productId === productId);
  },

  clearLocalWishlist: () => {
    set({ items: [], error: null });
  }
}));