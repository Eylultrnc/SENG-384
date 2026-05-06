import React, { useEffect, useState } from 'react';
import AppHeader from '../components/AppHeader';
import { apiFetch } from '../api';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [logs, setLogs] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchAdminData = async () => {
    try {
        const userData = await apiFetch('/admin/users');
        setUsers(userData);
    } catch (err) {
        console.error('ADMIN USERS ERROR:', err);
    }

    try {
        const postData = await apiFetch('/admin/posts');
        setPosts(postData);
    } catch (err) {
        console.error('ADMIN POSTS ERROR:', err);
    }

    try {
        const logData = await apiFetch('/admin/logs');
        setLogs(logData);
    } catch (err) {
        console.error('ADMIN LOGS ERROR:', err);
        setLogs([]);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const removePost = async (id) => {
    if (!window.confirm('Remove this post?')) return;

    try {
      await apiFetch(`/admin/posts/${id}`, { method: 'DELETE' });
      setPosts(posts.filter((p) => p.id !== id));
      fetchAdminData();
    } catch (err) {
      console.error(err);
      alert('Post remove failed');
    }
  };

  const toggleUserStatus = async (user) => {
    const nextStatus = user.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';

    try {
      const updated = await apiFetch(`/admin/users/${user.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus })
      });

      setUsers(users.map((u) =>
        u.id === updated.id ? { ...u, status: updated.status } : u
      ));

      fetchAdminData();
    } catch (err) {
      console.error(err);
      alert('User status update failed');
    }
  };

  if (currentUser.role !== 'ADMIN') {
    return (
      <div className="app-shell">
        <AppHeader />
        <div style={{ padding: '40px' }}>
          <h2>Access denied</h2>
          <p>Admin access only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <AppHeader />

      <main style={{ padding: '32px' }}>
        <h1>Admin Dashboard</h1>

        <section className="sidebar-card" style={{ marginTop: '24px' }}>
          <h2>Users</h2>

          {users.length === 0 ? (
            <p style={{ color: '#64748b' }}>No users found.</p>
          ) : (
            users.map((user) => (
              <div key={user.id} className="proposal-item" style={{ marginTop: '10px' }}>
                <h5>{user.full_name}</h5>
                <span>
                  {user.email} • {user.role} • {user.status || 'ACTIVE'}
                </span>

                <button
                  className="secondary-button"
                  style={{ marginTop: '8px' }}
                  onClick={() => toggleUserStatus(user)}
                >
                  {user.status === 'SUSPENDED' ? 'Activate' : 'Suspend'}
                </button>
              </div>
            ))
          )}
        </section>

        <section className="sidebar-card" style={{ marginTop: '24px' }}>
          <h2>Posts</h2>

          {posts.length === 0 ? (
            <p style={{ color: '#64748b' }}>No posts found.</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="proposal-item" style={{ marginTop: '10px' }}>
                <h5>{post.title}</h5>
                <span>
                  {post.status} • {post.author_name}
                </span>

                <button
                  className="secondary-button"
                  style={{ marginTop: '8px', color: '#dc2626' }}
                  onClick={() => removePost(post.id)}
                >
                  Remove Post
                </button>
              </div>
            ))
          )}
        </section>

        <section className="sidebar-card" style={{ marginTop: '24px' }}>
          <h2>Activity Logs</h2>

          {logs.length === 0 ? (
            <p style={{ color: '#64748b' }}>No logs yet.</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="proposal-item" style={{ marginTop: '10px' }}>
                <h5>{log.action_type}</h5>

                <span>
                  {log.full_name || 'Unknown User'} • {log.role || 'N/A'} • {log.result_status}
                </span>

                <p style={{ marginTop: '6px', color: '#64748b' }}>
                  {log.target_entity || 'No target'} • {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}