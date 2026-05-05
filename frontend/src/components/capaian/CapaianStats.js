import React from 'react';

/**
 * CapaianStats - Menampilkan ringkasan jumlah capaian per kategori.
 */
export default function CapaianStats({ stats }) {
  const statItems = [
    { label: 'Publikasi', val: stats.publikasi || 0 },
    { label: 'Hibah', val: stats.hibah || 0 },
    { label: 'Paten', val: stats.paten || 0 },
    { label: 'Abdimas', val: stats.abdimas || 0 },
    { label: 'Pelatihan', val: stats.pelatihan || 0 },
  ];

  const total = statItems.reduce((acc, item) => acc + item.val, 0);

  return (
    <div className="my-stats">
      {statItems.map((item, idx) => (
        <div key={idx} className="my-stat">
          <div className="my-stat-val">{item.val}</div>
          <div className="my-stat-label">{item.label}</div>
        </div>
      ))}
      <div className="my-stat highlight">
        <div className="my-stat-val text-teal">{total}</div>
        <div className="my-stat-label text-navy">Total</div>
      </div>
    </div>
  );
}
