import React from 'react';

export default function MembersTable() {
  return (
    <div className="card">
      <div className="flex-between mb-12">
        <div>
          <div className="card-title">Status Input Anggota</div>
          <div className="card-sub">Monitoring kelengkapan capaian seluruh dosen</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-outline btn-sm">Lihat Semua</button>
          <button className="btn btn-primary btn-sm">📤 Kirim Reminder</button>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nama Dosen</th><th>Sub-KK</th>
              <th>Publikasi</th><th>Hibah</th><th>Paten</th>
              <th>Abdimas</th><th>Pelatihan</th><th>Status</th><th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)' }}>Mohamad Yani</div><div style={{ fontSize: '10px', color: 'var(--text3)' }}>Ketua Sub-KK</div></td>
              <td><span className="tag tag-navy">CORES</span></td>
              <td><strong>3</strong></td><td><strong>1</strong></td><td>—</td><td><strong>2</strong></td><td><strong>3</strong></td>
              <td><span className="dot dot-green"></span><span style={{ fontSize: '11px', color: '#27AE60', fontWeight: 600 }}>Lengkap</span></td>
              <td><button className="btn btn-ghost btn-sm">Edit</button></td>
            </tr>
            <tr>
              <td><div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)' }}>Dr. Susijanto T.R.</div></td>
              <td><span className="tag tag-navy">CORES</span></td>
              <td><strong>2</strong></td><td><strong>1</strong></td><td><strong>1</strong></td><td><strong>1</strong></td><td><strong>2</strong></td>
              <td><span className="dot dot-green"></span><span style={{ fontSize: '11px', color: '#27AE60', fontWeight: 600 }}>Lengkap</span></td>
              <td><button className="btn btn-ghost btn-sm">Detail</button></td>
            </tr>
            <tr>
              <td><div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)' }}>Rifki Dwi Putranto</div></td>
              <td><span className="tag tag-teal">PORSCE</span></td>
              <td><strong>1</strong></td><td><strong>1</strong></td><td>—</td><td><strong>1</strong></td><td>—</td>
              <td><span className="dot dot-amber"></span><span style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 600 }}>Parsial</span></td>
              <td><button className="btn btn-outline btn-sm" style={{ color: 'var(--gold)', borderColor: 'var(--gold)' }}>Ingatkan</button></td>
            </tr>
            <tr>
              <td><div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)' }}>Nilla Rachmaningrum</div></td>
              <td><span className="tag tag-gray">COMMET</span></td>
              <td>—</td><td>—</td><td>—</td><td>—</td><td>—</td>
              <td><span className="dot dot-red"></span><span style={{ fontSize: '11px', color: 'var(--red)', fontWeight: 600 }}>Belum Input</span></td>
              <td><button className="btn btn-red btn-sm">Ingatkan</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
