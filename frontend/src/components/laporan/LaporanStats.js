import React from 'react';
import { Users, FileText, Wallet, Award, Globe, GraduationCap } from 'lucide-react';

export default function LaporanStats({ summary }) {
  if (!summary) return null;

  // Format money to clean IDR
  const formatDana = (value) => {
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1).replace('.', ',') + ' M';
    }
    if (value >= 1000000) {
      return (value / 1000000).toFixed(0) + ' Jt';
    }
    return value.toLocaleString('id-ID');
  };

  return (
    <div className="pelatihan-summary-bar card mb-20" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', padding: '16px 20px' }}>
      <div className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '130px' }}>
        <div className="stat-icon primary" style={{ background: 'rgba(15, 35, 64, 0.08)', color: 'var(--navy)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={18} /></div>
        <div>
          <div className="stat-val" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)' }}>{summary.total_dosen}</div>
          <div className="stat-label" style={{ fontSize: '11px', color: 'var(--text3)' }}>Total Dosen</div>
        </div>
      </div>

      <div className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '130px' }}>
        <div className="stat-icon success" style={{ background: 'rgba(39, 174, 96, 0.08)', color: '#27AE60', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={18} /></div>
        <div>
          <div className="stat-val" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)' }}>{summary.total_publikasi}</div>
          <div className="stat-label" style={{ fontSize: '11px', color: 'var(--text3)' }}>Publikasi</div>
        </div>
      </div>

      <div className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '140px' }}>
        <div className="stat-icon warning" style={{ background: 'rgba(242, 201, 76, 0.1)', color: 'var(--gold)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Wallet size={18} /></div>
        <div>
          <div className="stat-val" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)' }}>Rp {formatDana(summary.total_dana_hibah)}</div>
          <div className="stat-label" style={{ fontSize: '11px', color: 'var(--text3)' }}>Dana Hibah</div>
        </div>
      </div>

      <div className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '130px' }}>
        <div className="stat-icon info" style={{ background: 'rgba(47, 128, 237, 0.08)', color: '#2F80ED', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Award size={18} /></div>
        <div>
          <div className="stat-val" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)' }}>{summary.total_paten}</div>
          <div className="stat-label" style={{ fontSize: '11px', color: 'var(--text3)' }}>Paten & HKI</div>
        </div>
      </div>

      <div className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '130px' }}>
        <div className="stat-icon danger" style={{ background: 'rgba(235, 87, 87, 0.08)', color: 'var(--red)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Globe size={18} /></div>
        <div>
          <div className="stat-val" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)' }}>{summary.total_abdimas}</div>
          <div className="stat-label" style={{ fontSize: '11px', color: 'var(--text3)' }}>Abdimas</div>
        </div>
      </div>

      <div className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '130px' }}>
        <div className="stat-icon" style={{ background: 'rgba(155, 81, 224, 0.08)', color: '#9B51E0', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><GraduationCap size={18} /></div>
        <div>
          <div className="stat-val" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)' }}>{summary.total_pelatihan}</div>
          <div className="stat-label" style={{ fontSize: '11px', color: 'var(--text3)' }}>Pelatihan</div>
        </div>
      </div>
    </div>
  );
}
