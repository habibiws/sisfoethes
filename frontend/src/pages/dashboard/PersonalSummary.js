import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function PersonalSummary({ data, selectedYear }) {
  const navigate = useNavigate();
  const summary = data?.personal_summary || { publikasi: 0, hibah: 0, paten: 0, abdimas: 0, pelatihan: 0 };
  const user = data?.user || { name: 'Dosen', role: 'anggota', sub_kk: null };

  // Calculate completeness category count (how many has > 0 entries)
  const categories = [
    { key: 'publikasi', label: 'Publikasi' },
    { key: 'hibah', label: 'Hibah' },
    { key: 'paten', label: 'Paten/HKI' },
    { key: 'abdimas', label: 'Abdimas' },
    { key: 'pelatihan', label: 'Pelatihan' }
  ];

  const filledCount = categories.filter(cat => summary[cat.key] > 0).length;
  const percentage = (filledCount / 5) * 100;

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'Selamat Pagi';
    if (hour >= 11 && hour < 15) return 'Selamat Siang';
    if (hour >= 15 && hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const getRoleLabel = (role) => {
    if (role === 'admin') return 'Admin';
    if (role === 'ketua_kk') return 'Ketua KK';
    if (role === 'ketua_sub_kk') return 'Ketua Sub-KK';
    return 'Anggota';
  };

  return (
    <div className="card personal-welcome-card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)', color: 'white', border: 'none', position: 'relative', overflow: 'hidden', padding: '28px' }}>
      {/* Decorative background accent */}
      <div style={{ position: 'absolute', right: '-50px', top: '-50px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', left: '10%', bottom: '-30px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', pointerEvents: 'none' }}></div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="tag-gold" style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(212, 168, 67, 0.15)', color: 'var(--gold)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>
                <Sparkles size={12} /> {getRoleLabel(user.role)}
              </span>
              {user.sub_kk && (
                <span className="tag-navy" style={{ background: 'rgba(255, 255, 255, 0.12)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>
                  Sub-KK: {user.sub_kk.code}
                </span>
              )}
            </div>
            <h2 style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: 'calc(28px * var(--font-scale, 1))', fontWeight: 700, letterSpacing: '0.2px' }}>
              {getGreeting()}, {user.name}
            </h2>
            <p style={{ margin: '6px 0 0 0', fontSize: 'calc(13px * var(--font-scale, 1))', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>
              {selectedYear ? (
                <>
                  Berikut adalah ringkasan capaian pribadi Anda pada tahun <strong style={{ color: 'white' }}>{selectedYear}</strong>
                </>
              ) : (
                'Berikut adalah ringkasan seluruh capaian pribadi Anda'
              )}
            </p>
          </div>
        </div>

        {/* 5 Personal Categories Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', margin: '24px 0 20px 0' }}>
          {categories.map(cat => (
            <div key={cat.key} style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '12px 8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: 'calc(12px * var(--font-scale, 1))', color: 'rgba(255,255,255,0.65)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>
                {cat.label}
              </div>
              <div style={{ fontSize: 'calc(26px * var(--font-scale, 1))', fontWeight: 800, color: summary[cat.key] > 0 ? 'var(--gold)' : 'rgba(255,255,255,0.3)' }}>
                {summary[cat.key]}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Kelengkapan & Quick Actions */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'calc(13px * var(--font-scale, 1))', marginBottom: '6px', fontWeight: 600 }}>
              <span>Kelengkapan Capaian Saya</span>
              <span style={{ color: 'var(--gold)' }}>{filledCount}/5 Kategori Terisi ({percentage}%)</span>
            </div>
            <div className="progress-wrap" style={{ height: '8px', background: 'rgba(255,255,255,0.15)', borderRadius: '6px' }}>
              <div className="progress-fill gold" style={{ width: `${percentage}%`, background: 'var(--gold)', transition: 'width 0.5s' }}></div>
            </div>
          </div>

          {user.role !== 'admin' && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => navigate('/capaian')}
                className="btn btn-gold btn-sm"
                style={{ 
                  background: 'var(--gold)', 
                  color: 'var(--navy)', 
                  fontWeight: 700, 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  border: 'none'
                }}
              >
                Input Capaian <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
