import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function ChartSection({ data }) {
  const navigate = useNavigate();
  const summary = data?.global_summary || {
    total_dosen: 0,
    completeness_distribution: { lengkap: 0, parsial: 0, belum: 0 },
    sub_kk_progress: [],
    viewable_sub_kk_ids: []
  };

  const dist = summary.completeness_distribution;
  const viewableSubKkIds = data?.viewable_sub_kk_ids || [];

  // Pie chart data
  const pieData = [
    { name: 'Lengkap', value: dist.lengkap, color: '#27AE60' },
    { name: 'Parsial', value: dist.parsial, color: '#D4A843' },
    { name: 'Belum Input', value: dist.belum, color: '#C0392B' }
  ].filter(d => d.value > 0);

  // Fallback if no data
  const chartData = pieData.length > 0 ? pieData : [{ name: 'Belum Ada Data', value: 1, color: '#DDD9D2' }];

  const handleSubKkClick = (subKkId) => {
    if (viewableSubKkIds.includes(subKkId)) {
      navigate(`/laporan?sub_kk_id=${subKkId}`);
    }
  };

  return (
    <div className="grid-2 mb-16" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
      
      {/* Kolom Kiri: Donut Chart Kelengkapan */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: '340px' }}>
        <div className="flex-between mb-12" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
          <div>
            <div className="card-title" style={{ fontSize: 'calc(16px * var(--font-scale, 1))', fontWeight: 700 }}>
              Kelengkapan Input Capaian
            </div>
            <div className="card-sub" style={{ fontSize: 'calc(13px * var(--font-scale, 1))' }}>
              Status pengisian 5 kategori capaian dosen
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ width: '100%', height: '180px', position: 'relative' }}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    fontSize: '12px', 
                    borderRadius: '8px', 
                    boxShadow: 'var(--shadow)',
                    border: '1px solid var(--border)',
                    background: 'var(--white)',
                    color: 'var(--text)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Inner Center Label */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none'
            }}>
              <div style={{ fontSize: 'calc(26px * var(--font-scale, 1))', fontWeight: 800, color: 'var(--navy)', lineHeight: 1 }}>
                {dist.lengkap}/{summary.total_dosen}
              </div>
              <div style={{ fontSize: 'calc(11px * var(--font-scale, 1))', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', marginTop: '2px' }}>
                Lengkap
              </div>
            </div>
          </div>

          {/* Custom Legends */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'calc(13px * var(--font-scale, 1))', fontWeight: 600 }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27AE60', display: 'inline-block' }}></span>
              <span>Lengkap ({dist.lengkap})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'calc(13px * var(--font-scale, 1))', fontWeight: 600 }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#D4A843', display: 'inline-block' }}></span>
              <span>Parsial ({dist.parsial})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'calc(13px * var(--font-scale, 1))', fontWeight: 600 }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#C0392B', display: 'inline-block' }}></span>
              <span>Belum ({dist.belum})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kolom Kanan: Progress bar per Sub-KK */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: '340px' }}>
        <div className="flex-between mb-12" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
          <div>
            <div className="card-title" style={{ fontSize: 'calc(16px * var(--font-scale, 1))', fontWeight: 700 }}>
              Progress per Sub-KK
            </div>
            <div className="card-sub" style={{ fontSize: 'calc(13px * var(--font-scale, 1))' }}>
              Kelengkapan capaian per sub-kelompok keahlian
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'center' }}>
          {summary.sub_kk_progress && summary.sub_kk_progress.length > 0 ? (
            summary.sub_kk_progress.map(sub => {
              const completedPercent = sub.total_members > 0 ? (sub.completed / sub.total_members) * 100 : 0;
              const hasAccess = viewableSubKkIds.includes(sub.id);
              
              // Dynamic bar fill color based on completeness rate
              let barColorClass = 'red';
              if (completedPercent === 100) barColorClass = 'teal';
              else if (completedPercent >= 50) barColorClass = 'navy';

              return (
                <div 
                  key={sub.id} 
                  onClick={() => handleSubKkClick(sub.id)}
                  style={{ 
                    cursor: hasAccess ? 'pointer' : 'default',
                    padding: '6px 8px',
                    borderRadius: '8px',
                    transition: 'background 0.2s',
                    background: hasAccess ? 'rgba(15, 35, 64, 0.01)' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (hasAccess) e.currentTarget.style.background = 'rgba(15, 35, 64, 0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = hasAccess ? 'rgba(15, 35, 64, 0.01)' : 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'calc(14px * var(--font-scale, 1))', fontWeight: 700, marginBottom: '6px' }}>
                    <span style={{ color: 'var(--navy)' }}>{sub.code} <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text3)' }}>— {sub.name}</span></span>
                    <span style={{ color: completedPercent === 100 ? 'var(--teal)' : 'var(--navy)' }}>
                      {sub.completed}/{sub.total_members} Lengkap
                    </span>
                  </div>
                  <div className="progress-wrap" style={{ height: '8px' }}>
                    <div className={`progress-fill ${barColorClass}`} style={{ width: `${completedPercent}%` }}></div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: '13px' }}>Belum ada data Sub-KK</div>
          )}
        </div>
      </div>

    </div>
  );
}
