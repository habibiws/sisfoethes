import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
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
  const [expandedId, setExpandedId] = useState(null);
  const [selectedYear, setSelectedYear] = useState('all');

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

  const years = [...new Set(events.map(e => parseInt(e.tahun)))].filter(Boolean).sort((a, b) => b - a);

  const filteredEvents = events.filter(e => {
    return selectedYear === 'all' || parseInt(e.tahun) === parseInt(selectedYear);
  });

  return (
    <div className="tab-pane animate-fade-in">
      <div className="flex-between mb-16" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <h3 className="section-title" style={{ margin: 0 }}>Event Pelatihan & Sertifikasi</h3>
        
        {/* Year Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            style={{ 
              padding: '6px 12px', 
              borderRadius: '6px', 
              border: '1px solid var(--border)',
              background: 'white',
              fontSize: '13px',
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
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>Memuat data event...</div>
      ) : filteredEvents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>
          {selectedYear === 'all' ? 'Belum ada event pelatihan yang terdaftar di sistem.' : `Tidak ada event pelatihan di tahun ${selectedYear}.`}
        </div>
      ) : (
        <div className="entry-list">
          {filteredEvents.map(event => {
            const isParticipating = participations.includes(event.id);
            const isBusy = isProcessing === event.id;
            const isExpanded = expandedId === event.id;

            return (
              <div 
                key={event.id} 
                className={`entry-item ${isExpanded ? 'expanded' : ''}`}
                style={{ flexDirection: 'column', alignItems: 'stretch', cursor: 'pointer' }} 
                onClick={() => setExpandedId(isExpanded ? null : event.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '16px' }}>
                  <div className="entry-body">
                    <div className="entry-title">{event.judul}</div>
                    <div className="entry-meta" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div>Penyelenggara: <strong style={{color:'var(--navy-text)'}}>{event.penyelenggara}</strong></div>
                      <div>
                        Jenis: <span style={{color:'#3F51B5', fontWeight:600}}>{formatJenis(event.jenis)}</span>
                        {event.topik && <span> · Topik: {event.topik}</span>}
                      </div>
                      <div>Tanggal: {formatDate(event.tanggal_mulai)} {event.tanggal_selesai && `- ${formatDate(event.tanggal_selesai)}`}</div>
                    </div>
                  </div>

                  {/* Info Icon Button on the Right */}
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isExpanded ? 'var(--navy)' : 'var(--text3)',
                      cursor: 'pointer',
                      padding: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      transition: 'all 0.2s',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(isExpanded ? null : event.id);
                    }}
                    title="Detail Informasi"
                  >
                    <Info size={18} />
                  </button>
                </div>
                
                <div style={{ 
                  marginTop: '16px', 
                  paddingTop: '16px', 
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }} onClick={e => e.stopPropagation()}>
                  <div style={{ fontSize: '13px', color: isParticipating ? '#2E7D32' : 'var(--text3)', fontWeight: isParticipating ? 600 : 400 }}>
                    {isParticipating ? '✓ Status: Terdaftar / Hadir' : 'Belum ditandai sebagai peserta'}
                  </div>
                  
                  <button 
                    className={`btn ${isParticipating ? 'btn-outline' : 'btn-primary'} btn-sm`}
                    onClick={() => handleToggle(event.id, isParticipating)}
                    disabled={isBusy}
                    style={isParticipating ? { borderColor: '#2E7D32', color: '#2E7D32' } : {}}
                  >
                    {isBusy ? 'Memproses...' : (isParticipating ? 'Batal Ikut' : 'Tandai Saya Ikut')}
                  </button>
                </div>

                {isExpanded && (
                  <div className="entry-detail animate-fade-in" onClick={e => e.stopPropagation()} style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '2px', fontWeight: 600 }}>Judul Event</div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy-text)' }}>{event.judul}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '2px', fontWeight: 600 }}>Penyelenggara</div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy-text)' }}>{event.penyelenggara}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '2px', fontWeight: 600 }}>Jenis Event</div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy-text)' }}>{formatJenis(event.jenis)}</div>
                      </div>
                      {event.topik && (
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '2px', fontWeight: 600 }}>Topik</div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy-text)' }}>{event.topik}</div>
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '2px', fontWeight: 600 }}>Tanggal Mulai</div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy-text)' }}>{formatDate(event.tanggal_mulai)}</div>
                      </div>
                      {event.tanggal_selesai && (
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '2px', fontWeight: 600 }}>Tanggal Selesai</div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy-text)' }}>{formatDate(event.tanggal_selesai)}</div>
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '2px', fontWeight: 600 }}>Estimasi Biaya</div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy-text)' }}>
                          {event.estimasi_biaya ? `Rp ${parseFloat(event.estimasi_biaya).toLocaleString('id-ID')}` : 'Tanpa Biaya'}
                        </div>
                      </div>
                    </div>
                    {event.keterangan && (
                      <div style={{ marginTop: '12px', borderTop: '1px dashed var(--border)', paddingTop: '12px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 600 }}>Keterangan / Informasi Tambahan</div>
                        <div style={{ fontSize: '13px', color: 'var(--text2)', whiteSpace: 'pre-line', lineHeight: '1.6' }}>{event.keterangan}</div>
                      </div>
                    )}
                  </div>
                )}
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
