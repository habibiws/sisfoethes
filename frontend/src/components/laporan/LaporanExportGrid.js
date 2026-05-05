import React from 'react';

const EXPORT_OPTIONS = [
  { icon: '📊', title: 'Laporan Capaian KK', sub: 'Rekap lengkap per semester', type: 'PDF', bg: '#EBF2F9' },
  { icon: '📋', title: 'Data Publikasi', sub: 'Semua publikasi anggota', type: 'Excel', bg: '#E8F5EA' },
  { icon: '🏅', title: 'Rekap Paten & HKI', sub: 'Daftar lengkap + sertifikat', type: 'PDF', bg: '#FDF5E0' },
  { icon: '💰', title: 'Rekap Hibah', sub: 'Internal & eksternal + dana', type: 'Excel', bg: '#E8F5EA' },
  { icon: '🎓', title: 'Rekap Pelatihan', sub: 'Semua pelatihan anggota', type: 'Excel', bg: '#F0EEF8' },
  { icon: '👥', title: 'Profil Semua Dosen', sub: 'Data lengkap anggota KK', type: 'Excel', bg: '#FDEAEA' },
];

export default function LaporanExportGrid() {
  return (
    <div className="card">
      <div style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '16px' }}>Export Laporan</div>
      <div className="export-grid">
        {EXPORT_OPTIONS.map((opt, i) => (
          <div key={i} className="export-card">
            <div className="export-icon" style={{ background: opt.bg }}>{opt.icon}</div>
            <div className="export-info">
              <div className="export-title">{opt.title}</div>
              <div className="export-sub">{opt.sub}</div>
            </div>
            <div className="export-btn-wrap">
              <button className={`btn btn-sm ${opt.type === 'Excel' ? 'btn-teal' : 'btn-primary'}`}>{opt.type}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
