import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, LayoutDashboard, PlusCircle, BookOpen, BarChart2, Users } from 'lucide-react';
import AccessibilityMenu from './AccessibilityMenu';
import useAuthStore from '../../store/authStore';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const { user } = useAuthStore();

  const isActive = (path) => location.pathname === path ? 'active' : '';

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
          <div className="si-icon">
            <LayoutDashboard size={16} />
          </div>
          <span className="si-text">Dashboard</span>
        </Link>
        {user?.role !== 'admin' && (
          <Link to="/capaian" className={`sidebar-item ${isActive('/capaian')}`}>
            <div className="si-icon">
              <PlusCircle size={16} />
            </div>
            <span className="si-text">Input Capaian</span>
          </Link>
        )}
        <Link to="/pelatihan" className={`sidebar-item ${isActive('/pelatihan')}`}>
          <div className="si-icon">
            <BookOpen size={16} />
          </div>
          <span className="si-text">Kelola Pelatihan</span>
        </Link>
        {user && ['admin', 'ketua_kk', 'ketua_sub_kk'].includes(user.role) && (
          <Link to="/laporan" className={`sidebar-item ${isActive('/laporan')}`}>
            <div className="si-icon">
              <BarChart2 size={16} />
            </div>
            <span className="si-text">Laporan</span>
          </Link>
        )}
        
        {(user?.role === 'admin' || user?.role === 'ketua_kk') && (
          <Link to="/users" className={`sidebar-item ${isActive('/users')}`}>
            <div className="si-icon">
              <Users size={16} />
            </div>
            <span className="si-text">User & Role</span>
          </Link>
        )}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <AccessibilityMenu isSidebarCollapsed={!isOpen} />
      </div>
    </aside>
  );
}
