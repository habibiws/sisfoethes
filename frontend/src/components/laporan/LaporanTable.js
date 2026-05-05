import React from 'react';

const REKAP_DATA = [
  { name: 'Mohamad Yani', role: 'Ketua Sub-KK', subKk: 'CORES', pub: '3 (2 CA)', hibah: '1 · Rp50jt', paten: '-', abdimas: 2, pelatihan: 3, status: 'Lengkap' },
  { name: 'Anifatul Faricha', role: 'Ketua KK', subKk: 'BEE', pub: '4 (3 CA)', hibah: '2 · Rp120jt', paten: 1, abdimas: 1, pelatihan: 2, status: 'Lengkap' },
  { name: 'Dr. Susijanto T.R.', role: 'Anggota', subKk: 'CORES', pub: '2 (1 CA)', hibah: '1 · Rp75jt', paten: 1, abdimas: 1, pelatihan: 2, status: 'Lengkap' },
  { name: 'Rifki Dwi Putranto', role: 'Ketua Sub-KK', subKk: 'PORSCE', pub: '1', hibah: '1 · Rp40jt', paten: '-', abdimas: 1, pelatihan: '-', status: 'Parsial' },
  { name: 'Nilla Rachmaningrum', role: 'Ketua Sub-KK', subKk: 'COMMET', pub: '-', hibah: '-', paten: '-', abdimas: '-', pelatihan: '-', status: 'Belum' },
];

export default function LaporanTable({ onShowDetail }) {
  const getStatusStyle = (status) => {
    if (status === 'Lengkap') return { dot: '#27AE60', text: '#27AE60', bg: 'transparent' };
    if (status === 'Parsial') return { dot: 'var(--gold)', text: 'var(--gold)', bg: '#FAFDF8' };
    return { dot: 'var(--red)', text: 'var(--red)', bg: '#FFF9F9' };
  };

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '20px' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, color: 'var(--navy)' }}>Rekap Capaian Semua Dosen</div>
        <button className="btn btn-outline btn-sm">📊 Export Excel</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="user-table">
          <thead>
            <tr>
              <th>Nama Dosen</th>
              <th>Sub-KK</th>
              <th>Pub</th>
              <th>Hibah</th>
              <th>Paten</th>
              <th>Abdimas</th>
              <th>Latih</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {REKAP_DATA.map((row, i) => {
              const style = getStatusStyle(row.status);
              return (
                <tr key={i} style={{ background: style.bg }}>
                  <td>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>{row.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{row.role}</div>
                  </td>
                  <td><span className="tag-navy" style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: '#EBF2F9', color: 'var(--navy)' }}>{row.subKk}</span></td>
                  <td><strong>{row.pub}</strong></td>
                  <td>{row.hibah}</td>
                  <td>{row.paten}</td>
                  <td>{row.abdimas}</td>
                  <td>{row.pelatihan}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: style.dot }}></span>
                      <span style={{ fontSize: '12px', color: style.text, fontWeight: 600 }}>{row.status}</span>
                    </div>
                  </td>
                  <td>
                    {row.status === 'Lengkap' ? (
                      <button className="btn btn-ghost btn-sm" onClick={() => onShowDetail(row)}>Detail</button>
                    ) : (
                      <button className={`btn btn-sm ${row.status === 'Belum' ? 'btn-red' : 'btn-outline'}`} style={row.status === 'Parsial' ? { color: 'var(--gold)', borderColor: 'var(--gold)' } : {}}>
                        Ingatkan
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
