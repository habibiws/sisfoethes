import React from 'react';

export default function ProfileInfo({ user, onEdit }) {
  const formatRole = (role) => {
    if (role === 'admin') return 'Admin';
    if (role === 'ketua_kk') return 'Ketua KK';
    if (role === 'ketua_sub_kk') return 'Ketua Sub-KK';
    return 'Anggota Biasa';
  };

  return (
    <div className="profile-details">
      {user?.role !== 'admin' ? (
        <>
          <div className="form-grid mb-16">
            <div className="form-group">
              <label>NIDN</label>
              <div className="info-box">{user?.nidn || '-'}</div>
            </div>
            <div className="form-group">
              <label>Program Studi</label>
              <div className="info-box">{user?.prodi || '-'}</div>
            </div>
          </div>

          <div className="form-grid mb-16">
            <div className="form-group">
              <label>Sub-Kelompok Keahlian</label>
              <div className="info-box">{user?.sub_kk?.name || '-'}</div>
            </div>
            <div className="form-group">
              <label>Role</label>
              <div className="info-box">{formatRole(user?.role)}</div>
            </div>
          </div>

          <div className="form-group mb-16">
            <label>NIP</label>
            <div className="info-box">{user?.nip || <span className="text-muted">Belum diisi</span>}</div>
          </div>
          
          <div className="form-grid mb-16">
            <div className="form-group">
              <label>Center of Excellence (CoE)</label>
              <div className="info-box">{user?.coe || <span className="text-muted">Belum diisi</span>}</div>
            </div>
            <div className="form-group">
              <label>Jabatan Fungsional</label>
              <div className="info-box">{user?.jabatan_fungsional || <span className="text-muted">Belum diisi</span>}</div>
            </div>
          </div>
        </>
      ) : (
        <div className="form-group mb-16">
          <label>Role</label>
          <div className="info-box">{formatRole(user?.role)}</div>
        </div>
      )}

      {onEdit && (
        <div className="btn-row">
          <button className="btn btn-primary" onClick={onEdit}>Edit Profil</button>
        </div>
      )}
    </div>
  );
}
