import axios from 'axios';
import type { Product } from '../../../types/inventory';
import type { SortOption } from '../../../components/ui/SortSelect';
import type { FilterState } from '../../../components/inventory/InventorySidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'; 

interface ApiResponse {
  products: Product[];
}

interface RpgStats {
  def?: number;
  agi?: number;
  res?: number;
}

export const productService = {
  
  getAll: async (
      page = 1, 
      limit = 9, 
      sort: SortOption = 'newest',
      filters?: FilterState 
  ): Promise<{ data: Product[]; totalCount: number }> => {
    try {
      const response = await axios.get<ApiResponse>(`${API_URL}/products`);
      let allProducts = response.data.products || [];

      if (filters) {
          allProducts = allProducts.filter(product => {
              if (filters.rarity.length > 0) {
                  if (!filters.rarity.includes(product.rpg_tuning.rarity)) {
                      return false;
                  }
              }

              const price = product.pricing.base_price;
              if (filters.minPrice && price < Number(filters.minPrice)) return false;
              if (filters.maxPrice && price > Number(filters.maxPrice)) return false;

              const stats = product.rpg_tuning.stats as unknown as RpgStats; 
              
              const def = stats?.def ?? 0;
              const agi = stats?.agi ?? 0;
              const res = stats?.res ?? 0;

              if (def < filters.stats.def.min || def > filters.stats.def.max) return false;
              if (agi < filters.stats.agi.min || agi > filters.stats.agi.max) return false;
              if (res < filters.stats.res.min || res > filters.stats.res.max) return false;

              return true;
          });
      }

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

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = sortedProducts.slice(startIndex, endIndex);

      return {
        data: paginatedData,
        totalCount: sortedProducts.length, 
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