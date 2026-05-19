import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import useAuthStore from '../store/authStore';
import ProfileHeader from '../components/profil/ProfileHeader';
import ProfileInfo from '../components/profil/ProfileInfo';
import ProfileEditForm from '../components/profil/ProfileEditForm';
import ProfileSecurity from '../components/profil/ProfileSecurity';
import useModalStore from '../store/modalStore';
import api from '../services/api';
import './ProfilPage.css';

/**
 * ProfilPage - Halaman manajemen profil pengguna (Dosen).
 * Dibuat secara modular dan fully responsive.
 */
export default function ProfilPage() {
  const { user, fetchUser } = useAuthStore();
  const { showAlert } = useModalStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync formData dengan data user dari store
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        nidn: user.nidn || '',
        prodi: user.prodi || '',
        sub_kk_id: user.sub_kk_id || '',
        nip: user.nip || '',
        coe: user.coe || '',
        jabatan_fungsional: user.jabatan_fungsional || ''
      });
      setIsLoading(false);
    } else {
      fetchUser();
    }
  }, [user, fetchUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Panggil API update profil personal (POST /me)
      const response = await api.post('/me', formData);
      
      if (response.status === 200) {
        showAlert('Profil Anda berhasil diperbarui!', 'Berhasil', 'success');
        // Refresh data dari server
        await fetchUser();
        setIsEditing(false);
      } else {
        showAlert(response.data?.message || 'Gagal memperbarui profil', 'Error', 'error');
      }
    } catch (error) {
      console.error('Update error:', error);
      showAlert(error.response?.data?.message || 'Gagal memperbarui profil', 'Error', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout title="Profil Saya">
        <div className="profile-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
          <div className="alert alert-info">Memuat data profil...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Pengaturan Profil" subtitle="Kelola informasi akun dan data akademik Anda.">
      <div className="profile-container">
        
        {/* Header Profil (Gradient Card) */}
        <ProfileHeader user={user} isEditing={isEditing} />

        {/* Body Profil (Info atau Form Edit) */}
        {user?.role !== 'admin' ? (
          <>
            {!isEditing ? (
              <ProfileInfo 
                user={user} 
                onEdit={() => setIsEditing(true)} 
              />
            ) : (
              <ProfileEditForm 
                formData={formData}
                setFormData={setFormData}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
                isSaving={isSaving}
                userRole={user?.role}
              />
            )}
          </>
        ) : null}

        {/* Section Keamanan (Berfungsi secara Real ke Database) */}
        <ProfileSecurity />

      </div>
    </Layout>
  );
}
