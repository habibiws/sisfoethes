import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import useModalStore from '../../store/modalStore';
import useDirtyState from '../../hooks/useDirtyState';
import { Info } from 'lucide-react';

const DEFAULT_FORM_DATA = {
  judul: '',
  jenis_hki: '',
  nomor_registrasi: '',
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
  const [expandedId, setExpandedId] = useState(null);

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
      'merek': 'Merek',
      'dtlst': 'Desain Tata Letak Sirkuit Terpadu (DTLST)',
      'rahasia_dagang': 'Rahasia Dagang'
    };
    return map[jenis] || jenis;
  };

  return (
    <div className="tab-pane animate-fade-in">
      {showForm ? (
        <div className="card animate-fade-in" style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
            <h3 className="section-title" style={{ margin: 0 }}>{editingId ? 'Edit HKI' : 'Tambah HKI Baru'}</h3>
            <button className="modal-close" onClick={handleSafeClose} style={{ fontSize: '18px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)' }}>✕</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group full">
                <label>Judul Karya    </label>
                <input type="text" name="judul" required value={formData.judul} onChange={handleChange} placeholder="Judul karya" />
              </div>
              <div className="form-group">
                <label>Jenis HKI    </label>
                <select name="jenis_hki" required value={formData.jenis_hki} onChange={handleChange}>
                  <option value="">-- Pilih --</option>
                  <option value="paten">Paten</option>
                  <option value="paten_sederhana">Paten Sederhana</option>
                  <option value="hak_cipta">Hak Cipta</option>
                  <option value="desain_industri">Desain Industri</option>
                  <option value="merek">Merek</option>
                  <option value="dtlst">Desain Tata Letak Sirkuit Terpadu (DTLST)</option>
                  <option value="rahasia_dagang">Rahasia Dagang</option>
                </select>
              </div>
              <div className="form-group">
                <label>Nomor Sertifikat</label>
                <input type="text" name="nomor_registrasi" value={formData.nomor_registrasi} onChange={handleChange} placeholder="Nomor sertifikat" />
              </div>
              <div className="form-group">
                <label>Tahun Terbit    </label>
                <input type="number" name="tahun" required value={formData.tahun} onChange={handleChange} placeholder="2026" />
              </div>
            </div>
            <div className="btn-row mt-24" style={{ justifyContent: 'flex-end', display: 'flex', gap: '12px' }}>
              <button type="button" className="btn btn-ghost" onClick={handleSafeClose} disabled={isSubmitting}>Batal</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="flex-between mb-16">
            <h3 className="section-title">Paten & HKI</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>+ Tambah Baru</button>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>Memuat data...</div>
          ) : data.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>
              Belum ada data Paten/HKI terdaftar.
            </div>
          ) : (
            <div className="entry-list">
              {data.map(item => (
                <div key={item.id} className="entry-item" style={{ flexDirection: 'column', alignItems: 'stretch', cursor: 'pointer' }} onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div className="entry-body">
                      <div className="entry-title">{item.judul}</div>
                      <div className="entry-meta">
                        <span style={{ color: '#E65100', fontWeight: 600 }}>{formatJenis(item.jenis_hki)}</span> · {item.tahun}
                        <div style={{ marginTop: '4px' }}>
                          {item.nomor_registrasi && (
                            <span style={{ color: 'var(--text3)', fontSize: '11px' }}>
                              No: {item.nomor_registrasi}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          color: expandedId === item.id ? 'var(--navy)' : 'var(--text3)',
                          cursor: 'pointer',
                          padding: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '50%',
                          transition: 'all 0.2s',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedId(expandedId === item.id ? null : item.id);
                        }}
                        title="Detail Informasi"
                      >
                        <Info size={18} />
                      </button>
                      <div className="entry-actions" onClick={e => e.stopPropagation()}>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(item)}>Edit</button>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={() => handleDelete(item.id)}>Hapus</button>
                      </div>
                    </div>
                  </div>

                  {expandedId === item.id && (
                    <div className="entry-detail" onClick={e => e.stopPropagation()} style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '2px' }}>Judul Karya</div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy-text)' }}>{item.judul}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '2px' }}>Jenis HKI</div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy-text)' }}>{formatJenis(item.jenis_hki)}</div>
                        </div>
                        {item.nomor_registrasi && (
                          <div>
                            <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '2px' }}>Nomor Sertifikat</div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy-text)' }}>{item.nomor_registrasi}</div>
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '2px' }}>Tahun Terbit</div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy-text)' }}>{item.tahun}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
