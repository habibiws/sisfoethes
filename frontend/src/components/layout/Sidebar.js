import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import AccessibilityMenu from './AccessibilityMenu';
import useAuthStore from '../../store/authStore';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const { user } = useAuthStore();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  // Format Role Display
  const formatRole = (role) => {
    if (role === 'admin') return 'Admin';
    if (role === 'ketua_kk') return 'Ketua KK';
    if (role === 'ketua_sub_kk') return 'Ketua Sub-KK';
    return 'Anggota Biasa';
  };

  return (
    <aside className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
      <div className="sidebar-header" style={{ padding: '4px 0', marginBottom: '8px' }}>
        <button
          className="sidebar-item toggle-btn"
          onClick={toggleSidebar}
          style={{ background: 'transparent', border: 'none', width: '100%' }}
        >
          <div className="si-icon" style={{ background: 'var(--navy)', color: 'white' }}>
            <Menu size={14} />
          </div>
          <span className="si-text" style={{ fontWeight: 700, color: 'var(--navy)', letterSpacing: '0.5px' }}>
            MENU
          </span>
        </button>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Menu Utama</div>
        <Link to="/dashboard" className={`sidebar-item ${isActive('/dashboard')}`}>
          <div className="si-icon illus">
            <img src="/assets/icons/dashboard.png" alt="Dashboard" />
          </div>
          <span className="si-text">Dashboard</span>
        </Link>
        {user?.role !== 'admin' && (
          <Link to="/capaian" className={`sidebar-item ${isActive('/capaian')}`}>
            <div className="si-icon illus">
              <img src="/assets/icons/capaian.png" alt="Capaian" />
            </div>
            <span className="si-text">Input Capaian</span>
          </Link>
        )}
        <Link to="/pelatihan" className={`sidebar-item ${isActive('/pelatihan')}`}>
          <div className="si-icon illus">
            <img src="/assets/icons/pelatihan.png" alt="Pelatihan" />
          </div>
          <span className="si-text">Kelola Pelatihan</span>
        </Link>
        {user && ['admin', 'ketua_kk', 'ketua_sub_kk'].includes(user.role) && (
          <Link to="/laporan" className={`sidebar-item ${isActive('/laporan')}`}>
            <div className="si-icon illus">
              <img src="/assets/icons/laporan.png" alt="Laporan" />
            </div>
            <span className="si-text">Laporan</span>
          </Link>
        )}
        
        {(user?.role === 'admin' || user?.role === 'ketua_kk') && (
          <Link to="/users" className={`sidebar-item ${isActive('/users')}`}>
            <div className="si-icon illus">
              <img src="/assets/icons/users.png" alt="Users" />
            </div>
            <span className="si-text">User & Role</span>
          </Link>
        )}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <AccessibilityMenu isSidebarCollapsed={!isOpen} />
        <div className="sidebar-divider"></div>
        <div className="sidebar-info">
          <div className="sidebar-info-label">Peran Aktif</div>
          <div className="sidebar-info-val">{user ? formatRole(user.role) : 'Memuat...'}</div>
          <div className="sidebar-info-sub">{user?.sub_kk?.name || 'Semester Genap 24/25'}</div>
        </div>
      </div>
    </aside>
  );
}
