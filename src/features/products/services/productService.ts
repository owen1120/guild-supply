// src/features/products/services/productService.ts

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface ProductSection {
  id: string;
  title: string;
  content: string;
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
}

export interface ProductVideo {
  id: string;
  url: string;
  title?: string;
}

export interface ProductDetail {
  id: string;
  title: string;
  description: string;
  brand: string;
  price: number;
  stock: number;
  sku: string;
  isPublished: boolean;
  category: string;
  ribbons: string[];
  options: ProductOption[];
  sections: ProductSection[];
  images: ProductImage[];
  videos: ProductVideo[];
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | string;
  def: number;
  agi: number;
  res: number;
  rpgDetails: {
    tags: string[];
  };
  pricingDetail: {
    discount: {
      type: string;
      value: number;
    };
    isSpecialOffer: boolean;
  };
  preOrder: {
    isEnabled: boolean;
    restriction: {
      type: string;
      limitQuantity: number | null;
    };
    shippingMessage: string;
  };
  seo: {
    slug: string;
    metaTitle: string;
    metaDescription: string;
  };
  createdAt: string;
  updatedAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || '';

// 💎 確保這裡是 products (有 s)
const BASE_URL = `${API_URL}/products`;

export const productService = {
  async getProductById(id: string): Promise<ProductDetail> {
    // 💎 組合終極網址，並印在 Console 讓你隨時監控
    const targetUrl = `${BASE_URL}/${id}`;
    console.log("🔥 [API Request] Fetching product from:", targetUrl);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product with ID: ${id}. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("🔥 [API Response] Raw data received:", data);
    
    // 💎 防禦機制：如果後端把資料包在 `data` 屬性裡，我們自動拆解它
    return data.data ? data.data : data;
  },

  async getCategories() {
    const response = await fetch(`${BASE_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = await response.json();
    return data.data ? data.data : data;
  },

  async getFeaturedProducts() {
    const response = await fetch(`${BASE_URL}/featured`);
    if (!response.ok) throw new Error('Failed to fetch featured products');
    const data = await response.json();
    return data.data ? data.data : data;
  }
};