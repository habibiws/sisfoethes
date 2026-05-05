import React from 'react';

export default function PelatihanEventCard({ event, canEdit }) {
  const getBadgeColor = (type) => {
    if (type === 'Workshop') return { bg: '#E0E7FF', text: '#3730A3' };
    if (type === 'Sertifikasi') return { bg: '#FCE7F3', text: '#9D174D' };
    return { bg: '#F1F5F9', text: '#475569' };
  };

  const badge = getBadgeColor(event.type);

  return (
    <div className="event-card">
      <div className="event-header">
        <div>
          <div className="event-title">{event.title}</div>
          <div className="event-org">{event.organizer}</div>
        </div>
        <span 
          className="event-type-badge" 
          style={{ backgroundColor: badge.bg, color: badge.text }}
        >
          {event.type}
        </span>
      </div>
      <div className="event-body">
        <div className="event-field">
          <div className="event-field-label">Topik</div>
          <div className="event-field-val">{event.topic}</div>
        </div>
        <div className="event-field">
          <div className="event-field-label">Tanggal</div>
          <div className="event-field-val">{event.date}</div>
        </div>
        <div className="event-field">
          <div className="event-field-label">Status</div>
          <div className="event-field-val" style={{ color: event.status === 'Terlaksana' ? 'var(--teal)' : 'var(--navy)' }}>
            {event.status}
          </div>
        </div>
      </div>
      <div className="event-footer">
        <div className="event-peserta">
          <strong>{event.pesertaCount}</strong> Peserta Terdaftar
        </div>
        {canEdit && (
          <div className="event-actions">
            <button className="btn btn-ghost btn-sm">✏️</button>
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }}>🗑️</button>
          </div>
        )}
      </div>
    </div>
  );
}
