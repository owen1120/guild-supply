import axios from 'axios';
import type { Product } from '../../../types/inventory';
import type { SortOption } from '../../../components/ui/SortSelect';
import type { FilterState } from '../../../components/inventory/InventorySidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'; 

interface DBImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary?: boolean;
}

interface DBProduct {
  id: string;
  title?: string;
  category?: string;
  price?: number;
  description?: string;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
  brand?: string;
  sku?: string;
  stock?: number;
  agi?: number;
  def?: number;
  res?: number;
  rarity?: string;
  images?: string[] | DBImage[] | null; 
  rpgDetails?: Record<string, unknown> | null;
  options?: Record<string, unknown> | null;
  sections?: Record<string, unknown> | null;
  video?: Record<string, unknown> | null;
}

interface BackendResponse {
  success: boolean;
  data: DBProduct[]; 
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const fixDomain = (url: string): string => {
  if (!url) return '/assets/items/default.png';
  if (url.includes('cdn.guildsupply.com')) {
    return url.replace('cdn.guildsupply.com', 'cdn.hwcc0321.com');
  }
  return url;
};

const adaptProduct = (dbData: DBProduct): Product => {
  let iconUrl = '/assets/items/default.png';
  let imagesList: string[] = [];

  if (Array.isArray(dbData.images) && dbData.images.length > 0) {
      const firstImg = dbData.images[0];
      if (typeof firstImg === 'object' && firstImg !== null && 'url' in firstImg) {
          const imgObjs = dbData.images as DBImage[];
          imagesList = imgObjs.map(img => fixDomain(img.url));
          const primaryImg = imgObjs.find(img => img.isPrimary);
          if (primaryImg) {
              iconUrl = fixDomain(primaryImg.url);
          } else {
              iconUrl = fixDomain(imgObjs[0].url);
          }
      } 
      else if (typeof firstImg === 'string') {
          const rawUrl = firstImg;
          iconUrl = fixDomain(rawUrl);
          imagesList = (dbData.images as string[]).map(fixDomain);
      }
  }

  return {
    id: dbData.id,
    basic_info: {
      name: dbData.title || 'Unknown Item', 
      description: dbData.description || '',
      category: dbData.category || 'General',
    },
    pricing: {
      base_price: dbData.price || 0,
      currency: 'G',
    },
    rpg_tuning: {
      rarity: dbData.rarity || 'N', 
      stats: {
        def: dbData.def || 0,
        agi: dbData.agi || 0,
        res: dbData.res || 0
      },
    },
    visuals: {
      icon: iconUrl,       
      images: imagesList,  
      model_3d: '',
    },
    metadata: {
      is_published: dbData.isPublished ?? true,
      created_at: dbData.createdAt || new Date().toISOString(),
      updated_at: dbData.updatedAt || new Date().toISOString(),
      brand: dbData.brand,
      sku: dbData.sku,
      stock: dbData.stock
    }
  } as unknown as Product;
};

export const productService = {
  getAll: async (
      page = 1, 
      limit = 9, 
      sort: SortOption = 'newest',
      filters?: FilterState 
  ): Promise<{ data: Product[]; totalCount: number }> => {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      if (filters) {
          if (filters.minPrice) params.append('minPrice', filters.minPrice);
          if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
          if (filters.rarity.length > 0) {
             params.append('rarity', filters.rarity.join(',')); 
          }
          params.append('minDef', filters.stats.def.min.toString());
          params.append('maxDef', filters.stats.def.max.toString());
          params.append('minAgi', filters.stats.agi.min.toString());
          params.append('maxAgi', filters.stats.agi.max.toString());
          params.append('minRes', filters.stats.res.min.toString());
          params.append('maxRes', filters.stats.res.max.toString());
      }
      params.append('sort', sort);

      const response = await axios.get<BackendResponse>(`${API_URL}/products?${params.toString()}`);
      const { success, data, pagination } = response.data;
      if (!success) throw new Error('API reported failure');

      return {
        data: data.map(adaptProduct),
        totalCount: pagination.total, 
      };
    } catch (error) {
      console.error("Failed to fetch products:", error);
      return { data: [], totalCount: 0 };
    }
  },

  getById: async (id: string): Promise<Product | undefined> => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      if (response.data && response.data.success) {
          return adaptProduct(response.data.data as DBProduct);
      }
      return undefined;
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      return undefined;
    }
  },

  getFeatured: async (): Promise<Product[]> => {
    try {
      const response = await axios.get<{ success: boolean; data: DBProduct[] }>(`${API_URL}/products/featured`);
      if (response.data && response.data.success) {
        return response.data.data.map(adaptProduct);
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch featured products:", error);
      return [];
    }
  }
};