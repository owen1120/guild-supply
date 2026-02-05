import axios from 'axios';
import type { Product } from '../../../types/inventory';
import type { SortOption } from '../../../components/ui/SortSelect';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'; 

interface ApiResponse {
  products: Product[];
}

export const productService = {
  
  getAll: async (page = 1, limit = 9, sort: SortOption = 'newest'): Promise<{ data: Product[]; totalCount: number }> => {
    try {
      const response = await axios.get<ApiResponse>(`${API_URL}/products`);
      
      const allProducts = response.data.products || [];

      const sortedProducts = [...allProducts];

      switch (sort) {
          case 'name_asc':
              sortedProducts.sort((a, b) => a.basic_info.name.localeCompare(b.basic_info.name));
              break;
          case 'name_desc':
              sortedProducts.sort((a, b) => b.basic_info.name.localeCompare(a.basic_info.name));
              break;
          case 'price_asc':
              sortedProducts.sort((a, b) => a.pricing.base_price - b.pricing.base_price);
              break;
          case 'price_desc':
              sortedProducts.sort((a, b) => b.pricing.base_price - a.pricing.base_price);
              break;
          
          case 'newest':
              sortedProducts.sort((a, b) => String(b.id).localeCompare(String(a.id), undefined, { numeric: true })); 
              break;
          case 'oldest':
              sortedProducts.sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));
              break;
      }

      // 前端分頁
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = sortedProducts.slice(startIndex, endIndex);

      return {
        data: paginatedData,
        totalCount: allProducts.length,
      };

    } catch (error) {
      console.error("Failed to fetch products:", error);
      return { data: [], totalCount: 0 };
    }
  },

  getById: async (id: string): Promise<Product | undefined> => {
    try {
      const response = await axios.get<Product>(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      return undefined;
    }
  }
};