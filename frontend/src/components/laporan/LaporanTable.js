import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';

export default function LaporanTable({ users, onShowDetail, onRemindUser }) {
  const getStatusStyle = (status) => {
    if (status === 'Lengkap') return { dot: '#27AE60', text: '#27AE60', bg: 'transparent' };
    if (status === 'Parsial') return { dot: 'var(--gold)', text: 'var(--gold)', bg: '#FAFDF8' };
    return { dot: 'var(--red)', text: 'var(--red)', bg: '#FFF9F9' };
  };

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '20px' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, color: 'var(--navy)' }}>Rekap Capaian Dosen KK ETHES</div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="user-table">
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>#</th>
              <th>Nama Dosen</th>
              <th>Sub-KK</th>
              <th style={{ textAlign: 'center' }}>Pub</th>
              <th style={{ textAlign: 'center' }}>Hibah</th>
              <th style={{ textAlign: 'center' }}>Paten</th>
              <th style={{ textAlign: 'center' }}>Abdimas</th>
              <th style={{ textAlign: 'center' }}>Latih</th>
              <th style={{ textAlign: 'center' }}>Total</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="11" style={{ textAlign: 'center', padding: '30px', color: 'var(--text3)', fontSize: '14px' }}>
                  Tidak ada data dosen yang sesuai dengan kriteria filter.
                </td>
              </tr>
            ) : (
              users.map((row, i) => {
                const style = getStatusStyle(row.completeness);
                return (
                  <tr 
                    key={row.id} 
                    style={{ background: style.bg, cursor: 'pointer', transition: 'background 0.2s' }}
                    onClick={() => onShowDetail(row)}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(15, 35, 64, 0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = style.bg}
                  >
                    <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text3)' }}>{i + 1}</td>
                    <td>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>{row.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'capitalize' }}>
                        {row.role.replace(/_/g, ' ')}
                      </div>
                    </td>
                    <td>
                      {row.sub_kk ? (
                        <span className="tag-navy" style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: '#EBF2F9', color: 'var(--navy)', fontWeight: 600 }}>
                          {row.sub_kk.name}
                        </span>
                      ) : (
                        <span style={{ fontSize: '11px', color: 'var(--text3)' }}>—</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{row.counts.publikasi || '—'}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{row.counts.hibah || '—'}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{row.counts.paten || '—'}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{row.counts.abdimas || '—'}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{row.counts.pelatihan || '—'}</td>
                    <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--navy)' }}>{row.total_capaian}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: style.dot }}></span>
                        <span style={{ fontSize: '12px', color: style.text, fontWeight: 600 }}>{row.completeness}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
                        <button 
                          className="btn btn-ghost btn-sm" 
                          onClick={() => onShowDetail(row)}
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px' }}
                        >
                          Detail <ArrowRight size={12} />
                        </button>
                        {row.completeness !== 'Lengkap' && (
                          <button 
                            className={`btn btn-sm ${row.completeness === 'Belum' ? 'btn-red' : 'btn-outline'}`}
                            onClick={() => onRemindUser(row)}
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '4px',
                              padding: '4px 8px',
                              ...(row.completeness === 'Parsial' ? { color: 'var(--gold)', borderColor: 'var(--gold)', background: 'transparent' } : {})
                            }}
                          >
                            <Mail size={12} /> Ingatkan
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
