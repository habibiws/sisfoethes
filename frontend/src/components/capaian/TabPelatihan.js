import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';
import useModalStore from '../../store/modalStore';

export default function TabPelatihan() {
  const { user } = useAuthStore();
  const { showAlert } = useModalStore();
  const [events, setEvents] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(null); // to store event_id being processed

  const fetchData = async () => {
    try {
      const [eventsRes, partsRes] = await Promise.all([
        api.get('/pelatihan-events'),
        api.get('/pelatihan-participations')
      ]);
      setEvents(eventsRes.data);
      setParticipations(partsRes.data.map(p => p.pelatihan_event_id));
    } catch (err) {
      console.error('Error fetching pelatihan data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggle = async (eventId, isParticipating) => {
    setIsProcessing(eventId);
    try {
      if (isParticipating) {
        // Un-join
        await api.post(`/pelatihan-participations/${eventId}`, { _method: 'DELETE' });
        setParticipations(prev => prev.filter(id => id !== eventId));
      } else {
        // Join
        await api.post('/pelatihan-participations', {
          pelatihan_event_id: eventId,
          status_keikutsertaan: 'hadir'
        });
        setParticipations(prev => [...prev, eventId]);
      }
    } catch (err) {
      showAlert('Gagal memperbarui status keikutsertaan.', 'Error', 'error');
    } finally {
      setIsProcessing(null);
    }
  };

  const formatJenis = (jenis) => {
    const map = {
      'workshop': 'Workshop',
      'sertifikasi': 'Sertifikasi',
      'pelatihan': 'Pelatihan',
      'webinar': 'Webinar',
      'seminar': 'Seminar'
    };
    return map[jenis] || jenis;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const canManageEvents = user?.role === 'admin' || user?.role === 'ketua_kk' || user?.role === 'ketua_sub_kk';

  return (
    <div className="tab-pane animate-fade-in">
      <div className="flex-between mb-16">
        <h3 className="section-title">Event Pelatihan & Sertifikasi</h3>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>Memuat data event...</div>
      ) : events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>
          Belum ada event pelatihan yang terdaftar di sistem.
        </div>
      ) : (
        <div className="entry-list">
          {events.map(event => {
            const isParticipating = participations.includes(event.id);
            const isBusy = isProcessing === event.id;

            return (
              <div key={event.id} className="entry-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="entry-icon" style={{ background: '#E8EAF6', color: '#3F51B5' }}>🎓</div>
                  <div className="entry-body">
                    <div className="entry-title">{event.judul}</div>
                    <div className="entry-meta" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div>Penyelenggara: <strong style={{color:'var(--navy-text)'}}>{event.penyelenggara}</strong></div>
                      <div>
                        Jenis: <span style={{color:'#3F51B5', fontWeight:600}}>{formatJenis(event.jenis)}</span>
                        {event.topik && <span> · Topik: {event.topik}</span>}
                      </div>
                      <div>Tanggal: {formatDate(event.tanggal_mulai)} {event.tanggal_selesai && `- ${formatDate(event.tanggal_selesai)}`}</div>
                      <div>Status Event: <span style={{textTransform:'capitalize'}}>{event.status}</span></div>
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  marginTop: '16px', 
                  paddingTop: '16px', 
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ fontSize: '13px', color: isParticipating ? '#2E7D32' : 'var(--text3)', fontWeight: isParticipating ? 600 : 400 }}>
                    {isParticipating ? '✓ Status: Terdaftar / Hadir' : 'Belum ditandai sebagai peserta'}
                  </div>
                  
                  <button 
                    className={`btn ${isParticipating ? 'btn-outline' : 'btn-primary'} btn-sm`}
                    onClick={() => handleToggle(event.id, isParticipating)}
                    disabled={isBusy}
                    style={isParticipating ? { borderColor: '#2E7D32', color: '#2E7D32' } : {}}
                  >
                    {isBusy ? 'Memproses...' : (isParticipating ? 'Batal Ikut' : '✅ Tandai Saya Ikut')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {canManageEvents && (
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--text3)' }}>
          Ingin menambahkan event pelatihan baru? <Link to="/pelatihan" style={{ color: 'var(--navy)', fontWeight: 600, textDecoration: 'underline' }}>Kelola di halaman Pelatihan →</Link>
        </div>
      )}
    </div>
  );
}
