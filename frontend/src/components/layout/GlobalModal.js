import React from 'react';
import useModalStore from '../../store/modalStore';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export default function GlobalModal() {
  const { alertConfig, confirmConfig, hideAlert, hideConfirm } = useModalStore();

  if (!alertConfig && !confirmConfig) return null;

  return (
    <>
      {alertConfig && (
        <div className="modal-overlay" onClick={hideAlert} style={{ zIndex: 20000 }}>
          <div className="modal animate-pop" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              {alertConfig.type === 'error' ? (
                <div style={{ background: '#FCE4EC', color: '#C2185B', padding: '16px', borderRadius: '50%' }}>
                  <AlertCircle size={32} />
                </div>
              ) : alertConfig.type === 'success' ? (
                <div style={{ background: '#E6F4E4', color: '#2E7D32', padding: '16px', borderRadius: '50%' }}>
                  <CheckCircle size={32} />
                </div>
              ) : (
                <div style={{ background: '#E8EAF6', color: '#3F51B5', padding: '16px', borderRadius: '50%' }}>
                  <Info size={32} />
                </div>
              )}
            </div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: 'var(--navy-text)' }}>{alertConfig.title}</h3>
            <p style={{ color: 'var(--text3)', margin: '0 0 24px 0', fontSize: '14px', lineHeight: 1.5 }}>{alertConfig.message}</p>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={hideAlert}>Ok</button>
          </div>
        </div>
      )}

      {confirmConfig && (
        <div className="modal-overlay" onClick={() => { if(confirmConfig.onCancel) confirmConfig.onCancel(); hideConfirm(); }} style={{ zIndex: 20000 }}>
          <div className="modal animate-pop" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--navy-text)' }}>{confirmConfig.title}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => { if(confirmConfig.onCancel) confirmConfig.onCancel(); hideConfirm(); }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ color: 'var(--text3)', margin: '0 0 24px 0', fontSize: '14px', lineHeight: 1.5 }}>{confirmConfig.message}</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-ghost" 
                onClick={() => { 
                  if (confirmConfig.onCancel) confirmConfig.onCancel(); 
                  hideConfirm(); 
                }}
              >
                Batal
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => { 
                  confirmConfig.onConfirm(); 
                  hideConfirm(); 
                }}
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
