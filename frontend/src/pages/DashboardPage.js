import React from 'react';
import Layout from '../components/layout/Layout';
import StatCards from './dashboard/StatCards';
import ProgressCards from './dashboard/ProgressCards';
import MembersTable from './dashboard/MembersTable';

export default function DashboardPage() {
  return (
    <Layout 
      title="Dashboard KK ETHES" 
      subtitle="Semester Genap 2024/2025 · Selamat datang, Bapak/Ibu Dosen"
    >
      <StatCards />
      <ProgressCards />
      <MembersTable />
    </Layout>
  );
}
