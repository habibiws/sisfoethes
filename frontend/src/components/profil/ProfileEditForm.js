import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { User, Hash, BookOpen, Layers, Award, FileText, Briefcase } from 'lucide-react';

export default function ProfileEditForm({ formData, setFormData, onSave, onCancel, isSaving, userRole }) {
  const canEditSubKk = userRole === 'ketua_kk' || userRole === 'admin';
  const [subKks, setSubKks] = useState([]);

  useEffect(() => {
    const fetchSubKks = async () => {
      try {
        const response = await api.get('/sub-kks');
        setSubKks(response.data);
      } catch (err) {
        console.error('Gagal mengambil daftar Sub-KK:', err);
      }
    };
    fetchSubKks();
  }, []);

  return (
    <form onSubmit={onSave} className="profile-edit-container">

      {/* Section 1: Identitas Akademik */}
      <div className="profile-card">
        <div className="profile-section-title">
          <BookOpen size={16} /> Identitas Akademik
        </div>

        <div className="form-group mb-16">
          <label><User size={15} /> Nama Lengkap</label>
          <input
            type="text" required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nama Lengkap beserta gelar"
          />
        </div>

        <div className="form-grid mb-16">
          <div className="form-group">
            <label><Hash size={15} /> NIDN</label>
            <input
              type="text" required
              value={formData.nidn}
              onChange={e => setFormData({ ...formData, nidn: e.target.value })}
              placeholder="NIDN"
            />
          </div>
          <div className="form-group">
            <label><Briefcase size={15} /> Program Studi</label>
            <select
              required
              value={formData.prodi}
              onChange={e => setFormData({ ...formData, prodi: e.target.value })}
            >
              <option value="">-- Pilih Program Studi --</option>
              <option value="Teknik Elektro">Teknik Elektro</option>
              <option value="Teknik Komputer">Teknik Komputer</option>
              <option value="Teknik Telekomunikasi">Teknik Telekomunikasi</option>
            </select>
          </div>
        </div>

        <div className="form-group mb-16">
          <label><Layers size={15} /> Sub-Kelompok Keahlian</label>
          {canEditSubKk ? (
            <select
              value={formData.sub_kk_id}
              onChange={e => setFormData({ ...formData, sub_kk_id: e.target.value })}
            >
              <option value="">-- Pilih Sub-KK --</option>
              {subKks.map(sub => (
                <option key={sub.id} value={sub.id}>
                  {sub.code} — {sub.name}
                </option>
              ))}
            </select>
          ) : (
            <span style={{ display: 'block', padding: '10px 0', fontSize: '14px', fontWeight: 600, color: 'var(--navy-text)' }}>
              {formData.sub_kk_name || ''}
            </span>
          )}
        </div>
      </div>

      {/* Section 2: Data Profesional */}
      <div className="profile-card">
        <div className="profile-section-title">
          <Award size={16} /> Data Profesional
        </div>

        <div className="form-grid mb-16">
          <div className="form-group">
            <label><FileText size={15} /> NIP</label>
            <input
              type="text"
              value={formData.nip || ''}
              onChange={e => setFormData({ ...formData, nip: e.target.value })}
              placeholder="NIP"
            />
          </div>
          <div className="form-group">
            <label><User size={15} /> Center of Excellence (CoE)</label>
            <select
              value={formData.coe || ''}
              onChange={e => setFormData({ ...formData, coe: e.target.value })}
            >
              <option value="">-- Pilih CoE --</option>
              <option value="INTEREST">INTEREST</option>
              <option value="Moshee">Moshee</option>
              <option value="Circlest">Circlest</option>
            </select>
          </div>
        </div>

        <div className="form-group mb-16">
          <label><Award size={15} /> Jabatan Fungsional</label>
          <select
            value={formData.jabatan_fungsional || ''}
            onChange={e => setFormData({ ...formData, jabatan_fungsional: e.target.value })}
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
      </div>

      <div className="btn-row" style={{ marginTop: '16px', marginBottom: '16px', borderTop: 'none', paddingTop: 0 }}>
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={isSaving}>
          Batal
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSaving}>
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </form>
  );
}
