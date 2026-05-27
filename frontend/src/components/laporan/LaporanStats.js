import React from 'react';
import { Users, FileText, Wallet, Award, Globe, GraduationCap, ChevronRight } from 'lucide-react';

export default function LaporanStats({ summary }) {
  if (!summary) return null;

  const formatDana = (value) => {
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1).replace('.', ',') + ' M';
    }
    if (value >= 1000000) {
      return (value / 1000000).toFixed(0) + ' Jt';
    }
    return value.toLocaleString('id-ID');
  };

  const stats = [
    { 
      label: 'Total Dosen', 
      val: summary.total_dosen, 
      icon: <Users size={22} />, 
      color: '#3498DB', 
      bg: '#EBF5FB',
      isInteractive: false 
    },
    { 
      label: 'Publikasi', 
      val: summary.total_publikasi, 
      icon: <FileText size={22} />, 
      color: '#27AE60', 
      bg: '#E8F5EA',
      isInteractive: true
    },
    { 
      label: 'Dana Hibah', 
      val: `Rp ${formatDana(summary.total_dana_hibah)}`, 
      icon: <Wallet size={22} />, 
      color: 'var(--gold)', 
      bg: '#FAFDF8',
      isInteractive: true
    },
    { 
      label: 'Paten & HKI', 
      val: summary.total_paten, 
      icon: <Award size={22} />, 
      color: '#2F80ED', 
      bg: '#EBF2F9',
      isInteractive: true
    },
    { 
      label: 'Abdimas', 
      val: summary.total_abdimas, 
      icon: <Globe size={22} />, 
      color: 'var(--red)', 
      bg: '#FFF9F9',
      isInteractive: true
    },
    { 
      label: 'Pelatihan', 
      val: summary.total_pelatihan, 
      icon: <GraduationCap size={22} />, 
      color: '#9B51E0', 
      bg: 'rgba(155, 81, 224, 0.08)',
      isInteractive: true
    },
  ];

  return (
    <div className="laporan-summary-bar">
      {stats.map((s, i) => (
        <div 
          key={i} 
          className={`laporan-stat-item ${s.isInteractive ? 'interactive' : ''}`}
          onClick={() => s.isInteractive && window.alert(`Fitur List Data ${s.label} akan segera hadir!`)}
        >
          <div className="laporan-stat-icon stat-icon" style={{ background: s.bg, color: s.color }}>
            {s.icon}
          </div>
          <div className="laporan-stat-info">
            <div className="laporan-stat-val">{s.val}</div>
            <div className="laporan-stat-label">{s.label}</div>
          </div>
          {s.isInteractive && (
            <div className="laporan-stat-hover-text">
              Detail <ChevronRight size={10} style={{ display: 'inline', marginBottom: '-2px' }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
