// src/features/inventory/services/productService.ts
import client from '../../../lib/axios';
import type { Product } from '../../../types/inventory';

interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
}

// 💎 1. 定義 "箱子" 的形狀 (解決 ProductResponse unused 的問題，因為我們等一下會用它)
interface ProductResponse {
  products: Product[];
}

// 💎 2. 定義 API 回傳的型別：它可能是 "直接的陣列" 或 "箱子"
// 這叫做聯合型別 (Union Type)
type ApiResponse = Product[] | ProductResponse;

export const productService = {
  getAll: async (page: number = 1, limit: number = 9): Promise<PaginatedResponse<Product>> => {
    try {
      // 💎 3. 把 <any> 換成具體的 <ApiResponse> (解決 Unexpected any)
      // 這告訴 Axios：回傳的東西只會是上面定義的那兩種之一
      const response = await client.get<ApiResponse>('/products', {
        params: { _page: page, _limit: limit },
      });

      // console.log("🔍 API Response Data:", response.data);

      let finalData: Product[] = [];
      const responseData = response.data;

      // 💎 4. 型別防衛 (Type Guard)：TypeScript 現在會聰明地幫你判斷
      if (Array.isArray(responseData)) {
        // 情況 A: 如果是陣列，它就是 Product[]
        finalData = responseData;
      } else if ('products' in responseData && Array.isArray(responseData.products)) {
        // 情況 B: 如果它是物件且有 products 屬性，它就是 ProductResponse
        finalData = responseData.products;
      } else {
        // 情況 C: 防呆
        finalData = [];
      }

      // 處理 Headers (保持不變)
      const totalCountHeader = response.headers['x-total-count'] || response.headers['X-Total-Count'];
      
      const totalCount = totalCountHeader 
        ? Number(totalCountHeader) 
        : finalData.length;

      return {
        data: finalData,
        totalCount: totalCount,
      };

    } catch (error) {
      console.error("❌ API Error:", error);
      return { data: [], totalCount: 0 };
    }
  },

  getById: async (id: string) => {
    const response = await client.get<Product>(`/products/${id}`);
    return response.data;
  },
};