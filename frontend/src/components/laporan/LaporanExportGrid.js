import React, { useState } from 'react';
import { FileSpreadsheet, Download, Loader2 } from 'lucide-react';
import api from '../../services/api';
import useModalStore from '../../store/modalStore';

export default function LaporanExportGrid({ selectedYear, subKkId }) {
  const { showAlert } = useModalStore();
  const [isExportingRekap, setIsExportingRekap] = useState(false);
  const [isExportingDetail, setIsExportingDetail] = useState(false);

  const handleExport = async (type) => {
    const isRekap = type === 'rekap';
    const setLoader = isRekap ? setIsExportingRekap : setIsExportingDetail;

    try {
      setLoader(true);
      const endpoint = isRekap ? '/laporan/export/rekap' : '/laporan/export/detail';
      const response = await api.get(endpoint, {
        params: { tahun: selectedYear, sub_kk_id: subKkId },
        responseType: 'blob'
      });

      // Crucial: response.data is ALREADY a Blob object because of responseType: 'blob'.
      // Wrapping it in new Blob() is redundant and corrupts zip file signatures.
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const fileName = isRekap 
        ? `Rekap_Capaian_EEAT${selectedYear ? '_' + selectedYear : ''}.xlsx`
        : `Detail_Lengkap_Capaian_EEAT${selectedYear ? '_' + selectedYear : ''}.xlsx`;

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed', error);
      showAlert('Gagal mengunduh file ekspor.', 'Error', 'error');
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="card">
      <div style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '16px' }}>Format Ekspor Laporan</div>
      <div className="export-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="export-card" onClick={() => !isExportingRekap && handleExport('rekap')}>
          <div className="export-icon" style={{ background: '#EBF2F9', color: 'var(--navy)' }}><FileSpreadsheet size={20} /></div>
          <div className="export-info">
            <div className="export-title">Rekap Capaian Dosen</div>
            <div className="export-sub">Format ringkasan per dosen (Excel)</div>
          </div>
          <div className="export-btn-wrap">
            <button 
              className="btn btn-outline btn-sm" 
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }} 
              disabled={isExportingRekap}
              onClick={(e) => { e.stopPropagation(); !isExportingRekap && handleExport('rekap'); }}
            >
              {isExportingRekap ? <Loader2 size={12} className="spin" /> : <Download size={12} />} Unduh
            </button>
          </div>
        </div>

        <div className="export-card" onClick={() => !isExportingDetail && handleExport('detail')}>
          <div className="export-icon" style={{ background: '#E8F5EA', color: '#27AE60' }}><FileSpreadsheet size={20} /></div>
          <div className="export-info">
            <div className="export-title">Data Lengkap Capaian</div>
            <div className="export-sub">Seluruh detail capaian dalam satu file (Excel)</div>
          </div>
          <div className="export-btn-wrap">
            <button 
              className="btn btn-outline btn-sm" 
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }} 
              disabled={isExportingDetail}
              onClick={(e) => { e.stopPropagation(); !isExportingDetail && handleExport('detail'); }}
            >
              {isExportingDetail ? <Loader2 size={12} className="spin" /> : <Download size={12} />} Unduh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
