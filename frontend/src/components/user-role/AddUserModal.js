import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import useDirtyState from '../../hooks/useDirtyState';

export default function AddUserModal({ onClose, onSave }) {
  const { isDirty, setIsDirty, handleSafeClose } = useDirtyState(onClose);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'anggota',
    sub_kk_id: ''
  });

  const [subKks, setSubKks] = useState([]);
  const [isLoadingSubKks, setIsLoadingSubKks] = useState(true);

  useEffect(() => {
    const fetchSubKks = async () => {
      try {
        const response = await api.get('/sub-kks');
        setSubKks(response.data);
        if (response.data.length > 0) {
          setFormData(prev => ({ ...prev, sub_kk_id: response.data[0].id.toString() }));
        }
      } catch (error) {
        console.error('Gagal mengambil data Sub-KK:', error);
      } finally {
        setIsLoadingSubKks(false);
      }
    };
    fetchSubKks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setIsDirty(false);
  };

  return (
    <div className="modal-overlay" onClick={handleSafeClose}>
      <div className="modal card animate-pop" style={{ maxWidth: '500px', width: '100%', padding: '0', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)', marginBottom: 0 }}>
          <h3 className="modal-title">Tambah Pengguna Baru</h3>
          <button className="modal-close" onClick={handleSafeClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '28px' }}>
          <div className="form-group mb-16">
            <label>Nama Lengkap</label>
            <input
              name="name"
              type="text" required
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Mohamad Yani, Ph.D."
            />
          </div>
          <div className="form-group mb-16">
            <label>Email</label>
            <input
              name="email"
              type="email" required
              value={formData.email}
              onChange={handleChange}
              placeholder="username@example.com"
            />
          </div>
          <div className="form-group mb-16">
            <label>Password Awal</label>
            <input
              name="password"
              type="password" required
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimal 8 karakter"
              minLength={8}
            />
          </div>
          <div className="form-grid mb-16">
            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="ketua_kk">Ketua KK</option>
                <option value="ketua_sub_kk">Ketua Sub-KK</option>
                <option value="anggota">Anggota Biasa</option>
              </select>
            </div>
            <div className="form-group">
              <label>Sub-KK</label>
              <select
                name="sub_kk_id"
                value={formData.sub_kk_id}
                onChange={handleChange}
                disabled={isLoadingSubKks}
              >
                {isLoadingSubKks ? (
                  <option>Memuat...</option>
                ) : (
                  subKks.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))
                )}
              </select>
            </div>
          </div>
          <div className="btn-row" style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <button type="button" className="btn btn-ghost" onClick={handleSafeClose}>Batal</button>
            <button type="submit" className="btn btn-primary">Simpan Pengguna</button>
          </div>
        </form>
      </div>
    </div>
  );
}

