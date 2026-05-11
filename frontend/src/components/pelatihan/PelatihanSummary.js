import React from 'react';
import { Calendar, Users, Wallet, CheckCircle } from 'lucide-react';

export default function PelatihanSummary({ data }) {
  return (
    <div className="pelatihan-summary-bar card">
      <div className="stat-item">
        <div className="stat-icon primary"><Calendar size={18} /></div>
        <div>
          <div className="stat-val">{data.eventCount}</div>
          <div className="stat-label">Total Event</div>
        </div>
      </div>

      <div className="stat-item">
        <div className="stat-icon info"><Users size={18} /></div>
        <div>
          <div className="stat-val">{data.totalPeserta}</div>
          <div className="stat-label">Total Peserta</div>
        </div>
      </div>

      <div className="stat-item">
        <div className="stat-icon warning"><Wallet size={18} /></div>
        <div>
          <div className="stat-val">Rp {data.totalBiaya.toLocaleString('id-ID')}</div>
          <div className="stat-label">Estimasi Biaya</div>
        </div>
      </div>

      <div className="stat-item">
        <div className="stat-icon success"><CheckCircle size={18} /></div>
        <div>
          <div className="stat-val">{data.completed}</div>
          <div className="stat-label">Terlaksana</div>
        </div>
      </div>
    </div>
  );
}
