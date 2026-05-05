import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import PelatihanTabs from '../components/pelatihan/PelatihanTabs';
import PelatihanSummary from '../components/pelatihan/PelatihanSummary';
import PelatihanEventCard from '../components/pelatihan/PelatihanEventCard';
import useAuthStore from '../store/authStore';
import './PelatihanPage.css';

const DUMMY_DATA = {
  1: {
    summary: { eventCount: 3, totalPeserta: 103, totalBiaya: 47.5, completed: 2 },
    events: [
      { id: 1, title: 'Workshop Computer Vision dengan OpenCV', organizer: 'NVIDIA DLI', type: 'Workshop', topic: 'Image Processing', date: '15-17 Jan 2025', status: 'Terlaksana', pesertaCount: 45 },
      { id: 2, title: 'Sertifikasi PLC Siemens Level 1', organizer: 'Siemens Indonesia', type: 'Sertifikasi', topic: 'PLC', date: '10-14 Feb 2025', status: 'Terlaksana', pesertaCount: 28 },
      { id: 3, title: 'Short Course LLM for Academic', organizer: 'OpenAI / Tel-U', type: 'Pelatihan', topic: 'LLM', date: '05-08 Mar 2025', status: 'Direncanakan', pesertaCount: 30 },
    ]
  },
  2: {
    summary: { eventCount: 2, totalPeserta: 50, totalBiaya: 20, completed: 0 },
    events: [
      { id: 4, title: 'Webinar Autonomous Intelligent System', organizer: 'IEEE Indonesia', type: 'Webinar', topic: 'Robotics', date: '12 Apr 2025', status: 'Direncanakan', pesertaCount: 25 },
      { id: 5, title: 'Pelatihan ANSYS Simulasi Energi', organizer: 'ANSYS Inc', type: 'Pelatihan', topic: 'Simulation', date: '20-22 Mei 2025', status: 'Direncanakan', pesertaCount: 25 },
    ]
  },
  3: {
    summary: { eventCount: 1, totalPeserta: 15, totalBiaya: 10, completed: 0 },
    events: [
      { id: 6, title: 'Workshop Internet of Things', organizer: 'Antares', type: 'Workshop', topic: 'IoT', date: '10 Jul 2025', status: 'Direncanakan', pesertaCount: 15 },
    ]
  },
  4: {
    summary: { eventCount: 0, totalPeserta: 0, totalBiaya: 0, completed: 0 },
    events: []
  }
};

export default function PelatihanPage() {
  const { user } = useAuthStore();
  const [activeTW, setActiveTW] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const canEdit = user?.role === 'admin' || user?.role === 'ketua_kk' || user?.role === 'ketua_sub_kk';

  return (
    <Layout 
      title="Kelola Pelatihan KK" 
      subtitle={`Hak Akses: ${user?.name || 'User'} · Tahun 2025`}
      headerActions={
        canEdit && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Tutup Form' : '+ Tambah Event Pelatihan'}
          </button>
        )
      }
    >
      <div className="pelatihan-container">
        <PelatihanTabs activeTW={activeTW} onSelect={setActiveTW} />

        <div className="tw-content-section">
          <PelatihanSummary data={DUMMY_DATA[activeTW].summary} />

          {showForm && (
            <div className="card mb-20 animate-slide-down">
              <div style={{ fontWeight: 700, marginBottom: '15px' }}>Form Tambah Event - TW {activeTW}</div>
              <p style={{ color: 'var(--text3)', fontSize: '13px' }}>Fitur pengisian form sedang dihubungkan ke backend.</p>
            </div>
          )}

          <div className="event-grid">
            {DUMMY_DATA[activeTW].events.length > 0 ? (
              DUMMY_DATA[activeTW].events.map(event => (
                <PelatihanEventCard key={event.id} event={event} canEdit={canEdit} />
              ))
            ) : (
              <div className="empty-state card">
                <div style={{ fontSize: '30px', marginBottom: '10px' }}>📅</div>
                <div style={{ fontWeight: 600 }}>Belum ada event direncanakan</div>
                <div style={{ color: 'var(--text3)', fontSize: '13px' }}>Triwulan ini masih kosong dari agenda pelatihan.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
