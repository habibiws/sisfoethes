import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import UserTable from '../components/user-role/UserTable';
import AddUserModal from '../components/user-role/AddUserModal';
import EditUserModal from '../components/user-role/EditUserModal';
import ResetPasswordModal from '../components/user-role/ResetPasswordModal';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import './UserRolePage.css';

import useModalStore from '../store/modalStore';

export default function UserRolePage() {
  const { user: currentUser } = useAuthStore();
  const { showAlert, showConfirm } = useModalStore();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [resetPwUser, setResetPwUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/users');
      let data = response.data;

      // 1. Filter out Admins (except if the admin is me)
      // As requested: "admin tidak perlu atrbiut apapun... sekalian ga perlu masuk list user & role deh"
      data = data.filter(u => u.role !== 'admin' || (currentUser && u.id === currentUser.id));

      // 2. Sort current user to top
      if (currentUser) {
        data = data.sort((a, b) => {
          if (a.id === currentUser.id) return -1;
          if (b.id === currentUser.id) return 1;
          return 0;
        });
      }

      setUsers(data);
    } catch (error) {
      console.error('Gagal mengambil data user:', error);
      showAlert('Gagal mengambil data user. Pastikan Anda memiliki hak akses.', 'Error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  const handleAddUser = async (userData) => {
    try {
      const payload = {
        ...userData,
        role: userData.role === 'anggota_biasa' ? 'anggota' : userData.role
      };
      
      await api.post('/users', payload);
      showAlert('User berhasil ditambahkan', 'Berhasil', 'success');
      setIsAddModalOpen(false);
      fetchUsers();
    } catch (error) {
      const msg = error.response?.data?.message || 'Gagal menambahkan user';
      showAlert(msg, 'Error', 'error');
    }
  };

  const handleEditUser = async (userId, userData) => {
    try {
      // Use method spoofing to bypass PHP built-in server issues with PUT/DELETE
      await api.post(`/users/${userId}`, { ...userData, _method: 'PUT' });
      showAlert('Data user berhasil diperbarui', 'Berhasil', 'success');
      setEditUser(null);
      fetchUsers();
    } catch (error) {
      const msg = error.response?.data?.message || 'Gagal memperbarui user';
      showAlert(msg, 'Error', 'error');
    }
  };

  const handleResetPassword = async (userId, newPassword) => {
    try {
      await api.post(`/users/${userId}/reset-password`, { password: newPassword });
      showAlert('Password berhasil diupdate', 'Berhasil', 'success');
      setResetPwUser(null);
    } catch (error) {
      showAlert('Gagal mereset password', 'Error', 'error');
    }
  };

  const handleDeleteUser = (userId) => {
    showConfirm('Apakah Anda yakin ingin menghapus user ini?', async () => {
      try {
        // Use method spoofing to bypass PHP built-in server issues with PUT/DELETE
        const response = await api.post(`/users/${userId}`, { _method: 'DELETE' });
        showAlert(response.data?.message || 'User berhasil dihapus', 'Berhasil', 'success');
        fetchUsers();
      } catch (error) {
        const msg = error.response?.data?.message || 'Gagal menghapus user';
        showAlert(msg, 'Error', 'error');
      }
    });
  };

  return (
    <Layout 
      title="Manajemen User & Role" 
      subtitle="Kelola anggota KK, atur hak akses, dan manajemen akun di sini."
      headerActions={
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>+ Tambah User</button>
      }
    >
      <div className="user-role-container">
        
        {isLoading ? (
          <div className="loading-state">Memuat data pengguna...</div>
        ) : (
          <div className="user-table-wrap">
            <UserTable 
              users={users} 
              currentUserId={currentUser?.id}
              onResetPassword={(user) => setResetPwUser(user)}
              onEditUser={(user) => setEditUser(user)}
              onDeleteUser={handleDeleteUser}
            />
          </div>
        )}

        {isAddModalOpen && (
          <AddUserModal 
            onClose={() => setIsAddModalOpen(false)} 
            onSave={handleAddUser}
          />
        )}

        {editUser && (
          <EditUserModal 
            user={editUser}
            onClose={() => setEditUser(null)}
            onSave={handleEditUser}
          />
        )}

        {resetPwUser && (
          <ResetPasswordModal 
            user={resetPwUser}
            onClose={() => setResetPwUser(null)}
            onReset={handleResetPassword}
          />
        )}

      </div>
    </Layout>
  );
}
