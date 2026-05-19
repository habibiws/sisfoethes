import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import useModalStore from '../store/modalStore';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, isActionLoading, error: authError, clearError } = useAuthStore();
  const { showAlert } = useModalStore();
  const [tab, setTab] = useState('login'); // 'login' or 'register'
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regNidn, setRegNidn] = useState('');
  const [regProdi, setRegProdi] = useState('');
  const [regSubKk, setRegSubKk] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState('anggota');
  const [regPass, setRegPass] = useState('');
  const [regPassConfirm, setRegPassConfirm] = useState('');

  const [subKks, setSubKks] = useState([]);

  useEffect(() => {
    clearError();
    setIsSubmitting(false);
  }, [tab, clearError]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/sub-kks')
      .then(res => setSubKks(res.data))
      .catch(err => console.log('Backend not ready yet for sub-kks'));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPass) return showAlert('Isi email dan kata sandi.', 'Peringatan', 'error');

    setIsSubmitting(true);
    const success = await login(loginEmail, loginPass);
    setIsSubmitting(false);

    if (success) {
      navigate('/dashboard');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (regPass !== regPassConfirm) return showAlert('Kata sandi tidak cocok.', 'Kesalahan', 'error');

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
      setTab('login');
    }
  };

  return (
    <div className="auth-container">
      {/* LEFT PANEL */}
      <div className="auth-left">
        <div className="auth-brand-logo">
          <div className="auth-logo-box">KK</div>
          <div className="auth-brand-text">
            <div className="auth-brand-title">ETHES</div>
            <div className="auth-brand-sub">Tel-U Surabaya</div>
          </div>
        </div>
        <h1 className="auth-hero-headline">
          Sistem Informasi<br />
          <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Kelompok Keahlian</em><br />
          ETHES
        </h1>
        <p className="auth-hero-desc">
          Platform terpadu untuk pencatatan capaian Tridharma — publikasi, hibah, paten, pengabdian, pelatihan & sertifikasi — bagi seluruh dosen anggota KK Electrical Engineering and Advanced Technologies.
        </p>

        <div className="feature-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', zIndex: 10 }}>
          <div className="feature-item" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="feature-dot" style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>📄</div>
            <div className="feature-text" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}><strong style={{ color: 'white' }}>Input & Pantau Publikasi</strong> — jurnal internasional, prosiding</div>
          </div>
        </div>
        <p className="bottom-text" style={{ marginTop: '48px', fontSize: '12px', color: 'rgba(255,255,255,0.3)', position: 'relative', zIndex: 10 }}>© 2026 KK ETHES · Universitas Telkom Kampus Surabaya</p>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right">
        <div className="auth-box-wrap">

          <div className="auth-tabs">
            <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Masuk</button>
            <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>Daftar</button>
          </div>

          {successMsg && (
            <div className="alert alert-success">
              <span>✅</span> <span>{successMsg}</span>
            </div>
          )}

          {authError && (
            <div className="alert alert-danger">
              <span>⚠️</span> <span>{authError}</span>
            </div>
          )}

          {tab === 'login' && (
            <div>
              <div className="auth-title">Selamat Datang</div>
              <div className="auth-sub">Masuk dengan email institusi Anda</div>
              <form onSubmit={handleLogin}>
                <div className="form-group mb-12">
                  <label>Email Institusi <span className="req">*</span></label>
                  <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="nama@telkomuniversity.ac.id" />
                </div>
                <div className="form-group mb-16">
                  <label>Kata Sandi <span className="req">*</span></label>
                  <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="Kata sandi Anda" />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={isSubmitting}>
                  {isSubmitting ? 'Memproses...' : 'Login'}
                </button>
              </form>
            </div>
          )}

          {tab === 'register' && (
            <div>
              <div className="auth-title">Daftar Akun</div>

              <form onSubmit={handleRegister}>
                <div className="form-group mb-12">
                  <label>Nama Lengkap + Gelar <span className="req">*</span></label>
                  <input type="text" value={regName} onChange={e => setRegName(e.target.value)} required placeholder="cth: Mohamad Yani, S.T., M.Phil., Ph.D." />
                </div>

                <div className="form-grid mb-12">
                  <div className="form-group">
                    <label>NIDN <span className="req">*</span></label>
                    <input type="text" value={regNidn} onChange={e => setRegNidn(e.target.value)} required placeholder="0701038901" />
                  </div>
                  <div className="form-group">
                    <label>Program Studi <span className="req">*</span></label>
                    <select value={regProdi} onChange={e => setRegProdi(e.target.value)} required>
                      <option value="">-- Pilih --</option>
                      <option value="Teknik Elektro">Teknik Elektro</option>
                      <option value="Teknik Telekomunikasi">Teknik Telekomunikasi</option>
                      <option value="Teknik Komputer">Teknik Komputer</option>
                    </select>
                  </div>
                </div>

                <div className="form-group mb-12">
                  <label>Role / Peran <span className="req">*</span></label>
                  <select value={regRole} onChange={e => setRegRole(e.target.value)} required>
                    <option value="anggota">Anggota</option>
                    <option value="ketua_sub_kk">Ketua Sub-KK</option>
                    <option value="ketua_kk">Ketua KK</option>
                  </select>
                </div>

                <div className="form-group mb-12">
                  <label>Sub-Kelompok Keahlian <span className="req">*</span></label>
                  <select value={regSubKk} onChange={e => setRegSubKk(e.target.value)} required>
                    <option value="">-- Pilih Sub-KK --</option>
                    {subKks.length > 0 ? (
                      subKks.map(sk => <option key={sk.id} value={sk.id}>{sk.name}</option>)
                    ) : (
                      <>
                        <option value="1">CORES — Control, Automation, Robotics & Embedded</option>
                        <option value="2">PORSCE — Power System & Energy Conversion</option>
                        <option value="3">BEE — Basic Electronics</option>
                        <option value="4">COMMET — Communication Network</option>
                        <option value="5">COS(PI) — Telecommunication & Signal Processing</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="form-group mb-12">
                  <label>Email Institusi <span className="req">*</span></label>
                  <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required placeholder="nama@telkomuniversity.ac.id" />
                </div>

                <div className="form-grid mb-16">
                  <div className="form-group">
                    <label>Kata Sandi <span className="req">*</span></label>
                    <input type="password" value={regPass} onChange={e => setRegPass(e.target.value)} required placeholder="Min. 8 karakter" />
                  </div>
                  <div className="form-group">
                    <label>Konfirmasi Sandi <span className="req">*</span></label>
                    <input type="password" value={regPassConfirm} onChange={e => setRegPassConfirm(e.target.value)} required placeholder="Ulangi sandi" />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={isSubmitting}>
                  {isSubmitting ? 'Memproses...' : 'Buat Akun'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
