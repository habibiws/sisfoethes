import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ProfileHeader({ user, isEditing }) {
  const isProfileIncomplete = (!user?.nip || !user?.coe || !user?.jabatan_fungsional) && user?.role !== 'admin';

  return (
    <div className="profile-header-card">
      <div className="profile-avatar-large">
        {user?.name ? user.name.substring(0, 2).toUpperCase() : '??'}
      </div>
      <div className="profile-header-info">
        <h2 className="profile-name">{user?.name || 'Tidak ada nama'}</h2>
        <div className="profile-email">{user?.email}</div>
        {isProfileIncomplete && !isEditing && (
          <div className="profile-alert-badge">
            <AlertCircle size={14} /> Profil Belum Lengkap
          </div>
        )}
      </div>
    </div>
  );
}
