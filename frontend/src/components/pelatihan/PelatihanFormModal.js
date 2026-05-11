import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import useModalStore from '../../store/modalStore';

export default function PelatihanFormModal({ isOpen, onClose, onSave, initialData, currentTW }) {
  const { showConfirm } = useModalStore();
  const [formData, setFormData] = useState({
    judul: '',
    penyelenggara: '',
    jenis: 'workshop',
    topik: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    triwulan: currentTW || 1,
    tahun: new Date().getFullYear(),
    status: 'direncanakan',
    estimasi_biaya: ''
  });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        estimasi_biaya: initialData.estimasi_biaya || ''
      });
    } else {
      setFormData(prev => ({ ...prev, triwulan: currentTW }));
    }
  }, [initialData, currentTW, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleClose = () => {
    if (isDirty) {
      showConfirm(
        'Ada perubahan yang belum disimpan. Yakin ingin keluar?',
        'Konfirmasi Keluar',
        () => {
          setIsDirty(false);
          onClose();
        }
      );
    } else {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setIsDirty(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 10000 }}>
      <div className="modal animate-pop" style={{ width: '650px', maxWidth: '95vw', padding: '0' }}>
        <div className="modal-header" style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)', marginBottom: 0 }}>
          <div className="modal-title">
            {initialData ? '📝 Edit Event Pelatihan' : '📅 Tambah Event Baru'}
          </div>
          <button className="modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ padding: '28px' }}>
          <div className="form-group mb-16">
            <label>Judul Event <span className="req">*</span></label>
            <input 
              name="judul"
              value={formData.judul}
              onChange={handleChange}
              required
              placeholder="Contoh: Workshop Cloud Computing"
            />
          </div>

          <div className="form-grid mb-16">
            <div className="form-group">
              <label>Penyelenggara <span className="req">*</span></label>
              <input 
                name="penyelenggara"
                value={formData.penyelenggara}
                onChange={handleChange}
                required
                placeholder="Nama Institusi/Vendor"
              />
            </div>
            <div className="form-group">
              <label>Jenis Event <span className="req">*</span></label>
              <select name="jenis" value={formData.jenis} onChange={handleChange}>
                <option value="workshop">Workshop</option>
                <option value="sertifikasi">Sertifikasi</option>
                <option value="pelatihan">Pelatihan</option>
                <option value="webinar">Webinar</option>
                <option value="seminar">Seminar</option>
              </select>
            </div>
          </div>

          <div className="form-group mb-16">
            <label>Topik / Bidang</label>
            <input 
              name="topik"
              value={formData.topik}
              onChange={handleChange}
              placeholder="Contoh: Artificial Intelligence"
            />
          </div>

          <div className="form-grid mb-16">
            <div className="form-group">
              <label>Tanggal Mulai <span className="req">*</span></label>
              <input 
                type="date"
                name="tanggal_mulai"
                value={formData.tanggal_mulai}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Tanggal Selesai</label>
              <input 
                type="date"
                name="tanggal_selesai"
                value={formData.tanggal_selesai}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-grid mb-16">
            <div className="form-group">
              <label>Triwulan <span className="required">*</span></label>
              <select name="triwulan" value={formData.triwulan} onChange={handleChange}>
                <option value="1">TW 1 (Jan - Mar)</option>
                <option value="2">TW 2 (Apr - Jun)</option>
                <option value="3">TW 3 (Jul - Sep)</option>
                <option value="4">TW 4 (Okt - Des)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tahun <span className="required">*</span></label>
              <input 
                type="number"
                name="tahun"
                value={formData.tahun}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-grid mb-16">
            <div className="form-group">
              <label>Status <span className="required">*</span></label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="direncanakan">Direncanakan</option>
                <option value="terlaksana">Terlaksana</option>
                <option value="dibatalkan">Dibatalkan</option>
              </select>
            </div>
            <div className="form-group">
              <label>Estimasi Biaya (Juta Rp)</label>
              <input 
                type="number"
                step="0.1"
                name="estimasi_biaya"
                value={formData.estimasi_biaya}
                onChange={handleChange}
                placeholder="Contoh: 12.5"
              />
            </div>
          </div>

          <div className="btn-row" style={{ marginTop: '24px' }}>
            <button type="button" className="btn btn-ghost" onClick={handleClose}>Batal</button>
            <button type="submit" className="btn btn-primary">
              {initialData ? 'Simpan Perubahan' : 'Tambah Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
