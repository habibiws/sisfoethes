import React from 'react';

export default function PelatihanSummary({ data }) {
  return (
    <div className="summary-row">
      <div className="summary-card" style={{ borderLeft: '4px solid var(--navy)' }}>
        <div className="summary-val">{data.eventCount}</div>
        <div className="summary-label">Event Pelatihan</div>
      </div>
      <div className="summary-card" style={{ borderLeft: '4px solid var(--teal)' }}>
        <div className="summary-val">{data.totalPeserta}</div>
        <div className="summary-label">Total Peserta</div>
      </div>
      <div className="summary-card" style={{ borderLeft: '4px solid var(--gold)' }}>
        <div className="summary-val" style={{ fontSize: '20px' }}>Rp {data.totalBiaya} jt</div>
        <div className="summary-label">Total Biaya</div>
      </div>
      <div className="summary-card" style={{ borderLeft: '4px solid var(--red)' }}>
        <div className="summary-val">{data.completed}/{data.eventCount}</div>
        <div className="summary-label">Sudah Terlaksana</div>
      </div>
    </div>
  );
}
