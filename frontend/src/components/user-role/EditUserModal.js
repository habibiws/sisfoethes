import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { User, Mail, Hash, BookOpen, Layers, Award, FileText, Shield } from 'lucide-react';

export default function EditUserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    role: user.role || 'anggota',
    sub_kk_id: user.sub_kk_id || '',
    nidn: user.nidn || '',
    nip: user.nip || '',
    prodi: user.prodi || '',
    coe: user.coe || '',
    jabatan_fungsional: user.jabatan_fungsional || ''
  });

  const [subKks, setSubKks] = useState([]);
  const [isLoadingSubKks, setIsLoadingSubKks] = useState(true);

  useEffect(() => {
    const fetchSubKks = async () => {
      try {
        const response = await api.get('/sub-kks');
        setSubKks(response.data);
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
    onSave(user.id, formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card" style={{ maxWidth: '600px', width: '100%', padding: '0', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)', marginBottom: 0 }}>
          <h3 className="modal-title">Edit Data Pengguna</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ padding: '28px', maxHeight: '80vh', overflowY: 'auto' }}>
          
          {/* Section 1: Identitas Akademik */}
          <div className="form-section-title" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', borderBottom: '1.5px solid var(--border)', paddingBottom: '6px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={15} /> Identitas Akademik
          </div>

          <div className="form-group mb-16">
            <label><User size={14} /> Nama Lengkap</label>
            <input 
              type="text" required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Nama Lengkap"
            />
          </div>

          <div className="form-grid mb-16">
            <div className="form-group">
              <label><Mail size={14} /> Email</label>
              <input 
                type="email" required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="email@example.com"
              />
            </div>
            <div className="form-group">
              <label><Hash size={14} /> NIDN</label>
              <input 
                type="text" required
                value={formData.nidn}
                onChange={e => setFormData({...formData, nidn: e.target.value})}
                placeholder="NIDN"
              />
            </div>
          </div>

          <div className="form-grid mb-16">
            <div className="form-group">
              <label><Shield size={14} /> Role / Hak Akses</label>
              <select 
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
              >
                <option value="ketua_kk">Ketua KK</option>
                <option value="ketua_sub_kk">Ketua Sub-KK</option>
                <option value="anggota">Anggota</option>
              </select>
            </div>
            <div className="form-group">
              <label><Layers size={14} /> Sub-KK</label>
              <select 
                value={formData.sub_kk_id}
                onChange={e => setFormData({...formData, sub_kk_id: e.target.value})}
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

          <div className="form-group mb-24">
            <label><BookOpen size={14} /> Program Studi</label>
            <input 
              type="text" required
              value={formData.prodi}
              onChange={e => setFormData({...formData, prodi: e.target.value})}
              placeholder="Program Studi"
            />
          </div>

          {/* Section 2: Data Profesional */}
          <div className="form-section-title" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', borderBottom: '1.5px solid var(--border)', paddingBottom: '6px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={15} /> Data Profesional
          </div>

          <div className="form-grid mb-16">
            <div className="form-group">
              <label><FileText size={14} /> NIP</label>
              <input 
                type="text"
                value={formData.nip}
                onChange={e => setFormData({...formData, nip: e.target.value})}
                placeholder="NIP"
              />
            </div>
            <div className="form-group">
              <label><User size={14} /> Center of Excellence (CoE)</label>
              <select 
                value={formData.coe}
                onChange={e => setFormData({...formData, coe: e.target.value})}
              >
                <option value="">-- Pilih CoE --</option>
                <option value="INTEREST">INTEREST</option>
                <option value="Moshee">Moshee</option>
                <option value="Circlest">Circlest</option>
              </select>
            </div>
          </div>

          <div className="form-group mb-16">
            <label><Award size={14} /> Jabatan Fungsional</label>
            <select 
              value={formData.jabatan_fungsional}
              onChange={e => setFormData({...formData, jabatan_fungsional: e.target.value})}
            >
              <option value="">-- Pilih Jabatan --</option>
              <option value="NJFA 2">NJFA 2</option>
              <option value="NJFA 3">NJFA 3</option>
              <option value="AA 2">AA 2</option>
              <option value="AA 3">AA 3</option>
              <option value="Lektor 2">Lektor 2</option>
              <option value="Lektor 3">Lektor 3</option>
              <option value="Lektor Kepala">Lektor Kepala</option>
              <option value="Guru Besar">Guru Besar</option>
            </select>
          </div>

          <div className="btn-row" style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
