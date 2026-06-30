import React, { useState, useEffect } from 'react';
import { FileText, Award, Briefcase, Users, GraduationCap } from 'lucide-react';
import api from '../services/api';
import Layout from '../components/layout/Layout';
import TabPublikasi from '../components/capaian/TabPublikasi';
import TabHibah from '../components/capaian/TabHibah';
import TabPaten from '../components/capaian/TabPaten';
import TabAbdimas from '../components/capaian/TabAbdimas';
import TabPelatihan from '../components/capaian/TabPelatihan';
import useAuthStore from '../store/authStore';
import { Navigate, useSearchParams } from 'react-router-dom';
import './CapaianPage.css';

/**
 * CapaianPage - Halaman input capaian dosen.
 * Menggunakan sistem tab untuk memisahkan kategori capaian.
 */
export default function CapaianPage() {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromQuery = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromQuery || 'publikasi');
  const [stats, setStats] = useState({
    publikasi: 0,
    hibah: 0,
    paten: 0,
    abdimas: 0,
    pelatihan: 0
  });

  useEffect(() => {
    if (tabFromQuery) {
      setActiveTab(tabFromQuery);
    }
  }, [tabFromQuery]);

  // Fetch stats from backend
  useEffect(() => {
    api.get('/capaian/summary')
      .then(res => setStats(res.data))
      .catch(err => console.error('Failed to fetch capaian summary', err));
  }, [activeTab]); // Refresh stats when tab changes (so after adding items, switching back updates the count)

  // Security: Admin doesn't need this page
  if (user?.role === 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const tabs = [
    { id: 'publikasi', label: 'Publikasi', icon: <FileText size={18} />, count: stats.publikasi },
    { id: 'hibah', label: 'Hibah', icon: <Briefcase size={18} />, count: stats.hibah },
    { id: 'paten', label: 'Paten & HKI', icon: <Award size={18} />, count: stats.paten },
    { id: 'abdimas', label: 'Abdimas', icon: <Users size={18} />, count: stats.abdimas },
    { id: 'pelatihan', label: 'Pelatihan', icon: <GraduationCap size={18} />, count: stats.pelatihan },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'publikasi': return <TabPublikasi />;
      case 'hibah': return <TabHibah />;
      case 'paten': return <TabPaten />;
      case 'abdimas': return <TabAbdimas />;
      case 'pelatihan': return <TabPelatihan />;
      default: return <TabPublikasi />;
    }
  };

  return (
    <Layout 
      title="Input Capaian Pribadi" 
      subtitle="Catat publikasi, hibah, paten, dan partisipasi pelatihan Anda. Setiap perubahan akan disimpan secara otomatis per item."
    >
      <div className="capaian-container">

        {/* Tab Bar Navigasi */}
        <div className="tab-bar">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchParams({ tab: tab.id });
              }}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              <span className="tab-count">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Konten Tab Aktif */}
        <div className="tab-content">
          {renderTabContent()}
        </div>

      </div>
    </Layout>
  );
}
