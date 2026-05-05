import React from 'react';

export default function LaporanFilter() {
  return (
    <div className="filter-bar-laporan">
      <label className="filter-label">Filter:</label>
      <select className="filter-select">
        <option>Sem. Genap 2024/2025</option>
        <option>Sem. Ganjil 2024/2025</option>
        <option>Tahun 2025</option>
        <option>Tahun 2024</option>
      </select>
      <select className="filter-select">
        <option>Semua Sub-KK</option>
        <option>CORES</option>
        <option>PORSCE</option>
        <option>BEE</option>
        <option>COMMET</option>
        <option>COS(PI)</option>
      </select>
      <select className="filter-select">
        <option value="">Semua Status</option>
        <option value="Lengkap">Lengkap</option>
        <option value="Parsial">Parsial</option>
        <option value="Belum">Belum Input</option>
      </select>
      <input type="text" className="filter-input" placeholder="Cari nama dosen..." />
      <button className="btn btn-primary btn-sm">Terapkan</button>
    </div>
  );
}
