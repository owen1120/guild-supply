import { create } from 'zustand';
import { profileService, type UserProfile, type UpdateProfilePayload, type UpdatePasswordPayload } from '../services/profileService';
import { addressService, type Address, type CreateAddressPayload, type UpdateAddressPayload } from '../services/addressService';

interface ProfileState {
  profile: UserProfile | null;
  addresses: Address[];
  isLoading: boolean;
  error: string | null;

  fetchProfile: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
  updatePassword: (payload: UpdatePasswordPayload) => Promise<void>;

  fetchAddresses: () => Promise<void>;
  createAddress: (payload: CreateAddressPayload) => Promise<void>;
  updateAddress: (id: string, payload: UpdateAddressPayload) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  addresses: [],
  isLoading: false,
  error: null,

  // ==========================================
  //  Profile 區塊
  // ==========================================
  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await profileService.getProfile();
      set({ profile: data });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch profile';
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await profileService.updateProfile(payload);
      set({ profile: data }); 
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      set({ error: message });
      throw error; 
    } finally {
      set({ isLoading: false });
    }
  },

  updatePassword: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await profileService.updatePassword(payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update password';
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // ==========================================
  //  Address 區塊
  // ==========================================
  fetchAddresses: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await addressService.getAddresses();
      set({ addresses: data || [] }); 
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch addresses';
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  createAddress: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await addressService.createAddress(payload);
      const data = await addressService.getAddresses();
      set({ addresses: data || [] });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create address';
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateAddress: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      await addressService.updateAddress(id, payload);
      const data = await addressService.getAddresses();
      set({ addresses: data || [] });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update address';
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAddress: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await addressService.deleteAddress(id);
      set({ addresses: get().addresses.filter(addr => addr.id !== id) });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete address';
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));