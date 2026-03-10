export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  addedAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || '';
const BASE_URL = `${API_URL}/guild/wishlist`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const wishlistService = {
  // 取得願望清單
  async getWishlist(): Promise<WishlistItem[]> {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch wishlist');
    return response.json();
  },

  // 加入願望清單
  async addWishlist(productId: string): Promise<WishlistItem> {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId }),
    });
    if (!response.ok) throw new Error('Failed to add to wishlist');
    return response.json();
  },

  // 移除願望清單
  async removeWishlist(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to remove from wishlist');
  }
};