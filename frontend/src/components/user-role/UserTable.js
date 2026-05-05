import React from 'react';

export default function UserTable({ users, currentUserId, onResetPassword, onEditUser, onDeleteUser }) {
  const formatRole = (role) => {
    if (role === 'admin') return 'Admin';
    if (role === 'ketua_kk') return 'Ketua KK';
    if (role === 'ketua_sub_kk') return 'Ketua Sub-KK';
    return 'Anggota Biasa';
  };

  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>Nama & Email</th>
          <th>Role</th>
          <th>Sub-KK</th>
          <th>NIDN/NIP</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => {
          const isMe = user.id === currentUserId;
          const isAdmin = user.role === 'admin';

          return (
            <tr key={user.id} className={isMe ? 'row-me' : ''}>
              <td>
                <div style={{ fontWeight: 600, color: 'var(--navy)' }}>
                  {user.name} {isMe && <small style={{ color: 'var(--text3)', fontWeight: 400 }}>(Anda)</small>}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{user.email}</div>
              </td>
              <td>
                <span className={`role-badge ${user.role}`}>
                  {formatRole(user.role)}
                </span>
              </td>
              <td>{isAdmin ? '-' : (user.sub_kk?.name || '-')}</td>
              <td>
                {isAdmin ? '-' : (
                  <>
                    <div style={{ fontSize: '12px' }}>{user.nidn || '-'}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text3)' }}>{user.nip || '-'}</div>
                  </>
                )}
              </td>
              <td>
                {!isMe && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => onEditUser(user)}>✏️ Edit</button>
                    <button className="btn btn-outline btn-sm" onClick={() => onResetPassword(user)}>🔑 Reset Password</button>
                    <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDeleteUser(user.id); }}>🗑️ Hapus</button>
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
