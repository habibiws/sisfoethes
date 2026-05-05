import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import useModalStore from '../../store/modalStore';

const DEFAULT_FORM_DATA = {
  judul: '',
  skema: '',
  posisi: '',
  mitra: '',
  lokasi: '',
  tahun: new Date().getFullYear(),
  jumlah_dana: ''
};

export default function TabAbdimas() {
  const { showAlert, showConfirm } = useModalStore();
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [initialFormData, setInitialFormData] = useState(DEFAULT_FORM_DATA);

  const fetchData = async () => {
    try {
      const res = await api.get('/abdimas');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching abdimas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData(DEFAULT_FORM_DATA);
    setInitialFormData(DEFAULT_FORM_DATA);
    setShowForm(false);
  };

  const handleCloseForm = () => {
    const isDirty = JSON.stringify(formData) !== JSON.stringify(initialFormData);
    if (isDirty) {
      showConfirm('Perubahan Anda belum disimpan. Yakin ingin menutup?', resetForm, 'Buang Perubahan?');
    } else {
      resetForm();
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    const itemData = {
      judul: item.judul,
      skema: item.skema,
      posisi: item.posisi,
      mitra: item.mitra,
      lokasi: item.lokasi || '',
      tahun: item.tahun,
      jumlah_dana: item.jumlah_dana || ''
    };
    setFormData(itemData);
    setInitialFormData(itemData);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    showConfirm('Apakah Anda yakin ingin menghapus capaian ini?', async () => {
      try {
        await api.post(`/abdimas/${id}`, { _method: 'DELETE' });
        fetchData();
        showAlert('Data Abdimas berhasil dihapus.', 'Berhasil', 'success');
      } catch (err) {
        showAlert('Gagal menghapus data.', 'Error', 'error');
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await api.post(`/abdimas/${editingId}`, { ...formData, _method: 'PUT' });
      } else {
        await api.post('/abdimas', formData);
      }
      fetchData();
      resetForm();
      showAlert('Data Abdimas berhasil disimpan.', 'Berhasil', 'success');
    } catch (err) {
      showAlert(err.response?.data?.message || 'Gagal menyimpan data.', 'Error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSkema = (skema) => {
    const map = {
      'mandiri': 'Mandiri',
      'pendanaan_internal': 'Pendanaan Internal',
      'pendanaan_eksternal': 'Pendanaan Eksternal'
    };
    return map[skema] || skema;
  };

  return (
    <div className="tab-pane animate-fade-in">
      <div className="flex-between mb-16">
        <h3 className="section-title">Pengabdian Masyarakat</h3>
        {!showForm && (
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>+ Tambah Baru</button>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={handleCloseForm} style={{ zIndex: 50 }}>
          <div className="modal-content animate-pop" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', padding: '24px' }}>
            <div className="flex-between mb-16">
              <h3 className="section-title" style={{ margin: 0 }}>{editingId ? 'Edit Abdimas' : 'Tambah Abdimas Baru'}</h3>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={handleCloseForm}>✕</button>
            </div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group full">
                <label>Judul Kegiatan <span className="req">*</span></label>
                <input type="text" required value={formData.judul} onChange={e => setFormData({...formData, judul: e.target.value})} placeholder="Judul lengkap abdimas" />
              </div>
              <div className="form-group">
                <label>Skema <span className="req">*</span></label>
                <select required value={formData.skema} onChange={e => setFormData({...formData, skema: e.target.value})}>
                  <option value="">-- Pilih --</option>
                  <option value="mandiri">Mandiri</option>
                  <option value="pendanaan_internal">Pendanaan Internal</option>
                  <option value="pendanaan_eksternal">Pendanaan Eksternal</option>
                </select>
              </div>
              <div className="form-group">
                <label>Posisi <span className="req">*</span></label>
                <select required value={formData.posisi} onChange={e => setFormData({...formData, posisi: e.target.value})}>
                  <option value="">-- Pilih --</option>
                  <option value="ketua">Ketua</option>
                  <option value="anggota">Anggota</option>
                </select>
              </div>
              <div className="form-group full">
                <label>Mitra Sasaran <span className="req">*</span></label>
                <input type="text" required value={formData.mitra} onChange={e => setFormData({...formData, mitra: e.target.value})} placeholder="Contoh: Desa Suka Maju, UMKM XYZ" />
              </div>
              <div className="form-group">
                <label>Lokasi Kegiatan</label>
                <input type="text" value={formData.lokasi} onChange={e => setFormData({...formData, lokasi: e.target.value})} placeholder="Contoh: Kab. Bandung" />
              </div>
              <div className="form-group">
                <label>Tahun Pelaksanaan <span className="req">*</span></label>
                <input type="number" required value={formData.tahun} onChange={e => setFormData({...formData, tahun: parseInt(e.target.value) || ''})} placeholder="2026" />
              </div>
              <div className="form-group">
                <label>Jumlah Dana (Rp)</label>
                <input type="number" value={formData.jumlah_dana} onChange={e => setFormData({...formData, jumlah_dana: e.target.value})} placeholder="Opsional jika tidak ada" />
              </div>
            </div>
            <div className="btn-row mt-20" style={{ justifyContent: 'flex-end', display: 'flex', gap: '12px' }}>
              <button type="button" className="btn btn-ghost" onClick={handleCloseForm} disabled={isSubmitting}>Batal</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>Memuat data...</div>
      ) : data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>
          Belum ada data Abdimas terdaftar.
        </div>
      ) : (
        <div className="entry-list">
          {data.map(item => (
            <div key={item.id} className="entry-item">
              <div className="entry-icon" style={{ background: '#FCE4EC', color: '#C2185B' }}>🤝</div>
              <div className="entry-body">
                <div className="entry-title">{item.judul}</div>
                <div className="entry-meta">
                  <span style={{color:'#C2185B', fontWeight:600}}>{formatSkema(item.skema)}</span> · Mitra: {item.mitra} · {item.tahun}
                  <div style={{marginTop: '4px'}}>
                    <span style={{background:'var(--bg2)', padding:'2px 8px', borderRadius:'10px', fontSize:'11px', textTransform:'capitalize'}}>{item.posisi}</span>
                    {item.lokasi && (
                      <span style={{color:'var(--text3)', fontSize:'11px', marginLeft:'8px'}}>
                        📍 {item.lokasi}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="entry-actions">
                <button className="btn btn-ghost btn-icon" onClick={() => handleEdit(item)}>✏️</button>
                <button className="btn btn-ghost btn-icon" style={{ color: 'var(--red)' }} onClick={() => handleDelete(item.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
