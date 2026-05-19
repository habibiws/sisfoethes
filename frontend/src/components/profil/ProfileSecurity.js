import React, { useState } from 'react';
import useModalStore from '../../store/modalStore';
import api from '../../services/api';
import { Key, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function ProfileSecurity() {
  const { showAlert } = useModalStore();
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (formData.new_password.length < 8) {
      showAlert('Password baru minimal harus 8 karakter!', 'Aturan Keamanan', 'error');
      return;
    }

    if (formData.new_password !== formData.new_password_confirmation) {
      showAlert('Password baru dan konfirmasi tidak cocok!', 'Kesalahan', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const response = await api.post('/me/password', {
        old_password: formData.old_password,
        new_password: formData.new_password,
        new_password_confirmation: formData.new_password_confirmation
      });

      showAlert(response.data.message || 'Password berhasil diperbarui', 'Berhasil', 'success');
      setShowForm(false);
      setFormData({ old_password: '', new_password: '', new_password_confirmation: '' });
    } catch (error) {
      console.error('Password update error:', error);
      const backendMessage = error.response?.data?.message || 'Gagal memperbarui password';
      showAlert(backendMessage, 'Kesalahan', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-card">
      <div className="profile-section-title">
        <Lock size={16} /> Keamanan Akun
      </div>

      <div style={{ marginBottom: '16px', fontSize: 'calc(13px * var(--font-scale, 1))', color: 'var(--text3)' }}>
        Ubah password login Anda secara berkala untuk menjaga keamanan data akademik Anda di KK ETHES. Password baru wajib memiliki minimal **8 karakter**.
      </div>
      
      {!showForm ? (
        <button className="btn btn-outline" onClick={() => setShowForm(true)}>
          Ubah Password Login
        </button>
      ) : (
        <form onSubmit={handleUpdatePassword} style={{ marginTop: '20px' }}>
          
          <div className="form-group mb-16" style={{ position: 'relative' }}>
            <label>Password Lama</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type={showOldPassword ? 'text' : 'password'} 
                required
                value={formData.old_password}
                onChange={e => setFormData({...formData, old_password: e.target.value})}
                placeholder="Masukkan password saat ini"
                style={{ paddingRight: '40px' }}
              />
              <button 
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                style={{
                  position: 'absolute', right: '10px', background: 'none', border: 'none', 
                  cursor: 'pointer', color: 'var(--text3)', display: 'flex', alignItems: 'center'
                }}
              >
                {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-grid mb-16">
            <div className="form-group" style={{ position: 'relative' }}>
              <label>Password Baru</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                  type={showNewPassword ? 'text' : 'password'} 
                  required minLength={8}
                  value={formData.new_password}
                  onChange={e => setFormData({...formData, new_password: e.target.value})}
                  placeholder="Min. 8 karakter"
                  style={{ paddingRight: '40px' }}
                />
                <button 
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: 'absolute', right: '10px', background: 'none', border: 'none', 
                    cursor: 'pointer', color: 'var(--text3)', display: 'flex', alignItems: 'center'
                  }}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label>Konfirmasi Password Baru</label>
              <input 
                type="password" required
                value={formData.new_password_confirmation}
                onChange={e => setFormData({...formData, new_password_confirmation: e.target.value})}
                placeholder="Ulangi password baru"
              />
            </div>
          </div>

          <div className="btn-row" style={{ borderTop: 'none', paddingTop: 0 }}>
            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)} disabled={isSaving}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? 'Menyimpan...' : 'Simpan Password Baru'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
