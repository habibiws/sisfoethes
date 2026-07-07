import React from 'react';
import { User, Hash, BookOpen, Layers, Shield, Award, Briefcase, FileText } from 'lucide-react';

export default function ProfileInfo({ user, onEdit }) {
  const formatRole = (role) => {
    if (role === 'admin') return 'Admin';
    if (role === 'ketua_kk') return 'Ketua KK';
    if (role === 'ketua_sub_kk') return 'Ketua Sub-KK';
    return 'Anggota';
  };

  const getRoleTagClass = (role) => {
    if (role === 'admin') return 'tag tag-red';
    if (role === 'ketua_kk') return 'tag tag-navy';
    if (role === 'ketua_sub_kk') return 'tag tag-teal';
    return 'tag tag-gray';
  };

  return (
    <div className="profile-details">
      {user?.role !== 'admin' ? (
        <>
          {/* Section 1: Identitas Akademik */}
          <div className="profile-card">
            <div className="profile-section-title">
              <BookOpen size={16} /> Identitas Akademik
            </div>

            <div className="form-grid mb-16">
              <div className="info-field">
                <label><Hash size={15} /> NIDN</label>
                <div className="info-box readonly">{user?.nidn || '-'}</div>
              </div>
              <div className="info-field">
                <label><Briefcase size={15} /> Program Studi</label>
                <div className="info-box readonly">{user?.prodi || '-'}</div>
              </div>
            </div>

            <div className="form-grid mb-16">
              <div className="info-field">
                <label><Layers size={15} /> Sub-Kelompok Keahlian</label>
                <div className="info-box readonly">{user?.sub_kk?.name || '-'}</div>
              </div>
              <div className="info-field">
                <label><Shield size={15} /> Hak Akses / Role</label>
                <div style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
                  <span className={getRoleTagClass(user?.role)} style={{ fontSize: '13px', padding: '6px 12px' }}>
                    {formatRole(user?.role)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Data Profesional */}
          <div className="profile-card">
            <div className="profile-section-title">
              <Award size={16} /> Data Profesional
            </div>

            <div className="form-grid mb-16">
              <div className="info-field">
                <label><FileText size={15} /> NIP</label>
                <div className="info-box readonly">{user?.nip || <span className="text-muted">Belum diisi</span>}</div>
              </div>
              <div className="info-field">
                <label><User size={15} /> Center of Excellence (CoE)</label>
                <div className="info-box readonly">{user?.coe || <span className="text-muted">Belum diisi</span>}</div>
              </div>
            </div>

            <div className="form-group mb-16">
              <div className="info-field">
                <label><Award size={15} /> Jabatan Fungsional</label>
                <div className="info-box readonly">{user?.jabatan_fungsional || <span className="text-muted">Belum diisi</span>}</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="profile-card">
          <div className="profile-section-title">
            <Shield size={16} /> Akun Admin
          </div>
          <div className="info-field mb-16">
            <label><Shield size={15} /> Role</label>
            <div style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
              <span className="tag tag-red" style={{ fontSize: '13px', padding: '6px 12px' }}>
                Admin EEATS
              </span>
            </div>
          </div>
        </div>
      )}

      {onEdit && user?.role !== 'admin' && (
        <div className="btn-row" style={{ marginTop: '16px', marginBottom: '16px', borderTop: 'none', paddingTop: 0 }}>
          <button className="btn btn-primary" onClick={onEdit}>
            Edit Profil
          </button>
        </div>
      )}
    </div>
  );
}
