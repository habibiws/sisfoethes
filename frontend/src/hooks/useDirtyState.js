import { useState, useEffect, useCallback } from 'react';
import useModalStore from '../store/modalStore';

/**
 * Custom hook to manage dirty state and safe closing logic across modals/pages.
 * @param {Function} onClose - The actual close function to execute if safe.
 * @param {string} message - Custom confirmation message.
 */
export default function useDirtyState(onClose, message = 'Ada perubahan yang belum disimpan. Yakin ingin keluar?') {
  const [isDirty, setIsDirty] = useState(false);
  const { showConfirm } = useModalStore();

  // Function to handle close attempts safely
  const handleSafeClose = useCallback(() => {
    if (isDirty) {
      showConfirm(
        message,
        () => {
          setIsDirty(false);
          onClose();
        },
        'Konfirmasi Keluar'
      );
    } else {
      onClose();
    }
  }, [isDirty, onClose, message, showConfirm]);

  // Handle browser tab/window close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, message]);

  return {
    isDirty,
    setIsDirty,
    handleSafeClose
  };
}
