export interface ProductBasicInfo {
  name: string;
  description: string;
  category: string;
}

export interface ProductPricing {
  base_price: number;
  currency: string;
}

export interface ProductStats {
  def: number;
  agi: number;
  res: number;
}

export interface ProductRpgTuning {
  rarity: string;
  stats: ProductStats;
}

export interface ProductVisuals {
  icon: string;
  images: string[]; 
  model_3d?: string; 
}

export interface ProductMetadata {
  is_published: boolean;
  created_at: string;
  updated_at: string;
  brand?: string;
  sku?: string;
  stock?: number;
}

export interface Product {
  id: string;
  basic_info: ProductBasicInfo;
  pricing: ProductPricing;
  rpg_tuning: ProductRpgTuning;
  visuals: ProductVisuals;
  metadata: ProductMetadata;
}