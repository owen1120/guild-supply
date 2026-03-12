// ==========================================
//  請求 (Request Payloads)
// ==========================================

export interface PreviewOrderPayload {
  addressId?: string;       // 用於計算運費的物流座標 ID
  paymentMethod?: string;   // 付款方式
}

export interface CreateOrderPayload {
  addressId: string;        // 建立訂單必填的物流座標 ID
  paymentMethod: string;    // 建立訂單必填的付款方式
  remark?: string;          // 訂單備註 (若後端有支援)
}

// ==========================================
//  回應 (Response Models) 嚴格對齊 DB Schema
// ==========================================

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  productSnapshot?: Record<string, JsonValue>; 
}

export interface Order {
  id: string;
  userId: string;
  status: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  
  paymentInfo?: Record<string, JsonValue>;
  pricingSummary?: {
    subtotal: number;
    shippingFee: number;
    discount?: number;
    total: number;
    [key: string]: JsonValue | undefined;
  };
  rpgAnalytics?: Record<string, JsonValue>;
  shippingInfo?: Record<string, JsonValue>;
  statusHistory?: Record<string, JsonValue>;
  
  items?: OrderItem[]; 
}

// ==========================================
//  API 通訊服務
// ==========================================

const API_URL = import.meta.env.VITE_API_URL || '';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const orderService = {
  
  // 1. 預覽訂單
  async previewOrder(payload: PreviewOrderPayload): Promise<Order['pricingSummary']> {
    const response = await fetch(`${API_URL}/orders/preview`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Failed to calculate order preview');
    return response.json();
  },

  // 2. 正式建立訂單
  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Failed to create order. The contract was rejected.');
    return response.json();
  },

  // 3. 查詢我的訂單
  async getMyOrders(): Promise<Order[]> {
    const response = await fetch(`${API_URL}/guild/orders`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch guild orders');
    return response.json();
  },

  // 4. 查詢訂單詳情
  async getOrderById(id: string): Promise<Order> {
    const response = await fetch(`${API_URL}/guild/orders/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch order snapshot');
    return response.json();
  }
};