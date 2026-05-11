import React from 'react';
import { Pencil, Trash2, Calendar, Users, Wallet, CheckCircle, Clock, AlertCircle, ExternalLink } from 'lucide-react';

export default function PelatihanList({ events, canEdit, onEdit, onDelete }) {
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

  const getStatusBadge = (status) => {
    if (status === 'terlaksana') return <span className="p-status done"><CheckCircle size={14} /> Terlaksana</span>;
    if (status === 'direncanakan') return <span className="p-status planned"><Clock size={14} /> Direncanakan</span>;
    return <span className="p-status canceled"><AlertCircle size={14} /> Dibatalkan</span>;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="modern-list-container">
      {events.map(event => {
        const type = getJenisStyle(event.jenis);
        return (
          <div key={event.id} className="modern-list-item card animate-slide-up">
            <div className="item-left-accent" style={{ backgroundColor: type.color }}></div>
            
            <div className="item-content">
              <div className="item-header-row">
                <div className="item-identity">
                  <div className="item-type" style={{ color: type.color }}>{type.label}</div>
                  <h4 className="item-title">{event.judul}</h4>
                  <div className="item-subtitle">{event.penyelenggara} • {event.topik || 'Umum'}</div>
                </div>
                <div className="item-badges">
                  {getStatusBadge(event.status)}
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
                  <span>{event.estimasi_biaya ? `Rp ${parseFloat(event.estimasi_biaya).toLocaleString('id-ID')}jt` : 'Tanpa Biaya'}</span>
                </div>
              </div>
            </div>

            <div className="item-actions">
              {canEdit ? (
                <>
                  <button className="item-btn edit" onClick={() => onEdit(event)}>
                    <Pencil size={18} />
                  </button>
                  <button className="item-btn delete" onClick={() => onDelete(event.id)}>
                    <Trash2 size={18} />
                  </button>
                </>
              ) : (
                <div className="item-view-only">
                  <ExternalLink size={18} opacity={0.3} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
