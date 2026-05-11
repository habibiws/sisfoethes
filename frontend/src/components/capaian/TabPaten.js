import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import useModalStore from '../../store/modalStore';
import useDirtyState from '../../hooks/useDirtyState';

const DEFAULT_FORM_DATA = {
  judul: '',
  jenis_hki: '',
  nomor_registrasi: '',
  status: '',
  tahun: new Date().getFullYear(),
};

export default function TabPaten() {
  const { showAlert, showConfirm } = useModalStore();
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  const resetForm = () => {
    setEditingId(null);
    setFormData(DEFAULT_FORM_DATA);
    setShowForm(false);
  };

  // Standardized Dirty State
  const { isDirty, setIsDirty, handleSafeClose } = useDirtyState(resetForm);

  const fetchData = async () => {
    try {
      const res = await api.get('/patens');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching paten:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    const itemData = {
      judul: item.judul,
      jenis_hki: item.jenis_hki,
      nomor_registrasi: item.nomor_registrasi || '',
      status: item.status,
      tahun: item.tahun,
    };
    setFormData(itemData);
    setIsDirty(false);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    showConfirm('Apakah Anda yakin ingin menghapus capaian ini?', () => {
      api.post(`/patens/${id}`, { _method: 'DELETE' })
        .then(() => {
          fetchData();
          showAlert('Data Paten/HKI berhasil dihapus.', 'Berhasil', 'success');
        })
        .catch(() => showAlert('Gagal menghapus data.', 'Error', 'error'));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await api.post(`/patens/${editingId}`, { ...formData, _method: 'PUT' });
      } else {
        await api.post('/patens', formData);
      }
      fetchData();
      setIsDirty(false);
      resetForm();
      showAlert('Data Paten/HKI berhasil disimpan.', 'Berhasil', 'success');
    } catch (err) {
      showAlert(err.response?.data?.message || 'Gagal menyimpan data.', 'Error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatJenis = (jenis) => {
    const map = {
      'paten': 'Paten',
      'paten_sederhana': 'Paten Sederhana',
      'hak_cipta': 'Hak Cipta',
      'desain_industri': 'Desain Industri',
      'merek': 'Merek'
    };
    return map[jenis] || jenis;
  };

  const formatStatus = (status) => {
    const map = {
      'terdaftar': 'Terdaftar',
      'granted': 'Granted',
      'dalam_proses': 'Dalam Proses'
    };
    return map[status] || status;
  };

  return (
    <div className="tab-pane animate-fade-in">
      <div className="flex-between mb-16">
        <h3 className="section-title">Paten & HKI</h3>
        {!showForm && (
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>+ Tambah Baru</button>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={handleSafeClose} style={{ zIndex: 10000 }}>
          <div className="modal animate-pop" style={{ maxWidth: '650px', width: '100%', padding: '0', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)', marginBottom: 0 }}>
              <h3 className="modal-title" style={{ margin: 0 }}>{editingId ? '📝 Edit HKI' : '🎖️ Tambah HKI Baru'}</h3>
              <button className="modal-close" onClick={handleSafeClose}>✕</button>
            </div>
          <form onSubmit={handleSubmit} style={{ padding: '28px' }}>
            <div className="form-grid">
              <div className="form-group full">
                <label>Judul Invensi / Karya <span className="req">*</span></label>
                <input type="text" name="judul" required value={formData.judul} onChange={handleChange} placeholder="Judul lengkap HKI" />
              </div>
              <div className="form-group">
                <label>Jenis HKI <span className="req">*</span></label>
                <select name="jenis_hki" required value={formData.jenis_hki} onChange={handleChange}>
                  <option value="">-- Pilih --</option>
                  <option value="paten">Paten</option>
                  <option value="paten_sederhana">Paten Sederhana</option>
                  <option value="hak_cipta">Hak Cipta</option>
                  <option value="desain_industri">Desain Industri</option>
                  <option value="merek">Merek</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status <span className="req">*</span></label>
                <select name="status" required value={formData.status} onChange={handleChange}>
                  <option value="">-- Pilih --</option>
                  <option value="dalam_proses">Dalam Proses</option>
                  <option value="terdaftar">Terdaftar</option>
                  <option value="granted">Granted</option>
                </select>
              </div>
              <div className="form-group">
                <label>Nomor Registrasi / Sertifikat</label>
                <input type="text" name="nomor_registrasi" value={formData.nomor_registrasi} onChange={handleChange} placeholder="Opsional jika masih diproses" />
              </div>
              <div className="form-group">
                <label>Tahun Pengajuan / Terbit <span className="req">*</span></label>
                <input type="number" name="tahun" required value={formData.tahun} onChange={handleChange} placeholder="2026" />
              </div>
            </div>
            <div className="btn-row mt-20" style={{ justifyContent: 'flex-end', display: 'flex', gap: '12px' }}>
              <button type="button" className="btn btn-ghost" onClick={handleSafeClose} disabled={isSubmitting}>Batal</button>
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
          Belum ada data Paten/HKI terdaftar.
        </div>
      ) : (
        <div className="entry-list">
          {data.map(item => (
            <div key={item.id} className="entry-item">
              <div className="entry-icon" style={{ background: '#FFF3E0', color: '#E65100' }}>🏅</div>
              <div className="entry-body">
                <div className="entry-title">{item.judul}</div>
                <div className="entry-meta">
                  <span style={{color:'#E65100', fontWeight:600}}>{formatJenis(item.jenis_hki)}</span> · {item.tahun}
                  <div style={{marginTop: '4px'}}>
                    <span style={{background:'var(--bg2)', padding:'2px 8px', borderRadius:'10px', fontSize:'11px'}}>{formatStatus(item.status)}</span>
                    {item.nomor_registrasi && (
                      <span style={{color:'var(--text3)', fontSize:'11px', marginLeft:'8px'}}>
                        No: {item.nomor_registrasi}
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
