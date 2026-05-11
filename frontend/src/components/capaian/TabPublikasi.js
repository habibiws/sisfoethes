import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import useModalStore from '../../store/modalStore';
import useDirtyState from '../../hooks/useDirtyState';

const DEFAULT_FORM_DATA = {
  judul: '',
  jenis: '',
  posisi_penulis: '',
  nama_jurnal: '',
  tahun_terbit: new Date().getFullYear(),
  doi_url: ''
};

export default function TabPublikasi() {
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
      const res = await api.get('/publikasis');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching publikasi:', err);
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
      jenis: item.jenis,
      posisi_penulis: item.posisi_penulis,
      nama_jurnal: item.nama_jurnal,
      tahun_terbit: item.tahun_terbit,
      doi_url: item.doi_url || ''
    };
    setFormData(itemData);
    setIsDirty(false); // Reset dirty on edit start
    setShowForm(true);
  };

  const handleDelete = (id) => {
    showConfirm('Apakah Anda yakin ingin menghapus capaian ini?', () => {
      api.post(`/publikasis/${id}`, { _method: 'DELETE' })
        .then(() => {
          fetchData();
          showAlert('Data publikasi berhasil dihapus.', 'Berhasil', 'success');
        })
        .catch(() => showAlert('Gagal menghapus data.', 'Error', 'error'));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await api.post(`/publikasis/${editingId}`, { ...formData, _method: 'PUT' });
      } else {
        await api.post('/publikasis', formData);
      }
      fetchData();
      setIsDirty(false);
      resetForm();
      showAlert('Data publikasi berhasil disimpan.', 'Berhasil', 'success');
    } catch (err) {
      showAlert(err.response?.data?.message || 'Gagal menyimpan data.', 'Error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatJenis = (jenis) => {
    const map = {
      'jurnal_internasional_scopus': 'Jurnal Internasional Scopus',
      'jurnal_nasional_sinta': 'Jurnal Nasional SINTA',
      'jurnal_nasional_non_sinta': 'Jurnal Nasional Non Index SINTA',
      'prosiding_internasional_scopus': 'Prosiding Internasional Index Scopus',
      'prosiding_nasional': 'Prosiding Nasional'
    };
    return map[jenis] || jenis;
  };

  const formatPosisi = (posisi) => {
    const map = {
      'penulis_pertama': 'Penulis Pertama',
      'corresponding': 'Corresponding Author',
      'penulis_lainnya': 'Penulis Lainnya'
    };
    return map[posisi] || posisi;
  };

  return (
    <div className="tab-pane animate-fade-in">
      <div className="flex-between mb-16">
        <h3 className="section-title">Daftar Publikasi</h3>
        {!showForm && (
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>+ Tambah Baru</button>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={handleSafeClose} style={{ zIndex: 10000 }}>
          <div className="modal animate-pop" style={{ maxWidth: '650px', width: '100%', padding: '0', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)', marginBottom: 0 }}>
              <h3 className="modal-title" style={{ margin: 0 }}>{editingId ? '📝 Edit Publikasi' : '📄 Tambah Publikasi Baru'}</h3>
              <button className="modal-close" onClick={handleSafeClose}>✕</button>
            </div>
          <form onSubmit={handleSubmit} style={{ padding: '28px' }}>
            <div className="form-grid">
              <div className="form-group full">
                <label>Judul Artikel <span className="req">*</span></label>
                <input type="text" required value={formData.judul} onChange={handleChange} placeholder="Judul lengkap artikel" />
              </div>
              <div className="form-group">
                <label>Jenis Publikasi <span className="req">*</span></label>
                <select required value={formData.jenis} onChange={handleChange} name="jenis">
                  <option value="">-- Pilih --</option>
                  <option value="jurnal_internasional_scopus">Jurnal Internasional Scopus</option>
                  <option value="jurnal_nasional_sinta">Jurnal Nasional SINTA</option>
                  <option value="jurnal_nasional_non_sinta">Jurnal Nasional Non Index SINTA</option>
                  <option value="prosiding_internasional_scopus">Prosiding Internasional Index Scopus</option>
                  <option value="prosiding_nasional">Prosiding Nasional</option>
                </select>
              </div>
              <div className="form-group">
                <label>Posisi Penulis <span className="req">*</span></label>
                <select required value={formData.posisi_penulis} onChange={handleChange} name="posisi_penulis">
                  <option value="">-- Pilih --</option>
                  <option value="penulis_pertama">Penulis Pertama</option>
                  <option value="corresponding">Corresponding Author</option>
                  <option value="penulis_lainnya">Penulis Lainnya</option>
                </select>
              </div>
              <div className="form-group full">
                <label>Nama Jurnal / Prosiding <span className="req">*</span></label>
                <input type="text" required value={formData.nama_jurnal} onChange={handleChange} name="nama_jurnal" placeholder="Nama jurnal atau prosiding" />
              </div>
              <div className="form-group">
                <label>Tahun Terbit <span className="req">*</span></label>
                <input type="number" required value={formData.tahun_terbit} onChange={handleChange} name="tahun_terbit" placeholder="2026" />
              </div>
              <div className="form-group">
                <label>DOI / URL</label>
                <input type="text" value={formData.doi_url} onChange={handleChange} name="doi_url" placeholder="https://doi.org/..." />
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
          Belum ada data publikasi terdaftar.
        </div>
      ) : (
        <div className="entry-list">
          {data.map(item => (
            <div key={item.id} className="entry-item">
              <div className="entry-icon" style={{ background: '#E4EAF4', color: 'var(--navy)' }}>📄</div>
              <div className="entry-body">
                <div className="entry-title">{item.judul}</div>
                <div className="entry-meta">
                  <span style={{color:'var(--navy)', fontWeight:600}}>{formatJenis(item.jenis)}</span> · {item.nama_jurnal} · {item.tahun_terbit}
                  <div style={{marginTop: '4px'}}>
                    <span style={{background:'var(--bg2)', padding:'2px 8px', borderRadius:'10px', fontSize:'11px'}}>{formatPosisi(item.posisi_penulis)}</span>
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
