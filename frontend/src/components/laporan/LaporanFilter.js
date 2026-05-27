import React from 'react';

export default function LaporanFilter({ filters, onFilterChange, subKks }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div className="filter-bar-laporan">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, flexWrap: 'wrap' }}>
        <span className="filter-label">Filter:</span>
        
        {/* Filter Sub-KK */}
        <select 
          name="sub_kk_id" 
          className="filter-select select-input" 
          value={filters.sub_kk_id} 
          onChange={handleChange}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '13px', background: 'var(--white)' }}
        >
          <option value="">Semua Sub-KK</option>
          {subKks && subKks.map(sub => (
            <option key={sub.id} value={sub.id}>{sub.code}</option>
          ))}
        </select>

        {/* Filter Kelengkapan Status */}
        <select 
          name="status" 
          className="filter-select select-input" 
          value={filters.status} 
          onChange={handleChange}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '13px', background: 'var(--white)' }}
        >
          <option value="">Semua Status</option>
          <option value="Lengkap">Lengkap</option>
          <option value="Sebagian">Sebagian</option>
          <option value="Belum">Belum Input</option>
        </select>

        {/* Input Search Dosen */}
        <input 
          type="text" 
          name="search"
          className="filter-input text-input" 
          placeholder="Cari nama dosen..." 
          value={filters.search}
          onChange={handleChange}
          style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '13px', flex: 1, minWidth: '200px' }}
        />
      </div>
    </div>
  );
}
