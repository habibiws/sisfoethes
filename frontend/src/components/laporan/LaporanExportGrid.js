import React, { useState } from 'react';
import { FileSpreadsheet, Download, Loader2 } from 'lucide-react';
import api from '../../services/api';
import useModalStore from '../../store/modalStore';

export default function LaporanExportGrid({ selectedYear, subKkId }) {
  const { showAlert } = useModalStore();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (type) => {
    if (type !== 'rekap') {
      showAlert('Fitur ekspor detail lengkap sedang dalam pengembangan.', 'Info', 'info');
      return;
    }

    try {
      setIsExporting(true);
      const response = await api.get('/laporan/export/rekap', {
        params: { tahun: selectedYear, sub_kk_id: subKkId },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Rekap_Capaian_ETHES${selectedYear ? '_' + selectedYear : ''}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed', error);
      showAlert('Gagal mengunduh file ekspor.', 'Error', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="card">
      <div style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '16px' }}>Format Ekspor Laporan</div>
      <div className="export-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="export-card" onClick={() => handleExport('rekap')}>
          <div className="export-icon" style={{ background: '#EBF2F9', color: 'var(--navy)' }}><FileSpreadsheet size={20} /></div>
          <div className="export-info">
            <div className="export-title">Rekap Capaian Dosen</div>
            <div className="export-sub">Format ringkasan per dosen (Excel)</div>
          </div>
          <div className="export-btn-wrap">
            <button className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }} disabled={isExporting}>
              {isExporting ? <Loader2 size={12} className="spin" /> : <Download size={12} />} Unduh
            </button>
          </div>
        </div>

        <div className="export-card" onClick={() => handleExport('detail')}>
          <div className="export-icon" style={{ background: '#E8F5EA', color: '#27AE60' }}><FileSpreadsheet size={20} /></div>
          <div className="export-info">
            <div className="export-title">Data Lengkap Capaian</div>
            <div className="export-sub">Seluruh detail capaian dalam satu file (Excel)</div>
          </div>
          <div className="export-btn-wrap">
            <button className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Download size={12} /> Unduh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
