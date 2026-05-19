import React, { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function DeleteUserModal({ user, onClose, onConfirm }) {
  const [confirmText, setConfirmText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (confirmText.toLowerCase() !== 'hapus') return;
    
    setIsSubmitting(true);
    try {
      await onConfirm(user.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = confirmText.toLowerCase() !== 'hapus' || isSubmitting;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card" style={{ maxWidth: '420px', width: '100%', padding: '0', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', marginBottom: 0 }}>
          <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--red)' }}>
            <AlertTriangle size={18} /> Konfirmasi Hapus
          </h3>
          <button className="btn-close" onClick={onClose} style={{ fontSize: '18px' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <p style={{ fontSize: '14px', color: 'var(--text)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
            Anda akan menghapus pengguna <strong>{user.name}</strong> ({user.email}) secara permanen dari sistem.
          </p>
          
          <p style={{ fontSize: '13px', color: 'var(--text3)', margin: '0 0 16px 0', lineHeight: 1.4 }}>
            Untuk melanjutkan, silakan ketik kata <strong style={{ color: 'var(--red)' }}>hapus</strong> di bawah ini sebagai konfirmasi pengamanan.
          </p>

          <div className="form-group mb-20">
            <input 
              type="text"
              required
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              placeholder="Ketik 'hapus' untuk konfirmasi"
              autoFocus
              style={{ 
                width: '100%', 
                borderColor: confirmText.toLowerCase() === 'hapus' ? 'var(--green)' : 'var(--border)',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          <div className="btn-row" style={{ marginTop: '0', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={isSubmitting}>
              Batal
            </button>
            <button 
              type="submit" 
              className="btn btn-danger" 
              disabled={isButtonDisabled}
              style={{
                opacity: isButtonDisabled ? 0.6 : 1,
                cursor: isButtonDisabled ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Menghapus...' : 'Hapus Pengguna'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
