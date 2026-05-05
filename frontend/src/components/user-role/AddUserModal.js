import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AddUserModal({ onClose, onSave }) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card" style={{ maxWidth: '500px', width: '100%', padding: '32px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Tambah Pengguna Baru</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-16">
            <label>Nama Lengkap</label>
            <input
              type="text" required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Mohamad Yani, Ph.D."
            />
          </div>
          <div className="form-group mb-16">
            <label>Email</label>
            <input
              type="email" required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="username@example.com"
            />
          </div>
          <div className="form-group mb-16">
            <label>Password Awal</label>
            <input
              type="password" required
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              placeholder="Minimal 8 karakter"
              minLength={8}
            />
          </div>
          <div className="form-grid mb-16">
            <div className="form-group">
              <label>Role</label>
              <select
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="ketua_kk">Ketua KK</option>
                <option value="ketua_sub_kk">Ketua Sub-KK</option>
                <option value="anggota">Anggota Biasa</option>
              </select>
            </div>
            <div className="form-group">
              <label>Sub-KK</label>
              <select
                value={formData.sub_kk_id}
                onChange={e => setFormData({ ...formData, sub_kk_id: e.target.value })}
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
          <div className="btn-row">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary">Simpan Pengguna</button>
          </div>
        </form>
      </div>
    </div>
  );
}
