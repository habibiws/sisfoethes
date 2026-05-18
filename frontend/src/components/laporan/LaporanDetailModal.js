import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { X, FileText, Wallet, Award, Globe, GraduationCap } from 'lucide-react';
import useModalStore from '../../store/modalStore';

export default function LaporanDetailModal({ user, year, onClose }) {
  const { showAlert } = useModalStore();
  const [activeTab, setActiveTab] = useState('publikasi');
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        // Pass year filter if selected on the main page
        const response = await api.get(`/laporan/detail/${user.id}`, {
          params: { tahun: year || '' }
        });
        setDetails(response.data);
      } catch (error) {
        console.error('Gagal memuat rincian capaian:', error);
        showAlert('Gagal memuat rincian capaian dosen.', 'Error', 'error');
        onClose();
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.id) {
      fetchDetails();
    }
  }, [user, year]);

  const tabs = [
    { id: 'publikasi', label: 'Publikasi', count: details?.publikasis?.length || 0, icon: <FileText size={14} /> },
    { id: 'hibah', label: 'Hibah', count: details?.hibahs?.length || 0, icon: <Wallet size={14} /> },
    { id: 'paten', label: 'Paten & HKI', count: details?.patens?.length || 0, icon: <Award size={14} /> },
    { id: 'abdimas', label: 'Abdimas', count: details?.abdimas?.length || 0, icon: <Globe size={14} /> },
    { id: 'pelatihan', label: 'Pelatihan', count: details?.pelatihan_participations?.length || 0, icon: <GraduationCap size={14} /> }
  ];

  const formatRupiah = (num) => {
    if (!num) return '—';
    return 'Rp ' + parseFloat(num).toLocaleString('id-ID');
  };

  const getFormatEnum = (str) => {
    if (!str) return '—';
    return str.replace(/_/g, ' ').toUpperCase();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div 
        className="modal-content card" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '750px', width: '90%', padding: '0', display: 'flex', flexDirection: 'column', maxHeight: '85vh', overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--navy)' }}>Detail Capaian Dosen</h3>
            <div style={{ fontSize: '13px', color: 'var(--text3)', marginTop: '4px', fontWeight: 500 }}>
              <strong>{user.name}</strong> · NIDN: {user.nidn || '—'} · Sub-KK: {user.sub_kk?.name || '—'}
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Loading / Content */}
        {isLoading ? (
          <div style={{ padding: '50px', textAlign: 'center', color: 'var(--text3)', fontWeight: 600 }}>
            Memuat rincian capaian...
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--bg)', overflowX: 'auto' }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '12px 18px',
                    border: 'none',
                    background: activeTab === tab.id ? 'var(--white)' : 'transparent',
                    borderBottom: activeTab === tab.id ? '2px solid var(--navy-text)' : 'none',
                    fontWeight: activeTab === tab.id ? 700 : 500,
                    color: activeTab === tab.id ? 'var(--navy-text)' : 'var(--text3)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.icon}
                  {tab.label}
                  <span style={{ 
                    fontSize: '11px', 
                    background: activeTab === tab.id ? 'var(--navy)' : 'rgba(15, 35, 64, 0.08)', 
                    color: activeTab === tab.id ? 'var(--white)' : 'var(--text3)', 
                    padding: '2px 6px', 
                    borderRadius: '10px',
                    fontWeight: 700
                  }}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Tab Body */}
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1, minHeight: '300px' }}>
              {/* TAB PUBLIKASI */}
              {activeTab === 'publikasi' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {details.publikasis.length === 0 ? (
                    <div style={{ color: 'var(--text3)', textAlign: 'center', padding: '40px' }}>Tidak ada data publikasi untuk periode ini.</div>
                  ) : (
                    details.publikasis.map((pub, idx) => (
                      <div key={pub.id} className="card" style={{ padding: '16px', background: 'var(--bg)' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy)', marginBottom: '6px' }}>{idx + 1}. {pub.judul}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', color: 'var(--text3)' }}>
                          <div><strong>Jurnal/Prosiding:</strong> {pub.nama_jurnal}</div>
                          <div><strong>Tahun Terbit:</strong> {pub.tahun_terbit}</div>
                          <div><strong>Jenis Kategori:</strong> <span className="tag-navy" style={{ background: '#EBF2F9', color: 'var(--navy)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>{getFormatEnum(pub.jenis)}</span></div>
                          <div><strong>Posisi Penulis:</strong> {getFormatEnum(pub.posisi_penulis)}</div>
                        </div>
                        {pub.doi_url && (
                          <div style={{ marginTop: '8px', fontSize: '12px' }}>
                            <strong>DOI / URL:</strong> <a href={pub.doi_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--navy-text)', fontWeight: 600 }}>{pub.doi_url}</a>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB HIBAH */}
              {activeTab === 'hibah' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {details.hibahs.length === 0 ? (
                    <div style={{ color: 'var(--text3)', textAlign: 'center', padding: '40px' }}>Tidak ada data hibah penelitian untuk periode ini.</div>
                  ) : (
                    details.hibahs.map((hib, idx) => (
                      <div key={hib.id} className="card" style={{ padding: '16px', background: 'var(--bg)' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy)', marginBottom: '6px' }}>{idx + 1}. {hib.judul}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', color: 'var(--text3)' }}>
                          <div><strong>Sumber Dana:</strong> {getFormatEnum(hib.sumber_dana)}</div>
                          <div><strong>Posisi:</strong> {getFormatEnum(hib.posisi)}</div>
                          <div><strong>Pemberi Dana:</strong> {hib.nama_pemberi}</div>
                          <div><strong>Tahun:</strong> {hib.tahun}</div>
                          <div style={{ gridColumn: 'span 2', fontSize: '13px', color: '#27AE60', fontWeight: 700, marginTop: '4px' }}>
                            Dana Disetujui: {formatRupiah(hib.jumlah_dana)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB PATEN */}
              {activeTab === 'paten' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {details.patens.length === 0 ? (
                    <div style={{ color: 'var(--text3)', textAlign: 'center', padding: '40px' }}>Tidak ada data paten/HKI untuk periode ini.</div>
                  ) : (
                    details.patens.map((pat, idx) => (
                      <div key={pat.id} className="card" style={{ padding: '16px', background: 'var(--bg)' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy)', marginBottom: '6px' }}>{idx + 1}. {pat.judul}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', color: 'var(--text3)' }}>
                          <div><strong>Jenis HKI:</strong> {getFormatEnum(pat.jenis_hki)}</div>
                          <div><strong>Tahun:</strong> {pat.tahun}</div>
                          <div><strong>Nomor Registrasi:</strong> {pat.nomor_registrasi || '—'}</div>
                          <div><strong>Status:</strong> <span style={{ fontWeight: 700, color: pat.status === 'granted' ? '#27AE60' : 'var(--gold)' }}>{getFormatEnum(pat.status)}</span></div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB ABDIMAS */}
              {activeTab === 'abdimas' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {details.abdimas.length === 0 ? (
                    <div style={{ color: 'var(--text3)', textAlign: 'center', padding: '40px' }}>Tidak ada data pengabdian masyarakat untuk periode ini.</div>
                  ) : (
                    details.abdimas.map((abd, idx) => (
                      <div key={abd.id} className="card" style={{ padding: '16px', background: 'var(--bg)' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy)', marginBottom: '6px' }}>{idx + 1}. {abd.judul}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', color: 'var(--text3)' }}>
                          <div><strong>Skema:</strong> {getFormatEnum(abd.skema)}</div>
                          <div><strong>Posisi:</strong> {getFormatEnum(abd.posisi)}</div>
                          <div><strong>Mitra/Lokasi:</strong> {abd.mitra} {abd.lokasi ? `(${abd.lokasi})` : ''}</div>
                          <div><strong>Tahun:</strong> {abd.tahun}</div>
                          <div style={{ gridColumn: 'span 2', fontSize: '13px', color: '#27AE60', fontWeight: 700, marginTop: '4px' }}>
                            Dana Disetujui: {formatRupiah(abd.jumlah_dana)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB PELATIHAN */}
              {activeTab === 'pelatihan' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {details.pelatihan_participations.length === 0 ? (
                    <div style={{ color: 'var(--text3)', textAlign: 'center', padding: '40px' }}>Tidak ada data partisipasi pelatihan untuk periode ini.</div>
                  ) : (
                    details.pelatihan_participations.map((part, idx) => (
                      <div key={part.id} className="card" style={{ padding: '16px', background: 'var(--bg)' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy)', marginBottom: '6px' }}>
                          {idx + 1}. {part.pelatihan_event?.judul || 'Pelatihan'}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', color: 'var(--text3)' }}>
                          <div><strong>Penyelenggara:</strong> {part.pelatihan_event?.penyelenggara || '—'}</div>
                          <div><strong>Jenis Event:</strong> {getFormatEnum(part.pelatihan_event?.jenis)}</div>
                          <div><strong>Tanggal Pelaksanaan:</strong> {part.pelatihan_event?.tanggal_mulai || '—'} s/d {part.pelatihan_event?.tanggal_selesai || '—'}</div>
                          <div><strong>Status Partisipasi:</strong> <span className="tag-navy" style={{ background: '#EBF2F9', color: 'var(--navy)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>{getFormatEnum(part.status_keikutsertaan)}</span></div>
                        </div>
                        {part.catatan && (
                          <div style={{ marginTop: '8px', fontSize: '12px', background: 'var(--white)', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                            <strong>Catatan:</strong> {part.catatan}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', background: 'var(--bg)' }}>
              <button className="btn btn-ghost" onClick={onClose}>Tutup</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
