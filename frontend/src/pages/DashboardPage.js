import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import StatCards from './dashboard/StatCards';
import PersonalSummary from './dashboard/PersonalSummary';
import ChartSection from './dashboard/ChartSection';
import CategoryChart from './dashboard/CategoryChart';
import TopPerformers from './dashboard/TopPerformers';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import useModalStore from '../store/modalStore';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user: currentUser } = useAuthStore();
  const { showAlert } = useModalStore();

  const [selectedYear, setSelectedYear] = useState('');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/dashboard?tahun=${selectedYear}`);
      setData(response.data);
    } catch (error) {
      console.error('Gagal memuat data dashboard:', error);
      showAlert('Gagal memuat data statistik dashboard.', 'Error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedYear]);

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'Selamat Pagi';
    if (hour >= 11 && hour < 15) return 'Selamat Siang';
    if (hour >= 15 && hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const getSubtitle = () => {
    if (!data) return 'Memuat data...';
    const roleMap = {
      admin: 'Admin',
      ketua_kk: 'Ketua KK',
      ketua_sub_kk: 'Ketua Sub-KK',
      anggota: 'Anggota'
    };
    const roleLabel = roleMap[data.user.role] || 'Dosen';
    return /* `${getGreeting()}, ${data.user.name} · Hak Akses: ${roleLabel}` */;
  };

  return (
    <Layout
      title="Dashboard KK EEATS"
      subtitle={getSubtitle()}
      headerActions={
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            className="filter-select select-input"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              fontSize: '13px',
              background: 'var(--white)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {Array.from({ length: new Date().getFullYear() - 2024 + 1 }, (_, i) => {
              const yr = new Date().getFullYear() - i;
              return <option key={yr} value={yr.toString()}>Tahun {yr}</option>;
            })}
            <option value="">Semua Tahun</option>
          </select>
        </div>
      }
    >
      <div className="dashboard-container animate-fade-in">
        {isLoading && !data ? (
          // Premium Skeleton Loading States
          <div className="skeleton-container">
            <div className="skeleton-card personal-welcome" style={{ height: '240px', borderRadius: '16px', background: 'var(--border)', opacity: 0.15, marginBottom: '24px', animation: 'pulse 1.5s infinite' }}></div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton-card stat" style={{ height: '120px', borderRadius: '16px', background: 'var(--border)', opacity: 0.15, animation: 'pulse 1.5s infinite' }}></div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div className="skeleton-card chart" style={{ height: '340px', borderRadius: '16px', background: 'var(--border)', opacity: 0.15, animation: 'pulse 1.5s infinite' }}></div>
              <div className="skeleton-card chart" style={{ height: '340px', borderRadius: '16px', background: 'var(--border)', opacity: 0.15, animation: 'pulse 1.5s infinite' }}></div>
            </div>
          </div>
        ) : (
          <>
            {/* 1. Personal Welcome & Accomplishment card (Always visible on top) */}
            <div className="dashboard-section-header first">
              <h3 className="dashboard-section-title">Capaian Pribadi</h3>
              <div className="dashboard-section-line"></div>
            </div>
            <PersonalSummary data={data} selectedYear={selectedYear} />

            {/* 2. Global summary stat cards */}
            <div className="dashboard-section-header">
              <h3 className="dashboard-section-title">Capaian Kelompok Keahlian (KK)</h3>
              <div className="dashboard-section-line"></div>
            </div>
            <StatCards data={data} />

            {/* 3. Recharts Donut & Sub-KK stacked progress bar */}
            <ChartSection data={data} selectedYear={selectedYear} />

            {/* 4. Category distribution BarChart */}
            <CategoryChart data={data} />

            {/* 5. Top 5 lecturers table summary */}
            <TopPerformers data={data} />
          </>
        )}
      </div>
    </Layout>
  );
}
