import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Terminal, Shield, RefreshCw } from 'lucide-react';
import { FEATURES, getFeatureFlag, setFeatureFlag } from '../utils/featureFlags';
import useModalStore from '../store/modalStore';
import useAuthStore from '../store/authStore';
import { Navigate } from 'react-router-dom';
import './DevSettingsPage.css';

export default function DevSettingsPage() {
  const { user: currentUser } = useAuthStore();
  const { showAlert } = useModalStore();

  const [flags, setFlags] = useState({
    [FEATURES.PRINT_REPORT]: false,
    [FEATURES.EMAIL_REMINDER]: true, // Default true
    [FEATURES.EXPORT_EXCEL]: true     // Default true
  });

  useEffect(() => {
    // Load current values
    setFlags({
      [FEATURES.PRINT_REPORT]: getFeatureFlag(FEATURES.PRINT_REPORT, false),
      [FEATURES.EMAIL_REMINDER]: getFeatureFlag(FEATURES.EMAIL_REMINDER, true),
      [FEATURES.EXPORT_EXCEL]: getFeatureFlag(FEATURES.EXPORT_EXCEL, true)
    });
  }, []);

  // Proteksi Halaman: Hanya Ketua KK dan Admin yang diperbolehkan mengakses halaman developer
  if (currentUser && currentUser.role !== 'ketua_kk' && currentUser.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleToggle = (key) => {
    const newValue = !flags[key];
    setFlags(prev => ({ ...prev, [key]: newValue }));
    setFeatureFlag(key, newValue);
    
    // Snappy alert confirmation
    showAlert(`Fitur ${key.toUpperCase().replace('_', ' ')} berhasil di-${newValue ? 'aktifkan' : 'nonaktifkan'}!`, 'Berhasil', 'success');
  };

  const handleResetDefaults = () => {
    setFeatureFlag(FEATURES.PRINT_REPORT, false);
    setFeatureFlag(FEATURES.EMAIL_REMINDER, true);
    setFeatureFlag(FEATURES.EXPORT_EXCEL, true);
    
    setFlags({
      [FEATURES.PRINT_REPORT]: false,
      [FEATURES.EMAIL_REMINDER]: true,
      [FEATURES.EXPORT_EXCEL]: true
    });

    showAlert('Pengaturan pengembang berhasil dikembalikan ke default.', 'Berhasil', 'success');
  };

  return (
    <Layout
      title="Opsi Pengembang (Developer Options)"
      subtitle="Konfigurasi bendera fitur (feature flags) lokal untuk menyembunyikan/menampilkan fungsionalitas UI"
    >
      <div className="dev-settings-container">
        <div className="dev-settings-card">
          <div className="dev-settings-header">
            <Terminal size={18} />
            <span>Fitur Bendera Toggles (Feature Flags)</span>
          </div>

          <div className="feature-list">
            {/* Feature 1: Print Report */}
            <div className="feature-item">
              <div className="feature-info">
                <span className="feature-title">Fitur Cetak Laporan (Print PDF)</span>
                <span className="feature-desc">Menampilkan tombol cetak laporan di Halaman Laporan. Matikan jika belum ingin diekspos ke user.</span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={flags[FEATURES.PRINT_REPORT]}
                  onChange={() => handleToggle(FEATURES.PRINT_REPORT)}
                />
                <span className="slider"></span>
              </label>
            </div>

            {/* Feature 2: Email Reminder */}
            <div className="feature-item">
              <div className="feature-info">
                <span className="feature-title">Fitur Pengingat Email (Email Reminder)</span>
                <span className="feature-desc">Mengaktifkan tombol pengingat email "Ingatkan" pada baris tabel dosen di Halaman Laporan.</span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={flags[FEATURES.EMAIL_REMINDER]}
                  onChange={() => handleToggle(FEATURES.EMAIL_REMINDER)}
                />
                <span className="slider"></span>
              </label>
            </div>

            {/* Feature 3: Export Excel */}
            <div className="feature-item">
              <div className="feature-info">
                <span className="feature-title">Format Ekspor Laporan (Excel)</span>
                <span className="feature-desc">Menampilkan widget / grid untuk ekspor file rekap capaian dan data lengkap dalam format Excel.</span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={flags[FEATURES.EXPORT_EXCEL]}
                  onChange={() => handleToggle(FEATURES.EXPORT_EXCEL)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              className="btn btn-outline btn-sm" 
              onClick={handleResetDefaults}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={12} /> Kembalikan ke Default
            </button>
          </div>
        </div>

        <div className="dev-settings-card" style={{ background: '#fef08a', borderColor: '#fef08a', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <Shield size={20} style={{ color: '#854d0e', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 700, color: '#854d0e', fontSize: '13px' }}>Catatan Pengembang</div>
            <div style={{ fontSize: '12px', color: '#713f12', marginTop: '4px', lineHeight: 1.5, fontWeight: 500 }}>
              Halaman ini bersifat rahasia dan tidak ditautkan di menu mana pun (hanya dapat diakses melalui URL langsung <code style={{ background: 'rgba(0,0,0,0.06)', padding: '2px 4px', borderRadius: '4px' }}>/developer</code>). Pengaturan disimpan secara instan di dalam <code style={{ background: 'rgba(0,0,0,0.06)', padding: '2px 4px', borderRadius: '4px' }}>localStorage</code> browser Anda.
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
