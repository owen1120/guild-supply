// src/types/inventory.ts

export type Rarity = 'N' | 'R' | 'SR' | 'SSR' | 'UR';
export type StockStatus = 'IN_STOCK' | 'OUT_OF_STOCK' | 'PRE_ORDER';
export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

// 基礎資訊區塊
export interface ProductBasicInfo {
  name: string;
  brand: string;
  ribbons: string[];
  description_html: string;
  custom_sections: {
    id: string;
    title: string;
    content: string;
  }[];
  options: {
    id: string;
    name: string;
    values: string[];
  }[];
}

// 價格與優惠
export interface ProductPricing {
  base_price: number;
  is_special_offer: boolean;
  discount: {
    value: number;
    type: DiscountType;
  };
}

// 庫存邏輯
export interface ProductInventory {
  track_inventory: boolean;
  stock_quantity: number;
  sku: string;
  stock_status: StockStatus;
}

// RPG 數值 (這可是靈魂！)
export interface ProductRPGTuning {
  rarity: Rarity;
  stats: {
    def?: number;
    agi?: number;
    res?: number;
    atk?: number;
    hp?: number;
  };
  tags: string[];
}

// 媒體資源
export interface ProductMedia {
  images: {
    id: string;
    url: string;
    is_primary: boolean;
    alt_text: string;
  }[];
  videos: string[];
}

export interface Product {
  id: string;
  product_id: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  
  basic_info: ProductBasicInfo;
  pricing: ProductPricing;
  inventory: ProductInventory;
  pre_order: {
    is_enabled: boolean;
    shipping_message: string;
    restriction: {
      type: string;
      limit_quantity: number | null;
    };
  };
  rpg_tuning: ProductRPGTuning;
  media: ProductMedia;
  seo: {
    meta_title: string;
    meta_description: string;
    slug: string;
  };
}