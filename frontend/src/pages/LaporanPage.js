import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import LaporanStats from '../components/laporan/LaporanStats';
import LaporanFilter from '../components/laporan/LaporanFilter';
import LaporanTable from '../components/laporan/LaporanTable';
import LaporanExportGrid from '../components/laporan/LaporanExportGrid';
import './LaporanPage.css';

export default function LaporanPage() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <Layout 
      title="Laporan & Distribusi Capaian" 
      subtitle="Rekap seluruh anggota KK ETHES · Hak Akses: Ketua KK & Ketua Sub-KK"
      headerActions={
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-outline">🖨️ Cetak</button>
          <button className="btn btn-primary">📥 Export Semua</button>
        </div>
      }
    >
      <div className="laporan-container">
        <LaporanStats />
        <LaporanFilter />
        <LaporanTable onShowDetail={(user) => setSelectedUser(user)} />
        <LaporanExportGrid />

        {selectedUser && (
          <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
            <div className="modal-content card" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
              <div className="modal-header">
                <h3 className="modal-title">Detail Capaian: {selectedUser.name}</h3>
                <button className="btn-close" onClick={() => setSelectedUser(null)}>✕</button>
              </div>
              <div style={{ padding: '20px' }}>
                <p style={{ color: 'var(--text3)', fontSize: '14px', textAlign: 'center' }}>
                  Data rincian capaian untuk <strong>{selectedUser.name}</strong> akan dimuat di sini.
                  Menampilkan daftar Publikasi, Hibah, dan HKI yang telah diverifikasi.
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
                  <button className="btn btn-ghost" onClick={() => setSelectedUser(null)}>Tutup</button>
                  <button className="btn btn-primary">📄 Download Laporan PDF</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
