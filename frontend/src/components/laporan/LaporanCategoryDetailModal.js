import React, { useState, useEffect } from 'react';
import { X, Loader2, Link as LinkIcon, FileText, Wallet, Award, Globe, GraduationCap } from 'lucide-react';
import api from '../../services/api';

export default function LaporanCategoryDetailModal({ category, year, subKkId, onClose }) {
  const [data, setData] = useState([]);
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

  const renderTable = () => {
    if (data.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)', fontWeight: 600 }}>
          Tidak ada data detail untuk kategori ini.
        </div>
      );
    }

    switch (category) {
      case 'publikasi':
        return (
          <table className="user-table">
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>No</th>
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
                  <td style={{ fontWeight: 600 }}>{item.judul}</td>
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
                <th style={{ width: '40px', textAlign: 'center' }}>No</th>
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
                  <td style={{ fontWeight: 600 }}>{item.judul}</td>
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
                <th style={{ width: '40px', textAlign: 'center' }}>No</th>
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
                  <td style={{ fontWeight: 600 }}>{item.judul}</td>
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
                <th style={{ width: '40px', textAlign: 'center' }}>No</th>
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
                  <td style={{ fontWeight: 600 }}>{item.judul}</td>
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
                <th style={{ width: '40px', textAlign: 'center' }}>No</th>
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
                  <td style={{ fontWeight: 600 }}>{item.event?.name || '—'}</td>
                  <td>{item.event?.penyelenggara || '—'}</td>
                  <td>{item.event?.tanggal_mulai ? `${item.event.tanggal_mulai} s.d. ${item.event.tanggal_selesai}` : '—'}</td>
                  <td>{item.event?.keterangan || '—'}</td>
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
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '1000px', width: '90%', borderRadius: '16px', overflow: 'hidden' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border)', background: '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: config.bg, color: config.color, display: 'flex', alignItems: 'center', justifycontent: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {config.icon}
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)' }}>{config.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--text3)', fontWeight: 500, marginTop: '2px' }}>
                {year ? `Tahun ${year}` : 'Semua Tahun'} {subKkId ? '· Filter Sub-KK Aktif' : ''}
              </div>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '60px 0' }}>
              <Loader2 size={32} className="spin" style={{ color: 'var(--navy)' }} />
              <div style={{ fontSize: '14px', color: 'var(--text3)', fontWeight: 600 }}>Memuat detail data...</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              {renderTable()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
