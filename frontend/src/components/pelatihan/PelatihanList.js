import React, { useState } from 'react';
import { Pencil, Trash2, Calendar, Users, Wallet, CheckCircle, Clock, Info, ChevronDown, ChevronUp } from 'lucide-react';

export default function PelatihanList({ events, canEdit, onEdit, onDelete }) {
  const [expandedId, setExpandedId] = useState(null);

  const getJenisStyle = (jenis) => {
    const map = {
      'workshop': { label: 'Workshop', color: '#6366F1' },
      'sertifikasi': { label: 'Sertifikasi', color: '#EC4899' },
      'pelatihan': { label: 'Pelatihan', color: '#F59E0B' },
      'webinar': { label: 'Webinar', color: '#10B981' },
      'seminar': { label: 'Seminar', color: '#64748B' }
    };
    return map[jenis] || { label: jenis, color: '#64748B' };
  };

  const getComputedStatus = (event) => {
    const endDate = event.tanggal_selesai || event.tanggal_mulai;
    if (!endDate) return 'direncanakan';
    return new Date(endDate) < new Date() ? 'terlaksana' : 'direncanakan';
  };

  const getStatusBadge = (event) => {
    const status = getComputedStatus(event);
    if (status === 'terlaksana') {
      return <span className="p-status done"><CheckCircle size={14} /> Terlaksana</span>;
    }
    return <span className="p-status planned"><Clock size={14} /> Direncanakan</span>;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const toggleExpand = (id, e) => {
    e.stopPropagation();
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="modern-list-container">
      {events.map(event => {
        const type = getJenisStyle(event.jenis);
        const isExpanded = expandedId === event.id;
        const status = getComputedStatus(event);

        return (
          <div key={event.id} className={`modern-list-item card animate-slide-up ${isExpanded ? 'expanded' : ''}`} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', alignItems: 'stretch', width: '100%' }}>
              <div className="item-left-accent" style={{ backgroundColor: type.color }}></div>
              
              <div className="item-content" style={{ cursor: 'pointer' }} onClick={(e) => toggleExpand(event.id, e)}>
                <div className="item-header-row">
                  <div className="item-identity">
                    <div className="item-type" style={{ color: type.color }}>{type.label}</div>
                    <h4 className="item-title">{event.judul}</h4>
                    <div className="item-subtitle">{event.penyelenggara} • {event.topik || 'Umum'}</div>
                  </div>
                  <div className="item-badges" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {getStatusBadge(event)}
                  </div>
                </div>

                <div className="item-details-row">
                  <div className="item-detail">
                    <Calendar size={16} />
                    <span>{formatDate(event.tanggal_mulai)}</span>
                  </div>
                  <div className="item-detail">
                    <Users size={16} />
                    <span><strong>{event.participations_count || 0}</strong> Peserta</span>
                  </div>
                  <div className="item-detail">
                    <Wallet size={16} />
                    <span>{event.estimasi_biaya ? `Rp ${parseFloat(event.estimasi_biaya).toLocaleString('id-ID')}` : 'Tanpa Biaya'}</span>
                  </div>
                </div>
              </div>

              <div className="item-actions">
                <button className="item-btn detail" onClick={(e) => toggleExpand(event.id, e)} title="Detail Informasi">
                  <Info size={18} />
                </button>
                {canEdit && (
                  <>
                    <button className="item-btn edit" onClick={() => onEdit(event)} title="Edit Event">
                      <Pencil size={18} />
                    </button>
                    <button className="item-btn delete" onClick={() => onDelete(event.id)} title="Hapus Event">
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {isExpanded && (
              <div className="item-expanded-detail animate-fade-in" style={{ padding: '20px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '2px', fontWeight: 600 }}>Judul Lengkap</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy-text)' }}>{event.judul}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '2px', fontWeight: 600 }}>Penyelenggara</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy-text)' }}>{event.penyelenggara}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '2px', fontWeight: 600 }}>Kategori & Topik</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy-text)' }}>{type.label} ({event.topik || 'Umum'})</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '2px', fontWeight: 600 }}>Waktu Pelaksanaan</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy-text)' }}>
                      {formatDate(event.tanggal_mulai)} {event.tanggal_selesai && `s/d ${formatDate(event.tanggal_selesai)}`}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '2px', fontWeight: 600 }}>Estimasi Biaya</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy-text)' }}>
                      {event.estimasi_biaya ? `Rp ${parseFloat(event.estimasi_biaya).toLocaleString('id-ID')}` : 'Tanpa Biaya'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '2px', fontWeight: 600 }}>Status Keikutsertaan</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy-text)' }}>
                      {event.participations_count || 0} Dosen terdaftar sebagai peserta
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
  );
}
