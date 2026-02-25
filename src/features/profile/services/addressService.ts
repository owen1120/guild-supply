export interface Address {
  id: string;
  userId: string;
  recipient: string;
  phone: string;
  city: string;
  district: string;
  detail: string;
  createdAt: string;
  isDefault: boolean;
}

export interface CreateAddressPayload {
  recipient: string;
  phone: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

export type UpdateAddressPayload = Partial<CreateAddressPayload>;

const API_URL = import.meta.env.VITE_API_URL || '';
const BASE_URL = `${API_URL}/guild/addresses`;

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const addressService = {
  async getAddresses(): Promise<Address[]> {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch addresses');
    const data = await response.json();
    return data.data ? data.data : data;
  },

  async createAddress(payload: CreateAddressPayload): Promise<Address> {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Failed to create address');
    const data = await response.json();
    return data.data ? data.data : data;
  },

  async updateAddress(id: string, payload: UpdateAddressPayload): Promise<Address> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Failed to update address');
    const data = await response.json();
    return data.data ? data.data : data;
  },

  async deleteAddress(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error('Failed to delete address');
  }
};