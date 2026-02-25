export interface UserProfile {
  id: string;
  email: string;
  role?: string;
  points?: number;
  avatar?: string;
  class?: string;
  codename?: string;
  exp?: number;
  level?: number;
  marketingConsent?: boolean;
  phone?: string;
  preferredActivities?: string;
  rankTitle?: string;
  realName?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string; 
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string;
  phone?: string;
}

export interface UpdatePasswordPayload {
  currentPassword?: string; 
  newPassword: string;
}

const API_URL = import.meta.env.VITE_API_URL || '';
const GUILD_BASE_URL = `${API_URL}/guild`;

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const response = await fetch(`${GUILD_BASE_URL}/profile`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch profile');
    const data = await response.json();
    return data.data ? data.data : data; 
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    const response = await fetch(`${GUILD_BASE_URL}/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Failed to update profile');
    const data = await response.json();
    return data.data ? data.data : data;
  },

  async updatePassword(payload: UpdatePasswordPayload): Promise<void> {
    const response = await fetch(`${GUILD_BASE_URL}/password`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Failed to update password');
  },

  async deleteAccount(): Promise<void> {
    const response = await fetch(`${GUILD_BASE_URL}/account`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error('Failed to delete account');
  }
};