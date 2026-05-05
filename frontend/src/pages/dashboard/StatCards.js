import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * StatCards - Menampilkan ringkasan statistik utama di Dashboard.
 * Kartu bersifat interaktif dan dapat diklik untuk navigasi ke detail.
 */
export default function StatCards() {
  const navigate = useNavigate();

  return (
    <div className="stat-grid">
      <div className="stat-card navy" onClick={() => navigate('/laporan')}>
        <div className="stat-icon">👥</div>
        <div className="stat-label">Total Anggota KK</div>
        <div className="stat-value">22</div>
        <div className="stat-meta">5 Sub-KK aktif</div>
      </div>

      <div className="stat-card red" onClick={() => navigate('/capaian')}>
        <div className="stat-icon">📄</div>
        <div className="stat-label">Publikasi Tahun Ini</div>
        <div className="stat-value">18</div>
        <div className="stat-meta">12 jurnal · 6 prosiding</div>
      </div>

      <div className="stat-card teal" onClick={() => navigate('/capaian')}>
        <div className="stat-icon">💰</div>
        <div className="stat-label">Hibah Aktif</div>
        <div className="stat-value">7</div>
        <div className="stat-meta">Rp 2,3 M total dana</div>
      </div>

      <div className="stat-card gold" onClick={() => navigate('/capaian')}>
        <div className="stat-icon">🏅</div>
        <div className="stat-label">Paten & HKI</div>
        <div className="stat-value">4</div>
        <div className="stat-meta">2 granted · 2 pending</div>
      </div>
    </div>
  );
}
