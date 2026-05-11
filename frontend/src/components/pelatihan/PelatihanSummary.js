import React from 'react';
import { Calendar, Users, Wallet, CheckCircle } from 'lucide-react';

export default function PelatihanSummary({ data }) {
  return (
    <div className="stats-inline-bar card mb-24">
      <div className="stat-item">
        <div className="stat-icon info"><Calendar size={18} /></div>
        <div>
          <div className="stat-val">{data.eventCount}</div>
          <div className="stat-label">Event</div>
        </div>
      </div>
      
      <div className="stat-item">
        <div className="stat-icon success"><Users size={18} /></div>
        <div>
          <div className="stat-val">{data.totalPeserta}</div>
          <div className="stat-label">Peserta</div>
        </div>
      </div>

      <div className="stat-item">
        <div className="stat-icon warning"><Wallet size={18} /></div>
        <div>
          <div className="stat-val">Rp {data.totalBiaya.toLocaleString('id-ID')}jt</div>
          <div className="stat-label">Estimasi Biaya</div>
        </div>
      </div>

      <div className="stat-item">
        <div className="stat-icon danger"><CheckCircle size={18} /></div>
        <div>
          <div className="stat-val">{data.completed}/{data.eventCount}</div>
          <div className="stat-label">Terlaksana</div>
        </div>
      </div>
    </div>
  );
}
