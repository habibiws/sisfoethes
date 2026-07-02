import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Link as LinkIcon, FileText, Wallet, Award, Globe, GraduationCap } from 'lucide-react';
import Layout from '../components/layout/Layout';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { Navigate } from 'react-router-dom';

export default function LaporanCategoryPage() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();

  const year = searchParams.get('tahun') || new Date().getFullYear().toString();
  const subKkId = searchParams.get('sub_kk_id') || '';

  const [data, setData] = useState([]);
  const [subKks, setSubKks] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryConfigs = {
    publikasi: { title: 'Detail Publikasi Ilmiah', icon: <FileText size={20} />, color: '#27AE60', bg: '#E8F5EA' },
    hibah: { title: 'Detail Dana Hibah Penelitian', icon: <Wallet size={20} />, color: 'var(--gold)', bg: '#FAFDF8' },
    paten: { title: 'Detail Paten & HKI', icon: <Award size={20} />, color: '#2F80ED', bg: '#EBF2F9' },
    abdimas: { title: 'Detail Pengabdian Masyarakat', icon: <Globe size={20} />, color: 'var(--red)', bg: '#FFF9F9' },
    pelatihan: { title: 'Detail Pelatihan & Sertifikasi', icon: <GraduationCap size={20} />, color: '#9B51E0', bg: 'rgba(155, 81, 224, 0.08)' }
  };

  const config = categoryConfigs[category] || { title: 'Detail Capaian', icon: null, color: 'var(--navy)', bg: '#F8FAFC' };

  useEffect(() => {
    const fetchSubKks = async () => {
      try {
        const response = await api.get('/sub-kks');
        setSubKks(response.data || []);
      } catch (err) {
        console.error('Gagal mengambil data Sub-KK:', err);
      }
    };
    fetchSubKks();
  }, []);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get('/laporan/category-detail', {
          params: { category, tahun: year, sub_kk_id: subKkId }
        });
        setData(response.data.data || []);
      } catch (error) {
        console.error('Gagal mengambil detail kategori:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [category, year, subKkId]);

  // Guard: Allowed for all authenticated users (anggota, ketua_sub_kk, ketua_kk, admin)

  const handleFilterChange = (key, val) => {
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set(key, val);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const renderTable = () => {
    if (data.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text3)', fontWeight: 600 }}>
          Tidak ada data detail untuk kategori ini dengan filter yang dipilih.
        </div>
      );
    }

    switch (category) {
      case 'publikasi':
        return (
          <table className="user-table">
            <thead>
              <tr>
                <th style={{ width: '50px', textAlign: 'center' }}>No</th>
                <th>Dosen</th>
                <th>Sub-KK</th>
                <th>Judul Publikasi</th>
                <th>Jurnal/Konferensi</th>
                <th style={{ textAlign: 'center' }}>Tahun</th>
                <th>Kategori</th>
                <th style={{ textAlign: 'center' }}>DOI</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id}>
                  <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text3)' }}>{index + 1}</td>
                  <td style={{ fontWeight: 700, color: 'var(--navy)' }}>{item.user?.name || '—'}</td>
                  <td>
                    <span className="tag-navy" style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: '#EBF2F9', color: 'var(--navy)', fontWeight: 600 }}>
                      {item.user?.sub_kk?.code || '—'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, maxWidth: '300px', wordBreak: 'break-word' }}>{item.judul}</td>
                  <td>{item.jurnal}</td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.tahun_terbit}</td>
                  <td>
                    <span className="tag-outline" style={{ textTransform: 'capitalize' }}>{item.kategori}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {item.doi_url ? (
                      <a href={item.doi_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--navy)', display: 'inline-flex', alignItems: 'center' }}>
                        <LinkIcon size={14} />
                      </a>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'hibah':
        return (
          <table className="user-table">
            <thead>
              <tr>
                <th style={{ width: '50px', textAlign: 'center' }}>No</th>
                <th>Dosen</th>
                <th>Sub-KK</th>
                <th>Judul Penelitian</th>
                <th>Sumber Dana</th>
                <th>Jumlah Dana</th>
                <th style={{ textAlign: 'center' }}>Tahun</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id}>
                  <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text3)' }}>{index + 1}</td>
                  <td style={{ fontWeight: 700, color: 'var(--navy)' }}>{item.user?.name || '—'}</td>
                  <td>
                    <span className="tag-navy" style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: '#EBF2F9', color: 'var(--navy)', fontWeight: 600 }}>
                      {item.user?.sub_kk?.code || '—'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, maxWidth: '300px', wordBreak: 'break-word' }}>{item.judul}</td>
                  <td>{item.sumber_dana}</td>
                  <td style={{ fontWeight: 700, color: '#27AE60' }}>
                    Rp {item.jumlah_dana ? item.jumlah_dana.toLocaleString('id-ID') : '0'}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.tahun}</td>
                  <td>
                    <span className="tag-outline" style={{ textTransform: 'capitalize' }}>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'paten':
        return (
          <table className="user-table">
            <thead>
              <tr>
                <th style={{ width: '50px', textAlign: 'center' }}>No</th>
                <th>Dosen</th>
                <th>Sub-KK</th>
                <th>Judul Paten/HKI</th>
                <th>Jenis</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Tahun</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id}>
                  <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text3)' }}>{index + 1}</td>
                  <td style={{ fontWeight: 700, color: 'var(--navy)' }}>{item.user?.name || '—'}</td>
                  <td>
                    <span className="tag-navy" style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: '#EBF2F9', color: 'var(--navy)', fontWeight: 600 }}>
                      {item.user?.sub_kk?.code || '—'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, maxWidth: '300px', wordBreak: 'break-word' }}>{item.judul}</td>
                  <td>{item.jenis}</td>
                  <td>
                    <span className="tag-outline" style={{ textTransform: 'capitalize' }}>{item.status}</span>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.tahun}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'abdimas':
        return (
          <table className="user-table">
            <thead>
              <tr>
                <th style={{ width: '50px', textAlign: 'center' }}>No</th>
                <th>Dosen</th>
                <th>Sub-KK</th>
                <th>Judul Abdimas</th>
                <th>Mitra Sasaran</th>
                <th style={{ textAlign: 'center' }}>Tahun</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id}>
                  <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text3)' }}>{index + 1}</td>
                  <td style={{ fontWeight: 700, color: 'var(--navy)' }}>{item.user?.name || '—'}</td>
                  <td>
                    <span className="tag-navy" style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: '#EBF2F9', color: 'var(--navy)', fontWeight: 600 }}>
                      {item.user?.sub_kk?.code || '—'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, maxWidth: '400px', wordBreak: 'break-word' }}>{item.judul}</td>
                  <td>{item.mitra}</td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.tahun}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'pelatihan':
        return (
          <table className="user-table">
            <thead>
              <tr>
                <th style={{ width: '50px', textAlign: 'center' }}>No</th>
                <th>Dosen</th>
                <th>Sub-KK</th>
                <th>Nama Pelatihan</th>
                <th>Penyelenggara</th>
                <th>Tanggal</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id}>
                  <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text3)' }}>{index + 1}</td>
                  <td style={{ fontWeight: 700, color: 'var(--navy)' }}>{item.user?.name || '—'}</td>
                  <td>
                    <span className="tag-navy" style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: '#EBF2F9', color: 'var(--navy)', fontWeight: 600 }}>
                      {item.user?.sub_kk?.code || '—'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, maxWidth: '250px', wordBreak: 'break-word' }}>{item.event?.judul || '—'}</td>
                  <td>{item.event?.penyelenggara || '—'}</td>
                  <td>
                    {item.event?.tanggal_mulai ? (
                      new Date(item.event.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                    ) : '—'}
                    {item.event?.tanggal_selesai && ` s.d. ${new Date(item.event.tanggal_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                  </td>
                  <td style={{ maxWidth: '200px', wordBreak: 'break-word' }}>{item.event?.keterangan || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      default:
        return null;
    }
  };

  return (
    <Layout 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => {
              if (currentUser?.role === 'anggota') {
                navigate('/dashboard');
              } else {
                navigate('/laporan');
              }
            }} 
            className="btn btn-ghost" 
            style={{ padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ArrowLeft size={20} />
          </button>
          <span>{config.title}</span>
        </div>
      }
      subtitle={`Detail data capaian KK ETHES · ${year ? `Tahun ${year}` : 'Semua Tahun'}`}
      headerActions={
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Sub-KK selector */}
          <select 
            className="select-input"
            value={subKkId}
            onChange={(e) => handleFilterChange('sub_kk_id', e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '13px', background: 'var(--white)', fontWeight: 600 }}
          >
            <option value="">Semua Sub-KK</option>
            {subKks.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
            ))}
          </select>

          {/* Year selector */}
          <select 
            className="select-input" 
            value={year} 
            onChange={(e) => handleFilterChange('tahun', e.target.value)}
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
      <div className="card" style={{ padding: '24px', borderRadius: '16px', minHeight: '60vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: config.bg, color: config.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {config.icon}
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--navy-text)' }}>{config.title}</div>
            <div style={{ fontSize: '13px', color: 'var(--text3)' }}>
              Menampilkan {data.length} item data.
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '80px 0' }}>
            <Loader2 size={36} className="spin" style={{ color: 'var(--navy)' }} />
            <div style={{ fontSize: '14px', color: 'var(--text3)', fontWeight: 600 }}>Memuat detail data...</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            {renderTable()}
          </div>
        )}
      </div>
    </Layout>
  );
}
