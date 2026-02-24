export interface CartItem {
  id: string; 
  productId: string; 
  title: string; 
  price: number;
  quantity: number;
  image?: { url: string; altText?: string };
  imageUrl?: string;
  options?: Record<string, string>;
  stock: number;
}

export interface CartData {
  items: CartItem[];
  totalAmount: number;
  totalQuantity?: number;
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
  options?: Record<string, string>;
}

const API_URL = import.meta.env.VITE_API_URL || '';
const BASE_URL = `${API_URL}/cart`;

const getHeaders = () => {
  const token = localStorage.getItem('token'); 
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const cartService = {
  async getCart(): Promise<CartData> {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch cart');
    const data = await response.json();
    return data.data ? data.data : data; 
  },

  async addToCart(payload: AddToCartPayload): Promise<CartData> {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Failed to add item to cart');
    const data = await response.json();
    return data.data ? data.data : data;
  },

  async updateQuantity(itemId: string, quantity: number): Promise<CartData> {
    const response = await fetch(`${BASE_URL}/${itemId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) throw new Error('Failed to update quantity');
    const data = await response.json();
    return data.data ? data.data : data;
  },

  async removeItem(itemId: string): Promise<CartData> {
    const response = await fetch(`${BASE_URL}/${itemId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error('Failed to remove item');
    const data = await response.json();
    return data.data ? data.data : data;
  },

  async clearCart(): Promise<CartData> {
    const response = await fetch(BASE_URL, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error('Failed to clear cart');
    const data = await response.json();
    return data.data ? data.data : data;
  }
};