import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import PelatihanTabs from '../components/pelatihan/PelatihanTabs';
import PelatihanSummary from '../components/pelatihan/PelatihanSummary';
import PelatihanList from '../components/pelatihan/PelatihanList';
import PelatihanFormModal from '../components/pelatihan/PelatihanFormModal';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import useModalStore from '../store/modalStore';
import { Calendar, ArrowDownUp } from 'lucide-react';
import './PelatihanPage.css';

export default function PelatihanPage() {
  const { user } = useAuthStore();
  const { showAlert, showConfirm } = useModalStore();
  
  // Filter & Sort States
  const [activeTW, setActiveTW] = useState(1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [sortBy, setSortBy] = useState('tanggal_mulai');
  const [sortOrder, setSortOrder] = useState('desc');

  // Data States
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

  // Force activeTW to 'all' if selectedYear is 'all'
  useEffect(() => {
    if (selectedYear === 'all' && activeTW !== 'all') {
      setActiveTW('all');
    }
  }, [selectedYear, activeTW]);

  const canEdit = ['admin', 'ketua_kk', 'ketua_sub_kk'].includes(user?.role);

  // Get unique years from data for filter
  const years = [...new Set(events.map(e => parseInt(e.tahun)))].sort((a, b) => b - a);
  if (!years.includes(new Date().getFullYear())) {
    years.push(new Date().getFullYear());
    years.sort((a, b) => b - a);
  }

  const isEventCompleted = (e) => {
    const endDate = e.tanggal_selesai || e.tanggal_mulai;
    if (!endDate) return false;
    return new Date(endDate) < new Date();
  };

  // Filter events by selected Year and TW
  const filteredEvents = events.filter(e => {
    const yearMatch = selectedYear === 'all' || parseInt(e.tahun) === parseInt(selectedYear);
    const twMatch = activeTW === 'all' || parseInt(e.triwulan) === parseInt(activeTW);
    return yearMatch && twMatch;
  });

  // Sort the filtered events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'tanggal_mulai') {
      comparison = new Date(a.tanggal_mulai) - new Date(b.tanggal_mulai);
    } else if (sortBy === 'judul') {
      comparison = a.judul.localeCompare(b.judul);
    } else if (sortBy === 'status') {
      const statusA = isEventCompleted(a) ? 1 : 0;
      const statusB = isEventCompleted(b) ? 1 : 0;
      comparison = statusA - statusB;
    } else if (sortBy === 'estimasi_biaya') {
      comparison = (parseFloat(a.estimasi_biaya) || 0) - (parseFloat(b.estimasi_biaya) || 0);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Calculate summary for active filters
  const summary = {
    eventCount: filteredEvents.length,
    totalPeserta: filteredEvents.reduce((acc, curr) => acc + (curr.participations_count || 0), 0),
    totalBiaya: filteredEvents.reduce((acc, curr) => acc + parseFloat(curr.estimasi_biaya || 0), 0),
    completed: filteredEvents.filter(isEventCompleted).length
  };

  // Get counts for all TWs based on selected YEAR
  const twCounts = events.filter(e => selectedYear === 'all' || parseInt(e.tahun) === parseInt(selectedYear)).reduce((acc, curr) => {
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
      async () => {
        try {
          await api.post(`/pelatihan-events/${id}`, { _method: 'DELETE' });
          showAlert('Event berhasil dihapus.', 'Sukses', 'success');
          fetchData();
        } catch (err) {
          showAlert('Gagal menghapus event.', 'Error', 'error');
        }
      },
      'Konfirmasi Hapus'
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

  const getSubtitleText = () => {
    const twText = activeTW === 'all' ? 'Tahun Penuh' : `Triwulan ${activeTW}`;
    const yearText = selectedYear === 'all' ? 'Semua Tahun' : `Tahun ${selectedYear}`;
    return `Kelompok Keahlian EEATS · ${twText} · ${yearText}`;
  };

  return (
    <Layout 
      title="Kelola Pelatihan KK" 
      subtitle={getSubtitleText()}
      headerActions={
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select 
            className="year-selector"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '8px', 
              border: '1px solid var(--border)',
              background: 'white',
              fontWeight: 600,
              color: 'var(--navy-text)',
              cursor: 'pointer'
            }}
          >
            <option value="all">Semua Tahun</option>
            {years.map(y => (
              <option key={y} value={y}>Tahun {y}</option>
            ))}
          </select>
          {canEdit && !isModalOpen && (
            <button className="btn btn-primary" onClick={handleAdd}>
              + Tambah Event Pelatihan
            </button>
          )}
        </div>
      }
    >
      <div className="pelatihan-container">
        {!isModalOpen && (
          <PelatihanTabs 
            activeTW={activeTW} 
            onSelect={setActiveTW} 
            counts={twCounts} 
            disabledAllTW={selectedYear === 'all'} 
          />
        )}

        <div className="tw-content-section animate-fade-in">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text3)' }}>Memuat data...</div>
          ) : isModalOpen ? (
            <PelatihanFormModal 
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSave}
              initialData={editingEvent}
              currentTW={activeTW}
            />
          ) : (
            <>
              <PelatihanSummary data={summary} />

              {sortedEvents.length > 0 ? (
                <>
                  <div className="list-header-bar">
                    <h3 className="list-header-title">Daftar Event</h3>
                    <div className="sort-controls">
                      <span style={{ fontSize: '13px', color: 'var(--text3)' }}>Urutkan:</span>
                      <select 
                        className="sort-select" 
                        value={sortBy} 
                        onChange={e => setSortBy(e.target.value)}
                      >
                        <option value="tanggal_mulai">Tanggal</option>
                        <option value="status">Status</option>
                        <option value="judul">Judul</option>
                        <option value="estimasi_biaya">Biaya</option>
                      </select>
                      <button 
                        className="sort-order-btn" 
                        onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                        title={sortOrder === 'asc' ? "Naik (Ascending)" : "Turun (Descending)"}
                      >
                        <ArrowDownUp size={16} style={{ transform: sortOrder === 'asc' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                      </button>
                    </div>
                  </div>
                  <PelatihanList 
                    events={sortedEvents} 
                    canEdit={canEdit} 
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </>
              ) : (
                <div className="empty-state card">
                  <div style={{ color: 'var(--navy)', opacity: 0.15, marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                    <Calendar size={48} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '18px', color: 'var(--navy-text)' }}>Belum ada event direncanakan</div>
                  <div style={{ color: 'var(--text3)', marginTop: '8px' }}>
                    Agenda pelatihan untuk filter ini masih kosong.
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
