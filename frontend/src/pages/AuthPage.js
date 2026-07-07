import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import useModalStore from '../store/modalStore';
import logoBbfw from '../assets/ethes-bbfw.png'; // Blue background font white logo

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, isActionLoading, error: authError, clearError } = useAuthStore();
  const { showAlert } = useModalStore();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  
  // Login Steps: 'email' -> 'password'
  const [loginStep, setLoginStep] = useState('email'); 
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register Steps: 
  // 1: name -> 2: nidn -> 3: prodi -> 4: subkk -> 5: role -> 6: email -> 7: password
  const [registerStep, setRegisterStep] = useState(1);
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
    if (mode === 'login') {
      setLoginStep('email');
    } else {
      setRegisterStep(1);
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

  // Register Step-by-Step Handlers
  const handleRegisterNext = (e) => {
    e.preventDefault();
    if (registerStep === 1 && !regName) return showAlert('Harap isi nama lengkap Anda.', 'Peringatan', 'error');
    if (registerStep === 2 && !regNidn) return showAlert('Harap isi NIDN Anda.', 'Peringatan', 'error');
    if (registerStep === 3 && !regProdi) return showAlert('Harap pilih program studi.', 'Peringatan', 'error');
    if (registerStep === 4 && !regSubKk) return showAlert('Harap pilih sub-kelompok keahlian.', 'Peringatan', 'error');
    if (registerStep === 5 && !regRole) return showAlert('Harap pilih peran.', 'Peringatan', 'error');
    if (registerStep === 6) {
      if (!regEmail) return showAlert('Harap isi email institusi Anda.', 'Peringatan', 'error');
      if (!validateEmail(regEmail)) return showAlert('Format email tidak valid.', 'Peringatan', 'error');
    }
    
    setRegisterStep(prev => prev + 1);
  };

  const handleRegisterBack = () => {
    setRegisterStep(prev => Math.max(1, prev - 1));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regPass || !regPassConfirm) {
      return showAlert('Harap isi kata sandi dan konfirmasi.', 'Peringatan', 'error');
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

  // Get current sub_kk name for display
  const selectedSubKkName = subKks.find(sk => String(sk.id) === String(regSubKk))?.name || '';

  return (
    <div className="auth-fullscreen-container">
      <div className="auth-card">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: BRANDING & DESCRIPTIVE STATE */}
        {/* ========================================================================= */}
        <div className="auth-card-left">
          <img src={logoBbfw} alt="Logo EEATS" className="auth-card-logo" />
          
          <div className="auth-left-content fade-in">
            {mode === 'login' ? (
              <>
                <h2 className="auth-left-title">{loginStep === 'email' ? 'Login' : 'Selamat Datang'}</h2>
                <p className="auth-left-subtitle">
                  {loginStep === 'email' ? 'Gunakan email anda' : 'Masukkan sandi untuk melanjutkan'}
                </p>
              </>
            ) : (
              <>
                <h2 className="auth-left-title">Daftar Akun</h2>
                <p className="auth-left-subtitle">
                  {registerStep === 1 && 'Langkah 1: Tulis nama lengkap Anda'}
                  {registerStep === 2 && 'Langkah 2: Tulis NIDN Anda'}
                  {registerStep === 3 && 'Langkah 3: Pilih program studi Anda'}
                  {registerStep === 4 && 'Langkah 4: Pilih sub-kelompok keahlian'}
                  {registerStep === 5 && 'Langkah 5: Tentukan peran/jabatan Anda'}
                  {registerStep === 6 && 'Langkah 6: Gunakan email institusi Anda'}
                  {registerStep === 7 && 'Langkah 7: Buat kata sandi akun'}
                </p>
              </>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: ACTION & INPUT FIELDS */}
        {/* ========================================================================= */}
        <div className="auth-card-right">
          
          {authError && (
            <div className="auth-alert alert-danger">
              <span>⚠️</span> <span>{authError}</span>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* LOGIN MODE */}
          {/* ──────────────────────────────────────────────────────── */}
          {mode === 'login' && (
            <div className="auth-step-wrapper">
              
              {/* Step 1: Input Email */}
              {loginStep === 'email' && (
                <form onSubmit={handleLoginEmailNext} className="auth-form fade-in">
                  <div className="form-group mb-24">
                    <div className="floating-input-container">
                      <input 
                        type="email" 
                        id="loginEmail"
                        value={loginEmail} 
                        onChange={e => setLoginEmail(e.target.value)} 
                        placeholder=" "
                        required
                        autoFocus
                      />
                      <label htmlFor="loginEmail">Email</label>
                    </div>
                  </div>

                  <div className="auth-action-row">
                    <button type="button" className="btn-text" onClick={() => setMode('register')}>
                      Buat akun
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Berikutnya
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: Input Password */}
              {loginStep === 'password' && (
                <form onSubmit={handleLoginSubmit} className="auth-form fade-in">
                  {/* Identity Pill */}
                  <div className="auth-identity-pill" onClick={() => setLoginStep('email')}>
                    <span>{loginEmail}</span>
                    <span className="pill-arrow">▼</span>
                  </div>

                  <div className="form-group mb-24">
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
                      <label htmlFor="loginPass">Masukkan sandi Anda</label>
                    </div>
                  </div>

                  <div className="auth-action-row">
                    <button type="button" className="btn-text" onClick={() => setLoginStep('email')}>
                      Ganti email
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? 'Memproses...' : 'Berikutnya'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* REGISTER MODE (Multi-step single data cards) */}
          {/* ──────────────────────────────────────────────────────── */}
          {mode === 'register' && (
            <div className="auth-step-wrapper">
              
              {/* Step 1: Nama Lengkap */}
              {registerStep === 1 && (
                <form onSubmit={handleRegisterNext} className="auth-form fade-in">
                  <div className="form-group mb-24">
                    <div className="floating-input-container">
                      <input 
                        type="text" 
                        id="regName"
                        value={regName} 
                        onChange={e => setRegName(e.target.value)} 
                        placeholder=" "
                        required
                        autoFocus
                      />
                      <label htmlFor="regName">Nama Lengkap & Gelar</label>
                    </div>
                  </div>

                  <div className="auth-action-row">
                    <button type="button" className="btn-text" onClick={() => setMode('login')}>
                      Login saja
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Berikutnya
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: NIDN */}
              {registerStep === 2 && (
                <form onSubmit={handleRegisterNext} className="auth-form fade-in">
                  <div className="auth-badge-info">Nama: <strong>{regName}</strong></div>

                  <div className="form-group mb-24">
                    <div className="floating-input-container">
                      <input 
                        type="text" 
                        id="regNidn"
                        value={regNidn} 
                        onChange={e => setRegNidn(e.target.value)} 
                        placeholder=" "
                        required
                        autoFocus
                      />
                      <label htmlFor="regNidn">NIDN</label>
                    </div>
                  </div>

                  <div className="auth-action-row">
                    <button type="button" className="btn-secondary" onClick={handleRegisterBack}>
                      Kembali
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Berikutnya
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Program Studi */}
              {registerStep === 3 && (
                <form onSubmit={handleRegisterNext} className="auth-form fade-in">
                  <div className="auth-badge-info">NIDN: <strong>{regNidn}</strong></div>

                  <div className="form-group mb-24">
                    <select 
                      className="styled-select"
                      value={regProdi} 
                      onChange={e => setRegProdi(e.target.value)} 
                      required
                      autoFocus
                    >
                      <option value="">Pilih Program Studi</option>
                      <option value="Teknik Elektro">Teknik Elektro</option>
                      <option value="Teknik Telekomunikasi">Teknik Telekomunikasi</option>
                      <option value="Teknik Komputer">Teknik Komputer</option>
                    </select>
                  </div>

                  <div className="auth-action-row">
                    <button type="button" className="btn-secondary" onClick={handleRegisterBack}>
                      Kembali
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Berikutnya
                    </button>
                  </div>
                </form>
              )}

              {/* Step 4: Sub-Kelompok Keahlian */}
              {registerStep === 4 && (
                <form onSubmit={handleRegisterNext} className="auth-form fade-in">
                  <div className="auth-badge-info">Prodi: <strong>{regProdi}</strong></div>

                  <div className="form-group mb-24">
                    <select 
                      className="styled-select"
                      value={regSubKk} 
                      onChange={e => setRegSubKk(e.target.value)} 
                      required
                      autoFocus
                    >
                      <option value="">Pilih Sub-KK</option>
                      {subKks.map(sk => (
                        <option key={sk.id} value={sk.id}>{sk.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="auth-action-row">
                    <button type="button" className="btn-secondary" onClick={handleRegisterBack}>
                      Kembali
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Berikutnya
                    </button>
                  </div>
                </form>
              )}

              {/* Step 5: Peran */}
              {registerStep === 5 && (
                <form onSubmit={handleRegisterNext} className="auth-form fade-in">
                  <div className="auth-badge-info">Sub-KK: <strong>{selectedSubKkName}</strong></div>

                  <div className="form-group mb-24">
                    <select 
                      className="styled-select"
                      value={regRole} 
                      onChange={e => setRegRole(e.target.value)} 
                      required
                      autoFocus
                    >
                      <option value="anggota">Anggota</option>
                      <option value="ketua_sub_kk">Ketua Sub-KK</option>
                      <option value="ketua_kk">Ketua KK</option>
                    </select>
                  </div>

                  <div className="auth-action-row">
                    <button type="button" className="btn-secondary" onClick={handleRegisterBack}>
                      Kembali
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Berikutnya
                    </button>
                  </div>
                </form>
              )}

              {/* Step 6: Email Institusi */}
              {registerStep === 6 && (
                <form onSubmit={handleRegisterNext} className="auth-form fade-in">
                  <div className="auth-badge-info">Peran: <strong>{regRole}</strong></div>

                  <div className="form-group mb-24">
                    <div className="floating-input-container">
                      <input 
                        type="email" 
                        id="regEmail"
                        value={regEmail} 
                        onChange={e => setRegEmail(e.target.value)} 
                        placeholder=" "
                        required
                        autoFocus
                      />
                      <label htmlFor="regEmail">Email Institusi (@telkomuniversity.ac.id)</label>
                    </div>
                  </div>

                  <div className="auth-action-row">
                    <button type="button" className="btn-secondary" onClick={handleRegisterBack}>
                      Kembali
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Berikutnya
                    </button>
                  </div>
                </form>
              )}

              {/* Step 7: Kata Sandi */}
              {registerStep === 7 && (
                <form onSubmit={handleRegisterSubmit} className="auth-form fade-in">
                  <div className="auth-badge-info">Email: <strong>{regEmail}</strong></div>

                  <div className="form-group mb-16">
                    <div className="floating-input-container">
                      <input 
                        type="password" 
                        id="regPass"
                        value={regPass} 
                        onChange={e => setRegPass(e.target.value)} 
                        placeholder=" "
                        required
                        autoFocus
                      />
                      <label htmlFor="regPass">Kata Sandi (Min. 8 karakter)</label>
                    </div>
                  </div>

                  <div className="form-group mb-24">
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
                    <button type="button" className="btn-secondary" onClick={handleRegisterBack}>
                      Kembali
                    </button>
                    <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                      {isSubmitting ? 'Memproses...' : 'Daftar Sekarang'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
