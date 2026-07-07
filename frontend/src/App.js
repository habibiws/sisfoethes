import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import DashboardPage from './pages/DashboardPage';
import ProfilPage from './pages/ProfilPage';
import CapaianPage from './pages/CapaianPage';
import UserRolePage from './pages/UserRolePage';
import PelatihanPage from './pages/PelatihanPage';
import LaporanPage from './pages/LaporanPage';
import LaporanCategoryPage from './pages/LaporanCategoryPage';
import DevSettingsPage from './pages/DevSettingsPage';
import useAuthStore from './store/authStore';
import GlobalModal from './components/layout/GlobalModal';
import './index.css';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitialLoading } = useAuthStore();
  if (isInitialLoading) return <div className="loading-screen">Memuat...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { isAuthenticated, isInitialLoading } = useAuthStore();
  if (isInitialLoading) return <div className="loading-screen">Memuat...</div>;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  const { fetchUser, token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      // If no token, we are done with initial loading
      useAuthStore.setState({ isInitialLoading: false });
    }
  }, [token, fetchUser]);

  return (
    <Router>
      <GlobalModal />
      <Routes>
        <Route path="/login" element={<GuestRoute><AuthPage /></GuestRoute>} />
        <Route path="/verify-email" element={<GuestRoute><VerifyEmailPage /></GuestRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/profil" element={<ProtectedRoute><ProfilPage /></ProtectedRoute>} />
        <Route path="/capaian" element={<ProtectedRoute><CapaianPage /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><UserRolePage /></ProtectedRoute>} />
        <Route path="/pelatihan" element={<ProtectedRoute><PelatihanPage /></ProtectedRoute>} />
        <Route path="/laporan" element={<ProtectedRoute><LaporanPage /></ProtectedRoute>} />
        <Route path="/laporan/:category" element={<ProtectedRoute><LaporanCategoryPage /></ProtectedRoute>} />
        <Route path="/developer" element={<ProtectedRoute><DevSettingsPage /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
