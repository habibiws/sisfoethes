import React from 'react';
import { Pencil, Trash2, Calendar, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function PelatihanTable({ events, canEdit, onEdit, onDelete }) {
  const getJenisBadge = (jenis) => {
    const map = {
      'workshop': { label: 'Workshop', bg: '#E0E7FF', text: '#3730A3' },
      'sertifikasi': { label: 'Sertifikasi', bg: '#FCE7F3', text: '#9D174D' },
      'pelatihan': { label: 'Pelatihan', bg: '#FEF3C7', text: '#92400E' },
      'webinar': { label: 'Webinar', bg: '#D1FAE5', text: '#065F46' },
      'seminar': { label: 'Seminar', bg: '#F1F5F9', text: '#475569' }
    };
    const style = map[jenis] || { label: jenis, bg: '#F1F5F9', text: '#475569' };
    return (
      <span className="badge-inline" style={{ backgroundColor: style.bg, color: style.text }}>
        {style.label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    if (status === 'terlaksana') return <span className="status-pill success"><CheckCircle size={12} /> Terlaksana</span>;
    if (status === 'direncanakan') return <span className="status-pill info"><Clock size={12} /> Direncanakan</span>;
    return <span className="status-pill danger"><AlertCircle size={12} /> Dibatalkan</span>;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="compact-table-wrapper card">
      <table className="compact-table">
        <thead>
          <tr>
            <th>Event & Penyelenggara</th>
            <th>Jenis</th>
            <th>Tanggal</th>
            <th>Peserta</th>
            <th>Estimasi Biaya</th>
            <th>Status</th>
            {canEdit && <th style={{ textAlign: 'center' }}>Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.id}>
              <td>
                <div className="td-main">{event.judul}</div>
                <div className="td-sub">{event.penyelenggara}</div>
              </td>
              <td>{getJenisBadge(event.jenis)}</td>
              <td>
                <div className="td-date">
                  <Calendar size={14} style={{ marginRight: '4px', opacity: 0.6 }} />
                  {formatDate(event.tanggal_mulai)}
                </div>
              </td>
              <td>
                <div className="td-peserta">
                  <strong>{event.participations_count || 0}</strong>
                  <span> orang</span>
                </div>
              </td>
              <td>
                <div className="td-biaya">
                  {event.estimasi_biaya ? `Rp ${parseFloat(event.estimasi_biaya).toLocaleString('id-ID')}jt` : '-'}
                </div>
              </td>
              <td>{getStatusBadge(event.status)}</td>
              {canEdit && (
                <td>
                  <div className="td-actions">
                    <button className="btn-icon" onClick={() => onEdit(event)} title="Edit Event">
                      <Pencil size={16} />
                    </button>
                    <button className="btn-icon danger" onClick={() => onDelete(event.id)} title="Hapus Event">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
