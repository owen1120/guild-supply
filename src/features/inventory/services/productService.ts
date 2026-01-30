import client from '../../../lib/axios';
import { type Product } from '../../../types/inventory';


export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await client.get<Product[]>('/products');
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await client.get<Product>(`/products/${id}`);
    return response.data;
  },

};