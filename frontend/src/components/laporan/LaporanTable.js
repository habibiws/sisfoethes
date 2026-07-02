import React from 'react';
import { Mail, ArrowRight, Eye } from 'lucide-react';

export default function LaporanTable({ users, onShowDetail, onRemindUser, showReminderAction = true }) {
  const getStatusStyle = (status) => {
    if (status === 'Lengkap') return { dot: '#27AE60', text: '#27AE60', bg: 'transparent' };
    if (status === 'Sebagian') return { dot: 'var(--gold)', text: 'var(--gold)', bg: '#FAFDF8' };
    return { dot: 'var(--red)', text: 'var(--red)', bg: '#FFF9F9' };
  };

  if (!users || users.length === 0) {
    return (
      <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ color: 'var(--text3)', fontSize: '13px' }}>Tidak ada data dosen yang sesuai dengan kriteria filter.</div>
      </div>
    );
  }

  return (
    <div className="laporan-table-wrapper">
      <div className="laporan-table-header">
        <div className="laporan-table-title">Daftar Capaian Dosen</div>
        <div style={{ fontSize: '13px', color: 'var(--text3)', fontWeight: 600 }}>Total: {users.length} Dosen</div>
      </div>

      {/* --- DESKTOP TABLE --- */}
      <div className="user-table-wrap" style={{ overflowX: 'auto' }}>
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
            {users.map((row, i) => {
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
                        {row.sub_kk.code}
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
                      {row.completeness !== 'Lengkap' && showReminderAction && (
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => onRemindUser(row)}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '4px',
                            padding: '4px 8px'
                          }}
                        >
                          <Mail size={12} /> Ingatkan
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE CARDS --- */}
      <div className="mobile-laporan-list">
        {users.map((row, index) => {
          const status = getStatusStyle(row.completeness);
          return (
            <div key={index} className="modern-laporan-item" onClick={() => onShowDetail(row)}>
              <div className="mli-header">
                <div>
                  <div className="mli-name">{row.name}</div>
                  <div className="mli-role">
                    {row.sub_kk ? `Sub-KK: ${row.sub_kk.code}` : 'Tidak ada Sub-KK'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: status.bg, padding: '4px 8px', borderRadius: '20px' }}>
                  <span className="dot" style={{ background: status.dot, width: '8px', height: '8px' }}></span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: status.text }}>{row.completeness}</span>
                </div>
              </div>
              
              <div className="mli-grid">
                <div className="mli-stat">
                  <div className="mli-stat-val">{row.counts.publikasi}</div>
                  <div className="mli-stat-label">Publikasi</div>
                </div>
                <div className="mli-stat">
                  <div className="mli-stat-val">{row.counts.hibah}</div>
                  <div className="mli-stat-label">Hibah</div>
                </div>
                <div className="mli-stat">
                  <div className="mli-stat-val">{row.counts.paten}</div>
                  <div className="mli-stat-label">Paten</div>
                </div>
                <div className="mli-stat">
                  <div className="mli-stat-val">{row.counts.abdimas}</div>
                  <div className="mli-stat-label">Abdimas</div>
                </div>
                <div className="mli-stat">
                  <div className="mli-stat-val">{row.counts.pelatihan}</div>
                  <div className="mli-stat-label">Pelatihan</div>
                </div>
                <div className="mli-stat">
                  <div className="mli-stat-val" style={{ color: 'var(--gold)' }}>{row.total_capaian}</div>
                  <div className="mli-stat-label">Total</div>
                </div>
              </div>

              <div className="mli-actions" onClick={(e) => e.stopPropagation()}>
                <button className="btn btn-outline btn-sm" onClick={() => onShowDetail(row)} style={{ flex: 1, justifyContent: 'center' }}>
                  <Eye size={14} /> Detail
                </button>
                {row.completeness !== 'Lengkap' && showReminderAction && (
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => onRemindUser(row)}
                    style={{ flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Mail size={14} /> Ingatkan
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
