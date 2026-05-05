import React, { useState } from 'react';
import useModalStore from '../../store/modalStore';

export default function ProfileSecurity() {
  const { showAlert } = useModalStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      showAlert('Password baru dan konfirmasi tidak cocok!', 'Kesalahan', 'error');
      return;
    }
    showAlert('Password berhasil diubah (Dummy)', 'Berhasil', 'success');
    setShowForm(false);
    setFormData({ old_password: '', new_password: '', confirm_password: '' });
  };

  return (
    <div className="profile-security-section" style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)', marginBottom: '16px' }}>Keamanan Akun</h3>
      
      {!showForm ? (
        <button className="btn btn-outline" onClick={() => setShowForm(true)}>🔑 Ubah Password</button>
      ) : (
        <form onSubmit={handleUpdatePassword} style={{ maxWidth: '400px' }}>
          <div className="form-group mb-16">
            <label>Password Lama</label>
            <input 
              type="password" required
              value={formData.old_password}
              onChange={e => setFormData({...formData, old_password: e.target.value})}
              placeholder="Masukkan password lama"
            />
          </div>
          <div className="form-grid mb-16">
            <div className="form-group">
              <label>Password Baru</label>
              <input 
                type="password" required minLength={6}
                value={formData.new_password}
                onChange={e => setFormData({...formData, new_password: e.target.value})}
                placeholder="Min. 6 karakter"
              />
            </div>
            <div className="form-group">
              <label>Konfirmasi Password</label>
              <input 
                type="password" required
                value={formData.confirm_password}
                onChange={e => setFormData({...formData, confirm_password: e.target.value})}
                placeholder="Ulangi password baru"
              />
            </div>
          </div>
          <div className="btn-row">
            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Batal</button>
            <button type="submit" className="btn btn-primary">Simpan Password</button>
          </div>
        </form>
      )}
    </div>
  );
}
