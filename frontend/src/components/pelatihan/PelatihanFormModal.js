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
    triwulan: currentTW === 'all' ? 1 : (currentTW || 1),
    tahun: new Date().getFullYear(),
    estimasi_biaya: '',
    keterangan: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          ...initialData,
          estimasi_biaya: initialData.estimasi_biaya || '',
          keterangan: initialData.keterangan || ''
        });
      } else {
        setFormData({
          judul: '',
          penyelenggara: '',
          jenis: 'workshop',
          topik: '',
          tanggal_mulai: '',
          tanggal_selesai: '',
          triwulan: currentTW === 'all' ? 1 : (currentTW || 1),
          tahun: new Date().getFullYear(),
          estimasi_biaya: '',
          keterangan: ''
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setIsDirty(false);
  };

  if (!isOpen) return null;

  return (
    <div className="card animate-fade-in" style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
        <h3 className="section-title" style={{ margin: 0 }}>
          {initialData ? 'Edit Event Pelatihan' : 'Tambah Event Baru'}
        </h3>
        <button 
          onClick={(e) => { e.stopPropagation(); handleSafeClose(); }} 
          style={{ fontSize: '18px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)' }} 
          type="button"
        >
          ✕
        </button>
      </div>
      
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
              min={formData.tanggal_mulai}
              value={formData.tanggal_selesai}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-grid mb-20">
          <div className="form-group">
            <label>Estimasi Biaya</label>
            <input 
              type="number"
              name="estimasi_biaya"
              value={formData.estimasi_biaya}
              onChange={handleChange}
              placeholder="Masukkan nominal"
            />
          </div>
        </div>

        <div className="form-group mb-20">
          <label>Keterangan / Informasi Tambahan</label>
          <textarea 
            name="keterangan"
            value={formData.keterangan}
            onChange={handleChange}
            rows={4}
            placeholder="Catatan atau informasi penting terkait event ini (opsional)"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div className="btn-row mt-24" style={{ justifyContent: 'flex-end', display: 'flex', gap: '12px' }}>
          <button type="button" className="btn btn-ghost" onClick={handleSafeClose}>Batal</button>
          <button type="submit" className="btn btn-primary" style={{ minWidth: '160px' }}>
            {initialData ? 'Simpan Perubahan' : 'Daftarkan Event'}
          </button>
        </div>
      </form>
    </div>
  );
}
