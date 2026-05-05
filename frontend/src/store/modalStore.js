import { create } from 'zustand';

const useModalStore = create((set) => ({
  alertConfig: null, // { message: string, type: 'info' | 'error' | 'success', title: string }
  confirmConfig: null, // { message: string, title: string, onConfirm: () => void, onCancel: () => void }

  showAlert: (message, title = 'Informasi', type = 'info') => 
    set({ alertConfig: { message, title, type } }),
    
  hideAlert: () => set({ alertConfig: null }),

  showConfirm: (message, onConfirm, title = 'Konfirmasi', onCancel = null) => 
    set({ confirmConfig: { message, title, onConfirm, onCancel } }),
    
  hideConfirm: () => set({ confirmConfig: null }),
}));

export default useModalStore;
