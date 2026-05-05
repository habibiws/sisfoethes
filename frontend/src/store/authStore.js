import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isInitialLoading: true, // For app-wide auth check
  isActionLoading: false,  // For button loading states
  error: null,
  
  clearError: () => set({ error: null }),

  login: async (email, password) => {
    set({ isActionLoading: true, error: null });
    try {
      const response = await api.post('/login', { email, password });
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, isActionLoading: false });
      return true;
    } catch (err) {
      set({ 
        isActionLoading: false, 
        error: err.response?.data?.message || 'Terjadi kesalahan saat login' 
      });
      return false;
    }
  },

  register: async (userData) => {
    set({ isActionLoading: true, error: null });
    try {
      await api.post('/register', userData);
      // No longer auto-login after register
      set({ isActionLoading: false });
      return true;
    } catch (err) {
      set({ 
        isActionLoading: false, 
        error: err.response?.data?.message || 'Terjadi kesalahan saat pendaftaran' 
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  fetchUser: async () => {
    set({ isInitialLoading: true });
    try {
      const response = await api.get('/me');
      set({ user: response.data.user, isAuthenticated: true, isInitialLoading: false });
    } catch (err) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false, isInitialLoading: false });
    }
  },

  updateProfile: async (profileData) => {
    set({ isActionLoading: true, error: null });
    try {
      const response = await api.post('/me', profileData);
      set({ user: response.data.user, isActionLoading: false });
      return { success: true, message: response.data.message };
    } catch (err) {
      console.error('Update Profile Error:', err.response || err);
      let errorMsg = 'Gagal memperbarui profil';
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        errorMsg = firstError;
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      set({ isActionLoading: false, error: errorMsg });
      return { success: false, message: errorMsg };
    }
  }
}));

export default useAuthStore;
