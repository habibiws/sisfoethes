import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import useModalStore from '../store/modalStore';
import logoKkEthes from '../assets/logo-kk-ethes.png';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, isActionLoading, error: authError, clearError } = useAuthStore();
  const { showAlert } = useModalStore();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  
  // Login Steps: 'email' -> 'password'
  const [loginStep, setLoginStep] = useState('email'); 
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register Steps: 'personal' -> 'role' -> 'credentials'
  const [registerStep, setRegisterStep] = useState('personal');
  const [regName, setRegName] = useState('');
  const [regNidn, setRegNidn] = useState('');
  const [regProdi, setRegProdi] = useState('');
  const [regSubKk, setRegSubKk] = useState('');
  const [regRole, setRegRole] = useState('anggota');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regPassConfirm, setRegPassConfirm] = useState('');

  const [subKks, setSubKks] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    clearError();
    setIsSubmitting(false);
    // Reset steps when switching mode
    if (mode === 'login') {
      setLoginStep('email');
    } else {
      setRegisterStep('personal');
    }
  }, [mode, clearError]);

  useEffect(() => {
    api.get('/sub-kks')
      .then(res => setSubKks(res.data))
      .catch(err => console.log('Backend not ready yet for sub-kks'));
  }, []);

  // Validation helpers
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  // Login Handlers
  const handleLoginEmailNext = (e) => {
    e.preventDefault();
    if (!loginEmail) {
      return showAlert('Silakan masukkan email Anda.', 'Peringatan', 'error');
    }
    if (!validateEmail(loginEmail)) {
      return showAlert('Format email tidak valid.', 'Peringatan', 'error');
    }
    setLoginStep('password');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginPass) {
      return showAlert('Silakan masukkan kata sandi Anda.', 'Peringatan', 'error');
    }

    setIsSubmitting(true);
    const success = await login(loginEmail, loginPass);
    setIsSubmitting(false);

    if (success) {
      navigate('/dashboard');
    }
  };

  // Register Handlers
  const handleRegisterPersonalNext = (e) => {
    e.preventDefault();
    if (!regName || !regNidn || !regProdi || !regSubKk) {
      return showAlert('Harap isi semua data pribadi.', 'Peringatan', 'error');
    }
    setRegisterStep('role');
  };

  const handleRegisterRoleNext = (e) => {
    e.preventDefault();
    if (!regRole) {
      return showAlert('Harap pilih peran Anda.', 'Peringatan', 'error');
    }
    setRegisterStep('credentials');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regEmail || !regPass || !regPassConfirm) {
      return showAlert('Harap isi email dan kata sandi.', 'Peringatan', 'error');
    }
    if (!validateEmail(regEmail)) {
      return showAlert('Format email tidak valid.', 'Peringatan', 'error');
    }
    if (regPass.length < 8) {
      return showAlert('Kata sandi minimal 8 karakter.', 'Peringatan', 'error');
    }
    if (regPass !== regPassConfirm) {
      return showAlert('Konfirmasi kata sandi tidak cocok.', 'Kesalahan', 'error');
    }

    setIsSubmitting(true);
    const success = await register({
      name: regName,
      nidn: regNidn,
      email: regEmail,
      password: regPass,
      prodi: regProdi,
      sub_kk_id: regSubKk,
      role: regRole
    });
    setIsSubmitting(false);

    if (success) {
      showAlert('Pendaftaran berhasil! Silakan masuk.', 'Berhasil', 'success');
      setRegName('');
      setRegNidn('');
      setRegEmail('');
      setRegPass('');
      setRegPassConfirm('');
      setRegProdi('');
      setRegSubKk('');
      setMode('login');
    }
  };

  return (
    <div className="auth-fullscreen-container">
      <div className="auth-card">
        {/* Logo and Brand */}
        <div className="auth-card-header">
          <img src={logoKkEthes} alt="Logo EEATS" className="auth-card-logo" />
          <h2 className="auth-card-title">EEATS Portal</h2>
          <p className="auth-card-subtitle">Sistem Informasi Kelompok Keahlian</p>
        </div>

        {authError && (
          <div className="auth-alert alert-danger">
            <span>⚠️</span> <span>{authError}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* LOGIN MODE */}
        {/* ========================================================================= */}
        {mode === 'login' && (
          <div className="auth-step-wrapper">
            {loginStep === 'email' && (
              <form onSubmit={handleLoginEmailNext} className="auth-form fade-in">
                <h3 className="auth-form-title">Login</h3>
                <p className="auth-form-desc">Gunakan Akun Institusi Telkom University Anda</p>
                
                <div className="form-group mb-20">
                  <div className="floating-input-container">
                    <input 
                      type="email" 
                      id="loginEmail"
                      value={loginEmail} 
                      onChange={e => setLoginEmail(e.target.value)} 
                      placeholder=" "
                      required
                    />
                    <label htmlFor="loginEmail">Email</label>
                  </div>
                </div>

                <div className="auth-action-row">
                  <button type="button" className="btn-text" onClick={() => setMode('register')}>
                    Buat akun baru
                  </button>
                  <button type="submit" className="btn btn-primary btn-next">
                    Berikutnya
                  </button>
                </div>
              </form>
            )}

            {loginStep === 'password' && (
              <form onSubmit={handleLoginSubmit} className="auth-form fade-in">
                <h3 className="auth-form-title">Selamat Datang</h3>
                
                {/* Active Email indicator (like Google) */}
                <div className="auth-identity-pill" onClick={() => setLoginStep('email')}>
                  <span>{loginEmail}</span>
                  <span className="pill-arrow">▼</span>
                </div>

                <div className="form-group mb-20">
                  <div className="floating-input-container">
                    <input 
                      type="password" 
                      id="loginPass"
                      value={loginPass} 
                      onChange={e => setLoginPass(e.target.value)} 
                      placeholder=" "
                      required
                      autoFocus
                    />
                    <label htmlFor="loginPass">Masukkan Kata Sandi</label>
                  </div>
                </div>

                <div className="auth-action-row">
                  <button type="button" className="btn-text" onClick={() => setLoginStep('email')}>
                    Ganti email
                  </button>
                  <button type="submit" className="btn btn-primary btn-next" disabled={isSubmitting}>
                    {isSubmitting ? 'Memproses...' : 'Masuk'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* REGISTER MODE */}
        {/* ========================================================================= */}
        {mode === 'register' && (
          <div className="auth-step-wrapper">
            {/* Step indicator */}
            <div className="auth-progress-bar">
              <div className={`progress-segment ${registerStep === 'personal' ? 'active' : ''}`}>Data Diri</div>
              <div className={`progress-segment ${registerStep === 'role' ? 'active' : ''}`}>Peran</div>
              <div className={`progress-segment ${registerStep === 'credentials' ? 'active' : ''}`}>Kredensial</div>
            </div>

            {/* Step 1: Personal */}
            {registerStep === 'personal' && (
              <form onSubmit={handleRegisterPersonalNext} className="auth-form fade-in">
                <h3 className="auth-form-title">Buat Akun</h3>
                <p className="auth-form-desc">Langkah 1: Masukkan data diri akademis Anda</p>

                <div className="form-group mb-16">
                  <div className="floating-input-container">
                    <input 
                      type="text" 
                      id="regName"
                      value={regName} 
                      onChange={e => setRegName(e.target.value)} 
                      placeholder=" "
                      required
                    />
                    <label htmlFor="regName">Nama Lengkap & Gelar</label>
                  </div>
                </div>

                <div className="form-group mb-16">
                  <div className="floating-input-container">
                    <input 
                      type="text" 
                      id="regNidn"
                      value={regNidn} 
                      onChange={e => setRegNidn(e.target.value)} 
                      placeholder=" "
                      required
                    />
                    <label htmlFor="regNidn">NIDN</label>
                  </div>
                </div>

                <div className="form-group mb-16">
                  <select 
                    className="styled-select"
                    value={regProdi} 
                    onChange={e => setRegProdi(e.target.value)} 
                    required
                  >
                    <option value="">Pilih Program Studi</option>
                    <option value="Teknik Elektro">Teknik Elektro</option>
                    <option value="Teknik Telekomunikasi">Teknik Telekomunikasi</option>
                    <option value="Teknik Komputer">Teknik Komputer</option>
                  </select>
                </div>

                <div className="form-group mb-20">
                  <select 
                    className="styled-select"
                    value={regSubKk} 
                    onChange={e => setRegSubKk(e.target.value)} 
                    required
                  >
                    <option value="">Pilih Sub-Kelompok Keahlian</option>
                    {subKks.map(sk => (
                      <option key={sk.id} value={sk.id}>{sk.name}</option>
                    ))}
                  </select>
                </div>

                <div className="auth-action-row">
                  <button type="button" className="btn-text" onClick={() => setMode('login')}>
                    Sudah punya akun?
                  </button>
                  <button type="submit" className="btn btn-primary btn-next">
                    Berikutnya
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Role */}
            {registerStep === 'role' && (
              <form onSubmit={handleRegisterRoleNext} className="auth-form fade-in">
                <h3 className="auth-form-title">Pilih Peran</h3>
                <p className="auth-form-desc">Langkah 2: Tentukan jabatan Anda di Kelompok Keahlian</p>

                <div className="form-group mb-24">
                  <select 
                    className="styled-select"
                    value={regRole} 
                    onChange={e => setRegRole(e.target.value)} 
                    required
                  >
                    <option value="anggota">Anggota</option>
                    <option value="ketua_sub_kk">Ketua Sub-KK</option>
                    <option value="ketua_kk">Ketua KK</option>
                  </select>
                </div>

                <div className="auth-action-row">
                  <button type="button" className="btn-secondary" onClick={() => setRegisterStep('personal')}>
                    Kembali
                  </button>
                  <button type="submit" className="btn btn-primary btn-next">
                    Berikutnya
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Credentials */}
            {registerStep === 'credentials' && (
              <form onSubmit={handleRegisterSubmit} className="auth-form fade-in">
                <h3 className="auth-form-title">Kredensial Login</h3>
                <p className="auth-form-desc">Langkah 3: Masukkan email dan buat kata sandi baru</p>

                <div className="form-group mb-16">
                  <div className="floating-input-container">
                    <input 
                      type="email" 
                      id="regEmail"
                      value={regEmail} 
                      onChange={e => setRegEmail(e.target.value)} 
                      placeholder=" "
                      required
                    />
                    <label htmlFor="regEmail">Email Institusi (@telkomuniversity.ac.id)</label>
                  </div>
                </div>

                <div className="form-group mb-16">
                  <div className="floating-input-container">
                    <input 
                      type="password" 
                      id="regPass"
                      value={regPass} 
                      onChange={e => setRegPass(e.target.value)} 
                      placeholder=" "
                      required
                    />
                    <label htmlFor="regPass">Kata Sandi (Min. 8 karakter)</label>
                  </div>
                </div>

                <div className="form-group mb-20">
                  <div className="floating-input-container">
                    <input 
                      type="password" 
                      id="regPassConfirm"
                      value={regPassConfirm} 
                      onChange={e => setRegPassConfirm(e.target.value)} 
                      placeholder=" "
                      required
                    />
                    <label htmlFor="regPassConfirm">Konfirmasi Kata Sandi</label>
                  </div>
                </div>

                <div className="auth-action-row">
                  <button type="button" className="btn-secondary" onClick={() => setRegisterStep('role')}>
                    Kembali
                  </button>
                  <button type="submit" className="btn btn-success btn-next" disabled={isSubmitting}>
                    {isSubmitting ? 'Membuat Akun...' : 'Daftar Sekarang'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
