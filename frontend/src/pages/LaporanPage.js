import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Printer } from 'lucide-react';
import LaporanStats from '../components/laporan/LaporanStats';
import LaporanFilter from '../components/laporan/LaporanFilter';
import LaporanTable from '../components/laporan/LaporanTable';
import LaporanExportGrid from '../components/laporan/LaporanExportGrid';
import LaporanDetailModal from '../components/laporan/LaporanDetailModal';
import { FEATURES, getFeatureFlag } from '../utils/featureFlags';
import api from '../services/api';
import useModalStore from '../store/modalStore';
import useAuthStore from '../store/authStore';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import './LaporanPage.css';

export default function LaporanPage() {
  const { user: currentUser } = useAuthStore();
  const { showAlert, showConfirm } = useModalStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedYear, setSelectedYear] = useState(() => {
    // Sesuai filter tahun dashboard (default "semua tahun" alias "" jika kosong, atau tahun saat ini)
    return searchParams.has('tahun') ? searchParams.get('tahun') : new Date().getFullYear().toString();
  });

  const [filters, setFilters] = useState(() => {
    return {
      sub_kk_id: searchParams.get('sub_kk_id') || '',
      status: '',
      search: ''
    };
  });

  const [data, setData] = useState({
    summary: null,
    users: [],
    sub_kks: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  // Sync URL search params with local states (essential for dashboard clicking and backward navigation)
  useEffect(() => {
    const urlSubKk = searchParams.get('sub_kk_id') || '';
    const urlYear = searchParams.has('tahun') ? searchParams.get('tahun') : new Date().getFullYear().toString();
    
    if (urlSubKk !== filters.sub_kk_id) {
      setFilters(prev => ({ ...prev, sub_kk_id: urlSubKk }));
    }
    if (urlYear !== selectedYear) {
      setSelectedYear(urlYear);
    }
  }, [searchParams]);

  // Read feature flags
  const showPrintFeature = getFeatureFlag(FEATURES.PRINT_REPORT, false);
  const showReminderFeature = getFeatureFlag(FEATURES.EMAIL_REMINDER, true);
  const showExportFeature = getFeatureFlag(FEATURES.EXPORT_EXCEL, true);

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

    if (name === 'sub_kk_id') {
      setSearchParams(prev => {
        if (value) prev.set('sub_kk_id', value);
        else prev.delete('sub_kk_id');
        return prev;
      }, { replace: true });
    }
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setSearchParams(prev => {
      if (year !== null) prev.set('tahun', year);
      else prev.delete('tahun');
      return prev;
    }, { replace: true });
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
      subtitle="Rekap seluruh anggota KK EEAT · Hak Akses: Ketua KK & Ketua Sub-KK"
      headerActions={
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select 
            className="filter-select select-input" 
            value={selectedYear} 
            onChange={(e) => handleYearChange(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '13px', background: 'var(--white)', fontWeight: 600 }}
          >
            <option value="">Semua Tahun</option>
            {Array.from({ length: new Date().getFullYear() - 2024 + 1 }, (_, i) => {
              const yr = new Date().getFullYear() - i;
              return <option key={yr} value={yr.toString()}>Tahun {yr}</option>;
            })}
          </select>
          {showPrintFeature && (
            <button className="btn btn-outline" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Printer size={16} /> Cetak Laporan
            </button>
          )}
        </div>
      }
    >
      <div className="laporan-container">
        
        {/* PRINT ONLY HEADER */}
        {showPrintFeature && (
          <div className="print-header">
            <div className="print-header-content">
              <img src={require('../assets/ethes-bbft.png')} alt="EEAT Logo" className="print-logo" />
              <div className="print-header-text">
                <h2>LAPORAN REKAPITULASI CAPAIAN TRIDHARMA</h2>
                <p>Kelompok Keahlian Electrical Engineering and Advanced Technologies (EEAT)</p>
                <p>Telkom University Surabaya</p>
              </div>
            </div>
            <hr className="print-hr" />
            <div className="print-meta">
              Periode: {selectedYear ? `Tahun ${selectedYear}` : 'Semua Tahun'} | Dicetak pada: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        )}

        {isLoading && data.summary === null ? (
          <div className="loading-state" style={{ padding: '40px', textAlign: 'center', fontWeight: 600, color: 'var(--text3)' }}>
            Memuat data laporan...
          </div>
        ) : (
          <>
            <LaporanStats 
              summary={data.summary} 
              onCardClick={(cat) => navigate(`/laporan/${cat}?tahun=${selectedYear}&sub_kk_id=${filters.sub_kk_id}`)} 
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
                showReminderAction={showReminderFeature}
              />
            )}
            {showExportFeature && (
              <LaporanExportGrid selectedYear={selectedYear} subKkId={filters.sub_kk_id} />
            )}
          </>
        )}

        {selectedUser && (
          <LaporanDetailModal 
            user={selectedUser} 
            year={selectedYear} 
            onClose={() => setSelectedUser(null)} 
          />
        )}
      </div>
    </Layout>
  );
}
