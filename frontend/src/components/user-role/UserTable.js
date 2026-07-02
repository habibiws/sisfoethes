import React from 'react';

export default function UserTable({ users, currentUserId, onResetPassword, onEditUser, onDeleteUser }) {
  const formatRole = (role) => {
    if (role === 'admin') return 'Admin';
    if (role === 'ketua_kk') return 'Ketua KK';
    if (role === 'ketua_sub_kk') return 'Ketua Sub-KK';
    return 'Anggota';
  };

  return (
    <>
      {/* --- DESKTOP VIEW --- */}
      <div className="desktop-user-table-wrap">
        <table className="user-role-table">
          <thead>
            <tr>
              <th>Nama & Email</th>
              <th>Role</th>
              <th>Sub-KK</th>
              <th>NIDN</th>
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
                    <div className="user-name-text" style={{ fontWeight: 600, color: 'var(--navy)' }}>
                      {user.name} {isMe && <small style={{ color: 'var(--text3)', fontWeight: 400 }}>(Anda)</small>}
                    </div>
                    <div className="user-email-text" style={{ fontSize: '11px', color: 'var(--text3)' }}>{user.email}</div>
                  </td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {formatRole(user.role)}
                    </span>
                  </td>
                  <td>{isAdmin ? '-' : (user.sub_kk?.name || '-')}</td>
                  <td>{isAdmin ? '-' : (user.nidn || '-')}</td>
                  <td>
                    {!isMe && (
                      <div className="action-buttons-wrap" style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => onEditUser(user)}>Edit</button>
                        <button className="btn btn-outline btn-sm" onClick={() => onResetPassword(user)}>Reset Password</button>
                        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDeleteUser(user.id); }}>Hapus</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE VIEW --- */}
      <div className="mobile-user-list">
        {users.map(user => {
          const isMe = user.id === currentUserId;
          const isAdmin = user.role === 'admin';

          return (
            <div key={user.id} className={`mobile-user-card ${isMe ? 'card-me' : ''}`}>
              <div className="mobile-user-header">
                <div>
                  <div className="mobile-user-name">
                    {user.name} {isMe && <span className="me-badge">(Anda)</span>}
                  </div>
                  <div className="mobile-user-email">{user.email}</div>
                </div>
                <span className={`role-badge ${user.role}`}>
                  {formatRole(user.role)}
                </span>
              </div>

              <div className="mobile-user-details">
                <div className="mobile-detail-row">
                  <span className="detail-label">NIDN</span>
                  <span className="detail-value">{isAdmin ? '-' : (user.nidn || '-')}</span>
                </div>
                <div className="mobile-detail-row">
                  <span className="detail-label">Sub-KK</span>
                  <span className="detail-value">{isAdmin ? '-' : (user.sub_kk?.name || '-')}</span>
                </div>
              </div>

              {!isMe && (
                <div className="mobile-user-actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => onEditUser(user)}>Edit</button>
                  <button className="btn btn-outline btn-sm" onClick={() => onResetPassword(user)}>Reset Password</button>
                  <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDeleteUser(user.id); }}>Hapus</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
