import React from 'react';
import { FileSpreadsheet, Download } from 'lucide-react';
import useModalStore from '../../store/modalStore';

const EXPORT_OPTIONS = [
  { icon: <FileSpreadsheet size={20} />, title: 'Rekap Capaian Dosen', sub: 'Format ringkasan per dosen (Excel)', bg: '#EBF2F9', color: 'var(--navy)' },
  { icon: <FileSpreadsheet size={20} />, title: 'Data Lengkap Capaian', sub: 'Seluruh detail capaian dalam satu file (Excel)', bg: '#E8F5EA', color: '#27AE60' },
];

export default function LaporanExportGrid() {
  const { showAlert } = useModalStore();

  const handleExportClick = (title) => {
    showAlert(`Fitur ekspor untuk "${title}" akan diimplementasikan pada sesi khusus ekspor data berikutnya.`, 'Segera Hadir', 'info');
  };

  return (
    <div className="card">
      <div style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '16px' }}>Format Ekspor Laporan</div>
      <div className="export-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {EXPORT_OPTIONS.map((opt, i) => (
          <div key={i} className="export-card" onClick={() => handleExportClick(opt.title)}>
            <div className="export-icon" style={{ background: opt.bg, color: opt.color }}>{opt.icon}</div>
            <div className="export-info">
              <div className="export-title">{opt.title}</div>
              <div className="export-sub">{opt.sub}</div>
            </div>
            <div className="export-btn-wrap">
              <button className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Download size={12} /> Unduh
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
