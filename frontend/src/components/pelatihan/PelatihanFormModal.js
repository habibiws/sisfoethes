import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import useDirtyState from '../../hooks/useDirtyState';

export default function PelatihanFormModal({ isOpen, onClose, onSave, initialData, currentTW }) {
  const { isDirty, setIsDirty, handleSafeClose } = useDirtyState(onClose);
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
    if (isOpen) {
      if (initialData) {
        setFormData({
          ...initialData,
          estimasi_biaya: initialData.estimasi_biaya || ''
        });
      } else {
        setFormData({
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
      }
      setIsDirty(false);
    }
  }, [initialData, currentTW, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    // Auto-calculate TW and Year if date changes (Back-end fields)
    if (name === 'tanggal_mulai' && value) {
      const date = new Date(value);
      updatedData.triwulan = Math.floor(date.getMonth() / 3) + 1;
      updatedData.tahun = date.getFullYear();
    }

    setFormData(updatedData);
    setIsDirty(true);
  };

  const handleOverlayClick = (e) => {
    // Check if the click was directly on the modal-overlay backdrop
    if (e.target.classList.contains('modal-overlay')) {
      handleSafeClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setIsDirty(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 10000 }} onClick={handleOverlayClick}>
      <div className="modal animate-pop" style={{ 
        width: '650px', 
        maxWidth: '95vw', 
        padding: '0', 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column',
        maxHeight: '90vh'
      }}>
        <div className="modal-header" style={{ 
          padding: '24px 28px', 
          borderBottom: '1px solid var(--border)', 
          marginBottom: 0,
          flexShrink: 0
        }}>
          <div className="modal-title">
            {initialData ? '📝 Edit Event Pelatihan' : '📅 Tambah Event Baru'}
          </div>
          <button className="modal-close" onClick={(e) => { e.stopPropagation(); handleSafeClose(); }} type="button">
            <X size={20} />
          </button>
        </div>
        
        <div style={{ overflowY: 'auto', flex: 1, padding: '28px' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-20">
              <label>Judul Event <span className="req">*</span></label>
              <input 
                name="judul"
                value={formData.judul}
                onChange={handleChange}
                required
                placeholder="Contoh: Workshop Artificial Intelligence"
              />
            </div>

            <div className="form-grid mb-20">
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

            <div className="form-group mb-20">
              <label>Topik / Bidang</label>
              <input 
                name="topik"
                value={formData.topik}
                onChange={handleChange}
                placeholder="Contoh: Deep Learning, Cloud, IoT"
              />
            </div>

            <div className="form-grid mb-20">
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

            <div className="form-grid mb-10">
              {initialData ? (
                <div className="form-group">
                  <label>Status Pelaksanaan <span className="req">*</span></label>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="direncanakan">🟡 Direncanakan</option>
                    <option value="terlaksana">✅ Terlaksana</option>
                    <option value="dibatalkan">❌ Dibatalkan</option>
                  </select>
                </div>
              ) : (
                <div style={{ display: 'none' }}></div>
              )}
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

            <div className="btn-row" style={{ marginTop: '30px' }}>
              <button type="button" className="btn btn-ghost" onClick={handleSafeClose}>Batal</button>
              <button type="submit" className="btn btn-primary" style={{ minWidth: '160px' }}>
                {initialData ? 'Simpan Perubahan' : 'Daftarkan Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
