import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import LaporanStats from '../components/laporan/LaporanStats';
import LaporanFilter from '../components/laporan/LaporanFilter';
import LaporanTable from '../components/laporan/LaporanTable';
import LaporanExportGrid from '../components/laporan/LaporanExportGrid';
import LaporanDetailModal from '../components/laporan/LaporanDetailModal';
import LaporanCategoryDetailModal from '../components/laporan/LaporanCategoryDetailModal';
import api from '../services/api';
import useModalStore from '../store/modalStore';
import useAuthStore from '../store/authStore';
import { Navigate } from 'react-router-dom';
import './LaporanPage.css';

export default function LaporanPage() {
  const { user: currentUser } = useAuthStore();
  const { showAlert, showConfirm } = useModalStore();

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [filters, setFilters] = useState({
    sub_kk_id: '',
    status: '',
    search: ''
  });

  const [data, setData] = useState({
    summary: null,
    users: [],
    sub_kks: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchRekap = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/laporan/rekap', {
        params: {
          tahun: selectedYear,
          sub_kk_id: filters.sub_kk_id
        }
      });
      setData({
        summary: response.data.summary,
        users: response.data.users,
        sub_kks: response.data.sub_kks
      });
    } catch (error) {
      console.error('Gagal mengambil data rekap laporan:', error);
      showAlert('Gagal memuat rekapitulasi data laporan.', 'Error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch when year or Sub-KK filter changes (server-side queries)
  useEffect(() => {
    fetchRekap();
  }, [selectedYear, filters.sub_kk_id]);

  // Proteksi Halaman: Jika user biasa (anggota), redirect ke dashboard
  if (currentUser && currentUser.role === 'anggota') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRemindUser = (targetUser) => {
    showConfirm(
      `Apakah Anda yakin ingin mengirimkan email pengingat pengisian capaian kepada ${targetUser.name}?`,
      async () => {
        try {
          const response = await api.post(`/laporan/remind/${targetUser.id}`);
          showAlert(response.data.message || 'Email pengingat berhasil dikirim.', 'Berhasil', 'success');
        } catch (error) {
          console.error('Gagal mengirim pengingat:', error);
          showAlert('Gagal mengirimkan pengingat email.', 'Error', 'error');
        }
      },
      'Kirim Pengingat'
    );
  };

  // Snappy client-side filtering for search & status (perfect responsive UX)
  const filteredUsers = data.users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === '' || u.completeness === filters.status;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout 
      title="Laporan & Distribusi Capaian" 
      subtitle="Rekap seluruh anggota KK ETHES · Hak Akses: Ketua KK & Ketua Sub-KK"
      headerActions={
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select 
            className="filter-select select-input" 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '13px', background: 'var(--white)', fontWeight: 600 }}
          >
            <option value="">Semua Tahun</option>
            {Array.from({ length: new Date().getFullYear() - 2024 + 1 }, (_, i) => {
              const yr = new Date().getFullYear() - i;
              return <option key={yr} value={yr.toString()}>Tahun {yr}</option>;
            })}
          </select>
        </div>
      }
    >
      <div className="laporan-container">
        {isLoading && data.summary === null ? (
          <div className="loading-state" style={{ padding: '40px', textAlign: 'center', fontWeight: 600, color: 'var(--text3)' }}>
            Memuat data laporan...
          </div>
        ) : (
          <>
            <LaporanStats 
              summary={data.summary} 
              onCardClick={(cat) => setSelectedCategory(cat)} 
            />
            <LaporanFilter 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              subKks={data.sub_kks}
            />
            {isLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', fontWeight: 600, color: 'var(--text3)' }}>
                Menyaring data...
              </div>
            ) : (
              <LaporanTable 
                users={filteredUsers} 
                onShowDetail={(user) => setSelectedUser(user)} 
                onRemindUser={handleRemindUser}
              />
            )}
            <LaporanExportGrid selectedYear={selectedYear} subKkId={filters.sub_kk_id} />
          </>
        )}

        {selectedUser && (
          <LaporanDetailModal 
            user={selectedUser} 
            year={selectedYear} 
            onClose={() => setSelectedUser(null)} 
          />
        )}

        {selectedCategory && (
          <LaporanCategoryDetailModal
            category={selectedCategory}
            year={selectedYear}
            subKkId={filters.sub_kk_id}
            onClose={() => setSelectedCategory(null)}
          />
        )}
      </div>
    </Layout>
  );
}
