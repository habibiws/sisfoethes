import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function CategoryChart({ data }) {
  const summary = data?.global_summary || {
    category_distribution: []
  };

  const chartData = summary.category_distribution || [];

  // Match the visual color palette defined in token guidelines
  const colors = {
    'Publikasi': '#C0392B',
    'Hibah': '#1A7A6E',
    'Paten': '#D4A843',
    'Abdimas': '#9B51E0',
    'Pelatihan': '#C0571A'
  };

  return (
    <div className="card mb-16" style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', minHeight: '320px' }}>
      <div className="flex-between mb-12" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
        <div>
          <div className="card-title" style={{ fontSize: 'calc(16px * var(--font-scale, 1))', fontWeight: 700 }}>
            Distribusi Capaian per Kategori
          </div>
          <div className="card-sub" style={{ fontSize: 'calc(13px * var(--font-scale, 1))' }}>
            Perbandingan jumlah total luaran triwulan akademik aktif
          </div>
        </div>
      </div>

      <div style={{ flex: 1, width: '100%', height: '220px', marginTop: '10px' }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis 
                dataKey="category" 
                tick={{ fill: 'var(--text2)', fontSize: 'calc(13px * var(--font-scale, 1))', fontWeight: 600 }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: 'var(--text3)', fontSize: 'calc(12px * var(--font-scale, 1))' }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(15, 35, 64, 0.03)' }}
                contentStyle={{ 
                  fontSize: '13px', 
                  borderRadius: '8px', 
                  boxShadow: 'var(--shadow)',
                  border: '1px solid var(--border)',
                  background: 'var(--white)',
                  color: 'var(--text)'
                }}
              />
              <Bar 
                dataKey="count" 
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
                animationDuration={800}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[entry.category] || 'var(--navy)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text3)', fontSize: '13px' }}>
            Belum ada data distribusi capaian
          </div>
        )}
      </div>
    </div>
  );
}
