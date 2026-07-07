import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import useModalStore from '../store/modalStore';
import logoBtfb from '../assets/ethes-btfb.png'; // Transparent background blue text logo

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, isActionLoading, error: authError, clearError } = useAuthStore();
  const { showAlert } = useModalStore();

  const [mode, setMode] = useState('login'); // 'login', 'register', 'forgot', 'reset'
  const [localError, setLocalError] = useState('');
  
  // Login State
  const [loginStep, setLoginStep] = useState('email'); 
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Forgot / Reset Password State
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newPassConfirm, setNewPassConfirm] = useState('');

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
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    clearError();
    setLocalError('');
    setIsVerifying(false);
    if (mode === 'login') {
      setLoginStep('email');
    } else if (mode === 'register') {
      setRegisterStep(1);
    }
  }, [mode, clearError]);

  useEffect(() => {
    api.get('/sub-kks')
      .then(res => setSubKks(res.data))
      .catch(err => console.log('Backend not ready yet for sub-kks'));
  }, []);

  // Validation helper
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  // Login Email Step Verification (Google Style check)
  const handleLoginEmailNext = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!loginEmail) return setLocalError('Silakan masukkan email Anda.');
    if (!validateEmail(loginEmail)) return setLocalError('Format email tidak valid.');

    setIsVerifying(true);
    try {
      const res = await api.post('/check-email', { email: loginEmail });
      setIsVerifying(false);
      if (res.data.exists) {
        setLoginStep('password');
      } else {
        setLocalError('Email tidak ditemukan. Silakan buat akun baru.');
      }
    } catch (err) {
      setIsVerifying(false);
      setLocalError('Gagal memeriksa email. Silakan coba sesaat lagi.');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!loginPass) return setLocalError('Silakan masukkan kata sandi.');

    setIsVerifying(true);
    const success = await login(loginEmail, loginPass);
    setIsVerifying(false);

    if (success) {
      navigate('/dashboard');
    }
  };

  // Forgot Password Submit
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!resetEmail) return setLocalError('Silakan masukkan email.');
    if (!validateEmail(resetEmail)) return setLocalError('Format email tidak valid.');

    setIsVerifying(true);
    try {
      const res = await api.post('/forgot-password', { email: resetEmail });
      setIsVerifying(false);
      showAlert(res.data.message || 'Kode reset berhasil dikirim!', 'Berhasil', 'success');
      setMode('reset');
    } catch (err) {
      setIsVerifying(false);
      setLocalError(err.response?.data?.message || 'Email tidak terdaftar atau gagal mengirim email.');
    }
  };

  // Reset Password Submit
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!resetCode || !newPass || !newPassConfirm) return setLocalError('Harap lengkapi semua kolom.');
    if (newPass.length < 8) return setLocalError('Sandi minimal 8 karakter.');
    if (newPass !== newPassConfirm) return setLocalError('Konfirmasi sandi tidak cocok.');

    setIsVerifying(true);
    try {
      const res = await api.post('/reset-password', {
        email: resetEmail,
        token: resetCode,
        password: newPass,
        password_confirmation: newPassConfirm
      });
      setIsVerifying(false);
      showAlert(res.data.message || 'Sandi berhasil diatur ulang!', 'Berhasil', 'success');
      setLoginEmail(resetEmail);
      setResetEmail('');
      setResetCode('');
      setNewPass('');
      setNewPassConfirm('');
      setMode('login');
      setLoginStep('password');
    } catch (err) {
      setIsVerifying(false);
      setLocalError(err.response?.data?.message || 'Kode reset salah atau kedaluwarsa.');
    }
  };

  // Register Step-by-Step Inline Verification
  const handleRegisterNext = async (e) => {
    e.preventDefault();
    setLocalError('');

    // Inline validation checks
    if (registerStep === 1) {
      if (!regName) return setLocalError('Nama lengkap wajib diisi.');
      setRegisterStep(2);
    } else if (registerStep === 2) {
      if (!regNidn) return setLocalError('NIDN wajib diisi.');
      setIsVerifying(true);
      try {
        const res = await api.post('/check-nidn', { nidn: regNidn });
        setIsVerifying(false);
        if (res.data.exists) {
          setLocalError('NIDN sudah terdaftar. Gunakan NIDN lain.');
        } else {
          setRegisterStep(3);
        }
      } catch (err) {
        setIsVerifying(false);
        setLocalError('Gagal memverifikasi NIDN. Coba lagi.');
      }
    } else if (registerStep === 3) {
      if (!regProdi) return setLocalError('Harap pilih program studi.');
      setRegisterStep(4);
    } else if (registerStep === 4) {
      if (!regSubKk) return setLocalError('Harap pilih sub-kelompok keahlian.');
      setRegisterStep(5);
    } else if (registerStep === 5) {
      if (!regRole) return setLocalError('Harap pilih peran.');
      setRegisterStep(6);
    } else if (registerStep === 6) {
      if (!regEmail) return setLocalError('Email institusi wajib diisi.');
      if (!validateEmail(regEmail)) return setLocalError('Format email tidak valid.');
      
      setIsVerifying(true);
      try {
        const res = await api.post('/check-email', { email: regEmail });
        setIsVerifying(false);
        if (res.data.exists) {
          setLocalError('Email ini sudah terdaftar.');
        } else {
          setRegisterStep(7);
        }
      } catch (err) {
        setIsVerifying(false);
        setLocalError('Gagal memverifikasi email. Coba lagi.');
      }
    }
  };

  const handleRegisterBack = () => {
    setLocalError('');
    setRegisterStep(prev => Math.max(1, prev - 1));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!regPass || !regPassConfirm) return setLocalError('Harap isi kata sandi.');
    if (regPass.length < 8) return setLocalError('Kata sandi minimal 8 karakter.');
    if (regPass !== regPassConfirm) return setLocalError('Konfirmasi kata sandi tidak cocok.');

    setIsVerifying(true);
    const success = await register({
      name: regName,
      nidn: regNidn,
      email: regEmail,
      password: regPass,
      prodi: regProdi,
      sub_kk_id: regSubKk,
      role: regRole
    });
    setIsVerifying(false);

    if (success) {
      showAlert('Registrasi berhasil! Silakan periksa inbox email Anda untuk melakukan verifikasi akun sebelum masuk.', 'Registrasi Berhasil', 'success');
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

  const selectedSubKkName = subKks.find(sk => String(sk.id) === String(regSubKk))?.name || '';

  return (
    <div className="auth-fullscreen-container">
      <div className="auth-card">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: BRANDING & DESCRIPTIVE STATE */}
        {/* ========================================================================= */}
        <div className="auth-card-left">
          <img src={logoBtfb} alt="Logo EEATS" className="auth-card-logo" />
          
          <div className="auth-left-content fade-in">
            {mode === 'login' && (
              <>
                <h2 className="auth-left-title">{loginStep === 'email' ? 'Login' : 'Selamat Datang'}</h2>
                <p className="auth-left-subtitle">
                  {loginStep === 'email' ? 'Gunakan email institusi Anda' : 'Masukkan kata sandi untuk melanjutkan'}
                </p>
              </>
            )}

            {mode === 'register' && (
              <>
                <h2 className="auth-left-title">Daftar Akun</h2>
                <p className="auth-left-subtitle">
                  {registerStep === 1 && 'Langkah 1: Masukkan nama lengkap & gelar Anda'}
                  {registerStep === 2 && 'Langkah 2: Masukkan NIDN resmi Anda'}
                  {registerStep === 3 && 'Langkah 3: Pilih program studi Anda'}
                  {registerStep === 4 && 'Langkah 4: Tentukan sub-kelompok keahlian Anda'}
                  {registerStep === 5 && 'Langkah 5: Pilih jabatan/peran Anda di KK'}
                  {registerStep === 6 && 'Langkah 6: Gunakan email institusi aktif'}
                  {registerStep === 7 && 'Langkah 7: Buat kata sandi akun Anda'}
                </p>
              </>
            )}

            {mode === 'forgot' && (
              <>
                <h2 className="auth-left-title">Lupa Sandi</h2>
                <p className="auth-left-subtitle">Masukkan email Anda untuk menerima kode verifikasi pemulihan</p>
              </>
            )}

            {mode === 'reset' && (
              <>
                <h2 className="auth-left-title">Reset Sandi</h2>
                <p className="auth-left-subtitle">Masukkan kode verifikasi reset dari email beserta sandi baru Anda</p>
              </>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: ACTION & INPUT FIELDS */}
        {/* ========================================================================= */}
        <div className="auth-card-right">
          
          {/* Display Backend or Inline Validation Errors */}
          {(authError || localError) && (
            <div className="auth-alert alert-danger fade-in">
              <span>⚠️</span> <span>{localError || authError}</span>
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
                    <button type="submit" className="btn btn-primary" disabled={isVerifying}>
                      {isVerifying ? 'Memeriksa...' : 'Berikutnya'}
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
                    <button type="button" className="btn-text" onClick={() => { setResetEmail(loginEmail); setMode('forgot'); }}>
                      Lupa sandi?
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isActionLoading || isVerifying}>
                      {isActionLoading || isVerifying ? 'Memproses...' : 'Masuk'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* FORGOT PASSWORD MODE */}
          {/* ──────────────────────────────────────────────────────── */}
          {mode === 'forgot' && (
            <div className="auth-step-wrapper">
              <form onSubmit={handleForgotSubmit} className="auth-form fade-in">
                <div className="form-group mb-24">
                  <div className="floating-input-container">
                    <input 
                      type="email" 
                      id="resetEmail"
                      value={resetEmail} 
                      onChange={e => setResetEmail(e.target.value)} 
                      placeholder=" "
                      required
                      autoFocus
                    />
                    <label htmlFor="resetEmail">Email Terdaftar</label>
                  </div>
                </div>

                <div className="auth-action-row">
                  <button type="button" className="btn-secondary" onClick={() => setMode('login')}>
                    Kembali
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isVerifying}>
                    {isVerifying ? 'Mengirim...' : 'Kirim Kode'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* RESET PASSWORD MODE */}
          {/* ──────────────────────────────────────────────────────── */}
          {mode === 'reset' && (
            <div className="auth-step-wrapper">
              <form onSubmit={handleResetSubmit} className="auth-form fade-in">
                <div className="auth-badge-info">Email: <strong>{resetEmail}</strong></div>

                <div className="form-group mb-16">
                  <div className="floating-input-container">
                    <input 
                      type="text" 
                      id="resetCode"
                      value={resetCode} 
                      onChange={e => setResetCode(e.target.value)} 
                      placeholder=" "
                      required
                      autoFocus
                    />
                    <label htmlFor="resetCode">Kode Verifikasi (6-Digit)</label>
                  </div>
                </div>

                <div className="form-group mb-16">
                  <div className="floating-input-container">
                    <input 
                      type="password" 
                      id="newPass"
                      value={newPass} 
                      onChange={e => setNewPass(e.target.value)} 
                      placeholder=" "
                      required
                    />
                    <label htmlFor="newPass">Kata Sandi Baru</label>
                  </div>
                </div>

                <div className="form-group mb-24">
                  <div className="floating-input-container">
                    <input 
                      type="password" 
                      id="newPassConfirm"
                      value={newPassConfirm} 
                      onChange={e => setNewPassConfirm(e.target.value)} 
                      placeholder=" "
                      required
                    />
                    <label htmlFor="newPassConfirm">Ulangi Sandi Baru</label>
                  </div>
                </div>

                <div className="auth-action-row">
                  <button type="button" className="btn-secondary" onClick={() => setMode('forgot')}>
                    Kirim Ulang
                  </button>
                  <button type="submit" className="btn btn-success" disabled={isVerifying}>
                    {isVerifying ? 'Memproses...' : 'Ubah Sandi'}
                  </button>
                </div>
              </form>
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
                    <button type="submit" className="btn btn-primary" disabled={isVerifying}>
                      {isVerifying ? 'Memeriksa...' : 'Berikutnya'}
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
                    <button type="submit" className="btn btn-primary" disabled={isVerifying}>
                      {isVerifying ? 'Memeriksa...' : 'Berikutnya'}
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
                    <button type="submit" className="btn btn-success" disabled={isActionLoading || isVerifying}>
                      {isActionLoading || isVerifying ? 'Memproses...' : 'Daftar Sekarang'}
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
