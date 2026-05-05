import React from 'react';

export default function ProgressCards() {
  return (
    <div className="grid-2 mb-16">
      {/* Kelengkapan Input */}
      <div className="card">
        <div className="flex-between mb-12">
          <div>
            <div className="card-title">Kelengkapan Input Capaian</div>
            <div className="card-sub">Per sub-kelompok keahlian</div>
          </div>
          <span className="tag tag-red">5 belum lengkap</span>
        </div>
        <div className="gap-12">
          <div>
            <div className="flex-between" style={{ fontSize: '12px', marginBottom: '5px' }}>
              <span><strong>CORES</strong></span><span style={{ fontWeight: 700, color: 'var(--teal)' }}>6/6</span>
            </div>
            <div className="progress-wrap"><div className="progress-fill teal" style={{ width: '100%' }}></div></div>
          </div>
          <div>
            <div className="flex-between" style={{ fontSize: '12px', marginBottom: '5px' }}>
              <span><strong>COS(PI)</strong></span><span style={{ fontWeight: 700, color: 'var(--navy)' }}>5/6</span>
            </div>
            <div className="progress-wrap"><div className="progress-fill" style={{ width: '83%' }}></div></div>
          </div>
          <div>
            <div className="flex-between" style={{ fontSize: '12px', marginBottom: '5px' }}>
              <span><strong>PORSCE</strong></span><span style={{ fontWeight: 700, color: 'var(--gold)' }}>3/4</span>
            </div>
            <div className="progress-wrap"><div className="progress-fill gold" style={{ width: '75%' }}></div></div>
          </div>
          <div>
            <div className="flex-between" style={{ fontSize: '12px', marginBottom: '5px' }}>
              <span><strong>COMMET</strong></span><span style={{ fontWeight: 700, color: 'var(--gold)' }}>2/3</span>
            </div>
            <div className="progress-wrap"><div className="progress-fill gold" style={{ width: '67%' }}></div></div>
          </div>
          <div>
            <div className="flex-between" style={{ fontSize: '12px', marginBottom: '5px' }}>
              <span><strong>BEE</strong></span><span style={{ fontWeight: 700, color: 'var(--red)' }}>1/2</span>
            </div>
            <div className="progress-wrap"><div className="progress-fill red" style={{ width: '50%' }}></div></div>
          </div>
        </div>
      </div>

      {/* Distribusi Capaian */}
      <div className="card">
        <div className="card-title mb-12">Distribusi Capaian</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '130px', padding: '0 8px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px', marginTop: 'auto' }}>18</div>
            <div style={{ background: 'var(--navy)', width: '100%', height: '90%', borderRadius: '5px 5px 0 0', opacity: 0.9 }}></div>
            <div style={{ fontSize: '9px', color: 'var(--text3)', marginTop: '5px', textAlign: 'center' }}>Jurnal</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--red)', marginBottom: '4px', marginTop: 'auto' }}>11</div>
            <div style={{ background: 'var(--red)', width: '100%', height: '61%', borderRadius: '5px 5px 0 0', opacity: 0.85 }}></div>
            <div style={{ fontSize: '9px', color: 'var(--text3)', marginTop: '5px', textAlign: 'center' }}>Prosiding</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--teal)', marginBottom: '4px', marginTop: 'auto' }}>7</div>
            <div style={{ background: 'var(--teal)', width: '100%', height: '39%', borderRadius: '5px 5px 0 0', opacity: 0.85 }}></div>
            <div style={{ fontSize: '9px', color: 'var(--text3)', marginTop: '5px', textAlign: 'center' }}>Hibah</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold)', marginBottom: '4px', marginTop: 'auto' }}>4</div>
            <div style={{ background: 'var(--gold)', width: '100%', height: '22%', borderRadius: '5px 5px 0 0', opacity: 0.9 }}></div>
            <div style={{ fontSize: '9px', color: 'var(--text3)', marginTop: '5px', textAlign: 'center' }}>Paten</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#5A5A8A', marginBottom: '4px', marginTop: 'auto' }}>8</div>
            <div style={{ background: '#5A5A8A', width: '100%', height: '44%', borderRadius: '5px 5px 0 0', opacity: 0.7 }}></div>
            <div style={{ fontSize: '9px', color: 'var(--text3)', marginTop: '5px', textAlign: 'center' }}>Abdimas</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#C0571A', marginBottom: '4px', marginTop: 'auto' }}>12</div>
            <div style={{ background: '#C0571A', width: '100%', height: '67%', borderRadius: '5px 5px 0 0', opacity: 0.8 }}></div>
            <div style={{ fontSize: '9px', color: 'var(--text3)', marginTop: '5px', textAlign: 'center' }}>Pelatihan</div>
          </div>
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text3)', textAlign: 'center' }}>Semester Genap 2024/2025</div>
      </div>
    </div>
  );
}
