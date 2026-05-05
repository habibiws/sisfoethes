import React from 'react';

export default function LaporanStats() {
  return (
    <div className="stat-grid mb-18">
      <div className="stat-card navy">
        <div className="stat-icon">📄</div>
        <div className="stat-label">Total Publikasi</div>
        <div className="stat-value">29</div>
        <div className="stat-meta">18 jurnal · 11 prosiding</div>
      </div>
      <div className="stat-card teal">
        <div className="stat-icon">💰</div>
        <div className="stat-label">Total Dana Hibah</div>
        <div className="stat-value" style={{ fontSize: '24px' }}>2,3M</div>
        <div className="stat-meta">7 hibah aktif</div>
      </div>
      <div className="stat-card gold">
        <div className="stat-icon">🏅</div>
        <div className="stat-label">HKI & Paten</div>
        <div className="stat-value">4</div>
        <div className="stat-meta">2 granted · 2 pending</div>
      </div>
      <div className="stat-card red">
        <div className="stat-icon">🎓</div>
        <div className="stat-label">Pelatihan/Sertifikasi</div>
        <div className="stat-value">12</div>
        <div className="stat-meta">Seluruh anggota KK</div>
      </div>
    </div>
  );
}
