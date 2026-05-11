import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import PelatihanTabs from '../components/pelatihan/PelatihanTabs';
import PelatihanSummary from '../components/pelatihan/PelatihanSummary';
import PelatihanList from '../components/pelatihan/PelatihanList';
import PelatihanFormModal from '../components/pelatihan/PelatihanFormModal';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import useModalStore from '../store/modalStore';
import './PelatihanPage.css';

export default function PelatihanPage() {
  const { user } = useAuthStore();
  const { showAlert, showConfirm } = useModalStore();
  const [activeTW, setActiveTW] = useState(1);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/pelatihan-events');
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
      showAlert('Gagal mengambil data pelatihan.', 'Error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const canEdit = ['admin', 'ketua_kk', 'ketua_sub_kk'].includes(user?.role);

  // Filter events by selected TW
  const filteredEvents = events.filter(e => parseInt(e.triwulan) === activeTW);

  // Calculate summary for active TW
  const summary = {
    eventCount: filteredEvents.length,
    totalPeserta: filteredEvents.reduce((acc, curr) => acc + (curr.participations_count || 0), 0),
    totalBiaya: filteredEvents.reduce((acc, curr) => acc + parseFloat(curr.estimasi_biaya || 0), 0),
    completed: filteredEvents.filter(e => e.status === 'terlaksana').length
  };

  // Get counts for all TWs
  const twCounts = events.reduce((acc, curr) => {
    const tw = curr.triwulan;
    acc[tw] = (acc[tw] || 0) + 1;
    return acc;
  }, {});

  const handleAdd = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    showConfirm(
      'Apakah Anda yakin ingin menghapus event ini? Semua data partisipasi juga akan terhapus.',
      'Konfirmasi Hapus',
      async () => {
        try {
          await api.post(`/pelatihan-events/${id}`, { _method: 'DELETE' });
          showAlert('Event berhasil dihapus.', 'Sukses', 'success');
          fetchData();
        } catch (err) {
          showAlert('Gagal menghapus event.', 'Error', 'error');
        }
      }
    );
  };

  const handleSave = async (formData) => {
    try {
      if (editingEvent) {
        await api.post(`/pelatihan-events/${editingEvent.id}`, { ...formData, _method: 'PUT' });
        showAlert('Event berhasil diperbarui.', 'Sukses', 'success');
      } else {
        await api.post('/pelatihan-events', formData);
        showAlert('Event baru berhasil ditambahkan.', 'Sukses', 'success');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showAlert('Gagal menyimpan data. Pastikan semua field terisi dengan benar.', 'Error', 'error');
    }
  };

  return (
    <Layout 
      title="Kelola Pelatihan KK" 
      subtitle={`Kelompok Keahlian ETHES · Tahun ${new Date().getFullYear()}`}
      headerActions={
        canEdit && (
          <button className="btn btn-primary" onClick={handleAdd}>
            + Tambah Event Pelatihan
          </button>
        )
      }
    >
      <div className="pelatihan-container">
        <PelatihanTabs activeTW={activeTW} onSelect={setActiveTW} counts={twCounts} />

        <div className="tw-content-section animate-fade-in">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text3)' }}>Memuat data...</div>
          ) : (
            <>
              <PelatihanSummary data={summary} />

              {filteredEvents.length > 0 ? (
                <PelatihanList 
                  events={filteredEvents} 
                  canEdit={canEdit} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ) : (
                <div className="empty-state card">
                  <div style={{ fontSize: '40px', marginBottom: '16px', opacity: 0.5 }}>📅</div>
                  <div style={{ fontWeight: 700, fontSize: '18px', color: 'var(--navy-text)' }}>Belum ada event direncanakan</div>
                  <div style={{ color: 'var(--text3)', marginTop: '8px' }}>
                    Triwulan ini masih kosong dari agenda pelatihan.
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <PelatihanFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingEvent}
        currentTW={activeTW}
      />
    </Layout>
  );
}
