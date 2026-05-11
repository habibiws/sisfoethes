import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import useModalStore from '../../store/modalStore';
import useDirtyState from '../../hooks/useDirtyState';

const DEFAULT_FORM_DATA = {
  judul: '',
  sumber_dana: '',
  posisi: '',
  nama_pemberi: '',
  tahun: new Date().getFullYear(),
  jumlah_dana: ''
};

export default function TabHibah() {
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
      const res = await api.get('/hibahs');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching hibah:', err);
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
      sumber_dana: item.sumber_dana,
      posisi: item.posisi,
      nama_pemberi: item.nama_pemberi,
      tahun: item.tahun,
      jumlah_dana: item.jumlah_dana || ''
    };
    setFormData(itemData);
    setIsDirty(false);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    showConfirm('Apakah Anda yakin ingin menghapus capaian ini?', () => {
      api.post(`/hibahs/${id}`, { _method: 'DELETE' })
        .then(() => {
          fetchData();
          showAlert('Data hibah berhasil dihapus.', 'Berhasil', 'success');
        })
        .catch(() => showAlert('Gagal menghapus data.', 'Error', 'error'));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await api.post(`/hibahs/${editingId}`, { ...formData, _method: 'PUT' });
      } else {
        await api.post('/hibahs', formData);
      }
      fetchData();
      setIsDirty(false);
      resetForm();
      showAlert('Data hibah berhasil disimpan.', 'Berhasil', 'success');
    } catch (err) {
      showAlert(err.response?.data?.message || 'Gagal menyimpan data.', 'Error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSumber = (sumber) => {
    const map = {
      'internal': 'Internal Institusi',
      'eksternal_dn': 'Eksternal Dalam Negeri',
      'eksternal_ln': 'Eksternal Luar Negeri'
    };
    return map[sumber] || sumber;
  };

  return (
    <div className="tab-pane animate-fade-in">
      <div className="flex-between mb-16">
        <h3 className="section-title">Daftar Hibah Penelitian</h3>
        {!showForm && (
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>+ Tambah Baru</button>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={handleSafeClose} style={{ zIndex: 10000 }}>
          <div className="modal animate-pop" style={{ maxWidth: '650px', width: '100%', padding: '0', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)', marginBottom: 0 }}>
              <h3 className="modal-title" style={{ margin: 0 }}>{editingId ? '📝 Edit Hibah' : '💰 Tambah Hibah Baru'}</h3>
              <button className="modal-close" onClick={handleSafeClose}>✕</button>
            </div>
          <form onSubmit={handleSubmit} style={{ padding: '28px' }}>
            <div className="form-grid">
              <div className="form-group full">
                <label>Judul Penelitian <span className="req">*</span></label>
                <input type="text" name="judul" required value={formData.judul} onChange={handleChange} placeholder="Judul lengkap penelitian" />
              </div>
              <div className="form-group">
                <label>Sumber Dana <span className="req">*</span></label>
                <select name="sumber_dana" required value={formData.sumber_dana} onChange={handleChange}>
                  <option value="">-- Pilih --</option>
                  <option value="internal">Internal Institusi</option>
                  <option value="eksternal_dn">Eksternal Dalam Negeri</option>
                  <option value="eksternal_ln">Eksternal Luar Negeri</option>
                </select>
              </div>
              <div className="form-group">
                <label>Posisi <span className="req">*</span></label>
                <select name="posisi" required value={formData.posisi} onChange={handleChange}>
                  <option value="">-- Pilih --</option>
                  <option value="ketua">Ketua Peneliti</option>
                  <option value="anggota">Anggota Peneliti</option>
                </select>
              </div>
              <div className="form-group full">
                <label>Nama Pemberi Dana <span className="req">*</span></label>
                <input type="text" name="nama_pemberi" required value={formData.nama_pemberi} onChange={handleChange} placeholder="Contoh: Kemenristekdikti, LPDP, Telkom University" />
              </div>
              <div className="form-group">
                <label>Tahun Pelaksanaan <span className="req">*</span></label>
                <input type="number" name="tahun" required value={formData.tahun} onChange={handleChange} placeholder="2026" />
              </div>
              <div className="form-group">
                <label>Jumlah Dana (Rp)</label>
                <input type="number" name="jumlah_dana" value={formData.jumlah_dana} onChange={handleChange} placeholder="Contoh: 15000000" />
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
          Belum ada data hibah terdaftar.
        </div>
      ) : (
        <div className="entry-list">
          {data.map(item => (
            <div key={item.id} className="entry-item">
              <div className="entry-icon" style={{ background: '#E6F4E4', color: '#2E7D32' }}>💰</div>
              <div className="entry-body">
                <div className="entry-title">{item.judul}</div>
                <div className="entry-meta">
                  <span style={{color:'#2E7D32', fontWeight:600}}>{formatSumber(item.sumber_dana)}</span> · {item.nama_pemberi} · {item.tahun}
                  <div style={{marginTop: '4px'}}>
                    <span style={{background:'var(--bg2)', padding:'2px 8px', borderRadius:'10px', fontSize:'11px', textTransform:'capitalize'}}>{item.posisi}</span>
                    {item.jumlah_dana && (
                      <span style={{background:'#E6F4E4', color:'#2E7D32', padding:'2px 8px', borderRadius:'10px', fontSize:'11px', marginLeft:'8px'}}>
                        Rp {parseInt(item.jumlah_dana).toLocaleString('id-ID')}
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
