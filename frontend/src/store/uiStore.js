import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * uiStore - Mengelola state antarmuka pengguna (UI) seperti status sidebar.
 * Menggunakan persist agar pilihan user (sidebar terbuka/tertutup) tersimpan di browser.
 */
const useUiStore = create(
  persist(
    (set) => ({
      isSidebarOpen: true,
      theme: 'light',
      fontSize: 'm', // 'xs', 's', 'm', 'l', 'xl'
      displaySize: 'm', // 'xs', 's', 'm', 'l', 'xl'
      
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      
      setTheme: (theme) => set({ theme }),
      setFontSize: (size) => set({ fontSize: size }),
      setDisplaySize: (size) => set({ displaySize: size }),
    }),
    {
      name: 'ethes-ui-storage', // kunci di localStorage
    }
  )
);

export default useUiStore;
