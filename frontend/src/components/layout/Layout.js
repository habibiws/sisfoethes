import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import { Menu, Bell } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useUiStore from '../../store/uiStore';

export default function Layout({ title, subtitle, headerActions, children }) {
  const { user, logout } = useAuthStore();
  const { isSidebarOpen, toggleSidebar, setSidebarOpen, theme, fontSize, displaySize } = useUiStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  // Apply accessibility settings
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-font-size', fontSize);
    document.documentElement.setAttribute('data-display-size', displaySize);
  }, [theme, fontSize, displaySize]);
  
  const navigate = useNavigate();
  const location = useLocation();
  const navRightRef = useRef(null);

  // Auto-close sidebar on mobile after navigation
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname, setSidebarOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRightRef.current && !navRightRef.current.contains(event.target)) {
        setIsProfileOpen(false);
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="app-container">

      {/* TOP NAVBAR */}
      <nav className="navbar" style={{ flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Mobile Toggle Button */}
          <button
            className="mobile-toggle"
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </button>
          
          <Link to="/dashboard" className="nav-brand-sidebar header-brand">
            <img 
              src={require('../../assets/ethes-btfw.png')} 
              alt="EEATS Logo" 
              className="header-logo-img" 
            />
          </Link>
        </div>

        <div className="nav-right" ref={navRightRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '15px' }}>
          
          {/* NOTIFICATION BELL */}
          <div 
            className="bell-hover"
            onClick={(e) => {
              e.stopPropagation();
              setIsNotifOpen(!isNotifOpen);
              setIsProfileOpen(false);
            }}
          >
            <Bell size={18} style={{ color: 'rgba(255, 255, 255, 0.85)', display: 'block' }} />
            {user?.role !== 'admin' && (!user?.nip || !user?.coe || !user?.jabatan_fungsional) && (
              <div style={{ position: 'absolute', top: '4px', right: '4px', width: '6px', height: '6px', background: 'var(--red)', borderRadius: '50%', border: '1px solid var(--navy)' }}></div>
            )}

            {/* NOTIFICATION DROPDOWN */}
            {isNotifOpen && (
              <div style={{
                position: 'absolute', top: '40px', right: '0', 
                background: 'var(--white)', borderRadius: '8px', 
                boxShadow: 'var(--shadow-lg)',
                minWidth: '220px', zIndex: 1000, overflow: 'hidden',
                border: '1px solid var(--border)', padding: '10px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '8px', color: 'var(--navy-text)' }}>Notifikasi</div>
                {user?.role !== 'admin' && (!user?.nip || !user?.coe || !user?.jabatan_fungsional) ? (
                  <Link to="/profil" onClick={() => setIsNotifOpen(false)} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', textDecoration: 'none', color: 'var(--text)' }}>
                    <span style={{ fontSize: '16px' }}>⚠️</span>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600 }}>Lengkapi Profil</div>
                      <div style={{ fontSize: '10px', color: 'var(--text3)', marginTop: '2px' }}>Profil Anda belum lengkap.</div>
                    </div>
                  </Link>
                ) : (
                  <div style={{ fontSize: '11px', color: 'var(--text3)', textAlign: 'center', padding: '10px 0' }}>Tidak ada notifikasi baru</div>
                )}
              </div>
            )}
          </div>

          <div className="nav-user" style={{ position: 'relative' }} onClick={(e) => {
            e.stopPropagation();
            setIsProfileOpen(!isProfileOpen);
            setIsNotifOpen(false);
          }}>
            <div className="nav-avatar">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : '??'}
            </div>
            <div className="nav-name">{user?.name || 'Loading...'}</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', marginLeft: '4px' }}>▼</div>

            {/* DROPDOWN MENU */}
            {isProfileOpen && (
              <div style={{
                position: 'absolute', top: '40px', right: '0',
                background: 'var(--white)', borderRadius: '8px',
                boxShadow: 'var(--shadow-lg)',
                minWidth: '150px', zIndex: 1000, overflow: 'hidden',
                border: '1px solid var(--border)'
              }}>
                <Link to="/profil" style={{ display: 'block', padding: '12px 15px', color: 'var(--text)', textDecoration: 'none', fontSize: '13px', borderBottom: '1px solid var(--border)', fontWeight: 500 }}>
                  Profil Saya
                </Link>
                <button 
                  onClick={async (e) => {
                    e.stopPropagation();
                    await logout();
                    navigate('/login');
                  }} 
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 15px', background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                >
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* MAIN LAYOUT */}
      <div className="layout">
        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div 
            className="sidebar-backdrop" 
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <main className="main-content">
          <div className="page-header flex-between">
            <div>
              <div className="page-title">{title}</div>
              {subtitle && <div className="page-sub">{subtitle}</div>}
            </div>
            {headerActions && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {headerActions}
              </div>
            )}
          </div>

          <div className="page-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
