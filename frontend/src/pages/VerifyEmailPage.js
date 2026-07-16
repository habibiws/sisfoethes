import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import logoBtfb from '../assets/ethes-btfb.png'; // transparent logo blue font

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Sedang memverifikasi email Anda...');

  useEffect(() => {
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email || !token) {
      setStatus('error');
      setMessage('Tautan verifikasi tidak valid atau tidak lengkap.');
      return;
    }

    api.post('/verify-email', { email, token })
      .then(res => {
        setStatus('success');
        setMessage(res.data.message || 'Email Anda berhasil diverifikasi!');
      })
      .catch(err => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Gagal memverifikasi email. Tautan mungkin kedaluwarsa.');
      });
  }, [searchParams]);

  return (
    <div className="auth-fullscreen-container">
      <div className="auth-card" style={{ maxWidth: '480px', flexDirection: 'column' }}>
        <div className="auth-card-header" style={{ marginBottom: '32px' }}>
          <img src={logoBtfb} alt="Logo EEAT" className="auth-card-logo" style={{ maxHeight: '50px' }} />
          <h2 className="auth-card-title">Verifikasi Akun</h2>
        </div>

        <div className="auth-step-wrapper text-center fade-in" style={{ textAlign: 'center' }}>
          {status === 'verifying' && (
            <div className="loading-spinner-container">
              <div className="spinner"></div>
              <p style={{ marginTop: '20px', color: 'var(--text2)', fontWeight: '500' }}>{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <h3 className="auth-form-title" style={{ color: 'var(--teal)' }}>Verifikasi Berhasil!</h3>
              <p style={{ color: 'var(--text2)', margin: '12px 0 24px 0', fontSize: '15px' }}>{message}</p>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/login')}>
                Masuk ke Portal
              </button>
            </div>
          )}

          {status === 'error' && (
            <div>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
              <h3 className="auth-form-title" style={{ color: 'var(--red)' }}>Verifikasi Gagal</h3>
              <p style={{ color: 'var(--text2)', margin: '12px 0 24px 0', fontSize: '15px' }}>{message}</p>
              <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => navigate('/login')}>
                Kembali ke Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
