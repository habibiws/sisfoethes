import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TopPerformers({ data }) {
  const navigate = useNavigate();
  const performers = data?.top_performers || [];
  const canViewDetails = data?.can_view_member_details || false;

  const getStatusBadgeClass = (status) => {
    if (status === 'Lengkap') return 'tag-green';
    if (status === 'Sebagian') return 'tag-gold';
    return 'tag-red';
  };

  const getStatusDotClass = (status) => {
    if (status === 'Lengkap') return 'dot-green';
    if (status === 'Sebagian') return 'dot-amber';
    return 'dot-red';
  };

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <div className="flex-between mb-12" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
        <div>
          <div className="card-title" style={{ fontSize: 'calc(16px * var(--font-scale, 1))', fontWeight: 700 }}>
            Top 5 Capaian Dosen
          </div>
          <div className="card-sub" style={{ fontSize: 'calc(13px * var(--font-scale, 1))' }}>
            Rangkuman dosen dengan kuantitas capaian tridharma tertinggi
          </div>
        </div>
        {canViewDetails && (
          <button 
            className="btn btn-outline btn-sm" 
            onClick={() => navigate('/laporan')}
            style={{ fontSize: 'calc(13px * var(--font-scale, 1))', fontWeight: 600 }}
          >
            Lihat Laporan Lengkap →
          </button>
        )}
      </div>

      <div className="table-wrap">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ width: '60px', textAlign: 'center', fontSize: 'calc(12px * var(--font-scale, 1))' }}>Rank</th>
              <th style={{ fontSize: 'calc(12px * var(--font-scale, 1))' }}>Nama Dosen</th>
              <th style={{ width: '120px', textAlign: 'center', fontSize: 'calc(12px * var(--font-scale, 1))' }}>Sub-KK</th>
              <th style={{ width: '150px', textAlign: 'center', fontSize: 'calc(12px * var(--font-scale, 1))' }}>Total Capaian</th>
              <th style={{ width: '150px', fontSize: 'calc(12px * var(--font-scale, 1))' }}>Status Kelengkapan</th>
            </tr>
          </thead>
          <tbody>
            {performers.length > 0 ? (
              performers.map((row, i) => (
                <tr key={i} style={{ transition: 'background 0.2s' }}>
                  <td style={{ textAlign: 'center', fontWeight: 700, fontSize: 'calc(14px * var(--font-scale, 1))', color: 'var(--text3)' }}>
                    #{i + 1}
                  </td>
                  <td>
                    <div style={{ fontSize: 'calc(13px * var(--font-scale, 1))', fontWeight: 700, color: 'var(--navy)' }}>
                      {row.name}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {row.sub_kk_code ? (
                      <span className="tag-navy" style={{ fontSize: 'calc(11px * var(--font-scale, 1))', padding: '2px 8px', borderRadius: '4px', background: '#EBF2F9', color: 'var(--navy)', fontWeight: 600 }}>
                        {row.sub_kk_code}
                      </span>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--text3)' }}>—</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 800, fontSize: 'calc(14px * var(--font-scale, 1))', color: 'var(--navy)' }}>
                    {row.total_capaian}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={`dot ${getStatusDotClass(row.completeness)}`}></span>
                      <span className={`tag ${getStatusBadgeClass(row.completeness)}`} style={{ fontSize: 'calc(11px * var(--font-scale, 1))', padding: '2px 6px', fontWeight: 700 }}>
                        {row.completeness}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text3)', fontSize: '13px' }}>
                  Belum ada data dosen
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
