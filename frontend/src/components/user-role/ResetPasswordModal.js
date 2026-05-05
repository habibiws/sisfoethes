import React, { useState } from 'react';

export default function ResetPasswordModal({ user, onClose, onReset }) {
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onReset(user.id, newPassword);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card" style={{ maxWidth: '420px', width: '100%', padding: '32px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Reset Password</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        
        <div style={{ padding: '0 4px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text3)', marginBottom: '20px', lineHeight: '1.5' }}>
            Mereset password untuk <strong>{user.name}</strong>. Anda tidak dapat melihat password lama pengguna.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-20">
              <label>Password Baru</label>
              <input 
                type="password" required minLength={8}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Masukkan password baru (min 8 karakter)"
                autoFocus
                style={{ width: '100%' }}
              />
            </div>
            
            <div className="btn-row" style={{ marginTop: '10px' }}>
              <button type="button" className="btn btn-ghost" onClick={onClose}>Batal</button>
              <button type="submit" className="btn btn-primary">Update Password</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
