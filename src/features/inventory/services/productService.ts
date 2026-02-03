// src/features/inventory/services/productService.ts
import client from '../../../lib/axios';
import type { Product } from '../../../types/inventory';

interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
}

export const productService = {
  getAll: async (page: number = 1, limit: number = 9): Promise<PaginatedResponse<Product>> => {
    const response = await client.get<Product[]>('/products', {
      params: { _page: page, _limit: limit },
    });

    // 💎 加入這行探測器！
    console.log("🔍 Debug Headers:", response.headers);

    // 嘗試讀取 (Axios 會把標頭轉小寫，所以通常是 x-total-count)
    const totalCountHeader = response.headers['x-total-count'] || response.headers['X-Total-Count'];
    
    // 如果讀不到，暫時給它一個 0
    const totalCount = totalCountHeader ? Number(totalCountHeader) : 0;

    return {
      data: response.data,
      totalCount: totalCount,
    };
  },

  getById: async (id: string) => {
    const response = await client.get<Product>(`/products/${id}`);
    return response.data;
  },
};