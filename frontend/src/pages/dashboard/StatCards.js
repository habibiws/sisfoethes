import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Wallet, Award, Globe, GraduationCap } from 'lucide-react';

export default function StatCards({ data }) {
  const navigate = useNavigate();
  const summary = data?.global_summary || {
    total_dosen: 0,
    total_publikasi: 0,
    total_hibah: 0,
    total_paten: 0,
    total_abdimas: 0,
    total_pelatihan: 0,
    total_dana_hibah: 0
  };

  const user = data?.user || { role: 'anggota' };
  const canViewLaporan = ['admin', 'ketua_kk', 'ketua_sub_kk'].includes(user.role);

  // Format currency helper
  const formatCurrency = (val) => {
    if (val >= 1000000000) {
      return `Rp ${(val / 1000000000).toFixed(1)} M`;
    }
    if (val >= 1000000) {
      return `Rp ${(val / 1000000).toFixed(1)} Jt`;
    }
    return `Rp ${parseFloat(val).toLocaleString('id-ID')}`;
  };

  const cards = [
    {
      label: 'Total Anggota KK',
      value: summary.total_dosen,
      meta: 'Dosen Aktif Terdaftar',
      colorClass: 'navy',
      icon: <Users size={24} />,
      onClick: () => {
        if (canViewLaporan) navigate('/laporan');
      }
    },
    {
      label: 'Publikasi Jurnal/Prosiding',
      value: summary.total_publikasi,
      meta: 'Artikel Terbit Aktif',
      colorClass: 'red',
      icon: <FileText size={24} />,
      onClick: () => {
        navigate('/laporan/publikasi');
      }
    },
    {
      label: 'Total Dana Hibah',
      value: formatCurrency(summary.total_dana_hibah),
      meta: 'Pendanaan Riset Disetujui',
      colorClass: 'teal',
      icon: <Wallet size={24} />,
      onClick: () => {
        navigate('/laporan/hibah');
      }
    },
    {
      label: 'Paten & HKI',
      value: summary.total_paten,
      meta: 'Kekayaan Intelektual Dosen',
      colorClass: 'gold',
      icon: <Award size={24} />,
      onClick: () => {
        navigate('/laporan/paten');
      }
    },
    {
      label: 'Pengabdian Masyarakat',
      value: summary.total_abdimas,
      meta: 'Program Abdimas Dosen',
      colorClass: 'purple',
      icon: <Globe size={24} />,
      onClick: () => {
        navigate('/laporan/abdimas');
      }
    },
    {
      label: 'Event Pelatihan',
      value: summary.total_event_pelatihan ?? 0,
      meta: `Rata-rata ${summary.avg_participants ?? 0} peserta per event`,
      colorClass: 'orange',
      icon: <GraduationCap size={24} />,
      onClick: () => {
        navigate('/laporan/pelatihan');
      }
    }
  ];

  return (
    <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
      {cards.map((card, i) => (
        <div 
          key={i} 
          className={`stat-card ${card.colorClass}`} 
          onClick={card.onClick}
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '20px 24px',
            background: 'var(--white)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* Card left indicator color */}
          <div className="card-indicator" style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '5px',
            background: 
              card.colorClass === 'navy' ? 'var(--navy)' :
              card.colorClass === 'red' ? 'var(--red)' :
              card.colorClass === 'teal' ? 'var(--teal)' :
              card.colorClass === 'gold' ? 'var(--gold)' :
              card.colorClass === 'purple' ? '#9B51E0' :
              '#C0571A', // orange
            borderRadius: '5px 0 0 5px'
          }}></div>

          <div className="stat-icon" style={{
            position: 'absolute',
            right: '18px',
            top: '18px',
            opacity: 0.15,
            transition: 'all 0.3s',
            color: 'var(--navy)'
          }}>
            {card.icon}
          </div>

          <div className="stat-label" style={{
            fontSize: 'calc(13px * var(--font-scale, 1))',
            fontWeight: 700,
            color: 'var(--text3)',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            marginBottom: '8px'
          }}>
            {card.label}
          </div>

          <div className="stat-value" style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'calc(32px * var(--font-scale, 1))',
            fontWeight: 700,
            color: 'var(--navy-text)',
            lineHeight: 1
          }}>
            {card.value}
          </div>

          <div className="stat-meta" style={{
            fontSize: 'calc(13px * var(--font-scale, 1))',
            color: 'var(--text3)',
            marginTop: '6px'
          }}>
            {card.meta}
          </div>
        </div>
      ))}
    </div>
  );
}
