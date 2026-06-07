import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Terminal } from 'lucide-react';
import { FEATURES, getFeatureFlag, setFeatureFlag } from '../utils/featureFlags';
import useAuthStore from '../store/authStore';
import { Navigate } from 'react-router-dom';
import './DevSettingsPage.css';

export default function DevSettingsPage() {
  const { user: currentUser } = useAuthStore();

  const [flags, setFlags] = useState({
    [FEATURES.PRINT_REPORT]: false,
    [FEATURES.EMAIL_REMINDER]: true,
    [FEATURES.EXPORT_EXCEL]: true,
    [FEATURES.DARK_MODE]: false
  });

  useEffect(() => {
    // Load current values
    setFlags({
      [FEATURES.PRINT_REPORT]: getFeatureFlag(FEATURES.PRINT_REPORT, false),
      [FEATURES.EMAIL_REMINDER]: getFeatureFlag(FEATURES.EMAIL_REMINDER, true),
      [FEATURES.EXPORT_EXCEL]: getFeatureFlag(FEATURES.EXPORT_EXCEL, true),
      [FEATURES.DARK_MODE]: getFeatureFlag(FEATURES.DARK_MODE, false)
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
  };

  return (
    <Layout title="Developer Option">
      <div className="dev-settings-container">
        <div className="dev-settings-card">
          <div className="dev-settings-header">
            <Terminal size={18} />
            <span>Feature Flags</span>
          </div>

          <div className="feature-list">
            {/* Feature 1: Print Report */}
            <div className="feature-item">
              <div className="feature-info">
                <span className="feature-title">Fitur Cetak Laporan</span>
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
                <span className="feature-title">Fitur Pengingat Email</span>
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
                <span className="feature-title">Format Ekspor Laporan</span>
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

            {/* Feature 4: Dark Mode */}
            <div className="feature-item">
              <div className="feature-info">
                <span className="feature-title">Mode Gelap</span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={flags[FEATURES.DARK_MODE]}
                  onChange={() => handleToggle(FEATURES.DARK_MODE)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
