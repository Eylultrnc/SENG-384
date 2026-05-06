import React, { useEffect, useState } from 'react';
import {
  Mail,
  MapPin,
  Stethoscope,
  UserCircle2,
  ShieldAlert,
  Edit2,
  Check,
  X
} from 'lucide-react';

import AppHeader from '../components/AppHeader';
import { apiFetch } from '../api';

export default function ProfilePage() {
  const [myPosts, setMyPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    fullName: '',
    institution: '',
    bio: '',
    city: '',
    country: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const parsed = JSON.parse(storedUser);

      setUser(parsed);
      setEditForm({
        fullName: parsed.fullName || '',
        institution: parsed.institution || '',
        bio: parsed.bio || '',
        city: parsed.city || '',
        country: parsed.country || ''
      });
    }
  }, []);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const data = await apiFetch('/posts/my-posts');
        setMyPosts(data);
      } catch (err) {
        console.error('MY POSTS ERROR:', err);
      }
    };

    fetchMyPosts();
  }, []);

  const handleSave = async () => {
    try {
      const data = await apiFetch('/users/me', {
        method: 'PUT',
        body: JSON.stringify({
          fullName: editForm.fullName,
          institution: editForm.institution,
          bio: editForm.bio,
          city: editForm.city,
          country: editForm.country
        })
      });

      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Error updating profile');
    }
  };

  return (
    <div className="app-shell">
      <AppHeader />

      <main className="profile-page">
        <section className="profile-hero">
          <div className="profile-hero__left">
            <div className="profile-hero__avatar">
              <UserCircle2 size={90} strokeWidth={1.7} />
            </div>

            <div>
              {isEditing ? (
                <input
                  className="standalone-input"
                  value={editForm.fullName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fullName: e.target.value })
                  }
                  style={{ marginBottom: '10px', height: '40px' }}
                />
              ) : (
                <h1>{user?.fullName || 'John Doe'}</h1>
              )}

              <p className="profile-role">
                {user?.role === 'ENGINEER' ? (
                  <ShieldAlert size={16} />
                ) : (
                  <Stethoscope size={16} />
                )}
                {user?.role || 'Healthcare Professional'}
              </p>

              <div className="profile-meta">
                <span>
                  <Mail size={15} /> {user?.email || 'john.doe@healthai.dev'}
                </span>

                {isEditing ? (
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      marginTop: '10px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <input
                      className="standalone-input"
                      placeholder="City"
                      value={editForm.city}
                      onChange={(e) =>
                        setEditForm({ ...editForm, city: e.target.value })
                      }
                      style={{ height: '40px', minWidth: '160px' }}
                    />

                    <input
                      className="standalone-input"
                      placeholder="Country"
                      value={editForm.country}
                      onChange={(e) =>
                        setEditForm({ ...editForm, country: e.target.value })
                      }
                      style={{ height: '40px', minWidth: '160px' }}
                    />
                  </div>
                ) : (
                  <span>
                    <MapPin size={15} />{' '}
                    {user?.city || user?.country
                      ? `${user?.city || 'No city'}, ${user?.country || 'No country'}`
                      : 'No location selected'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {isEditing ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="secondary-button"
                onClick={() => setIsEditing(false)}
              >
                <X size={16} /> Cancel
              </button>

              <button
                className="primary-button"
                style={{ minHeight: '40px', padding: '0 20px' }}
                onClick={handleSave}
              >
                <Check size={16} /> Save
              </button>
            </div>
          ) : (
            <button
              className="secondary-button"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 size={15} style={{ marginRight: '6px' }} />
              Edit Profile
            </button>
          )}
        </section>

        <section className="profile-grid">
          <div className="sidebar-card">
            <h3>About</h3>

            {isEditing ? (
              <textarea
                className="standalone-input"
                value={editForm.bio}
                onChange={(e) =>
                  setEditForm({ ...editForm, bio: e.target.value })
                }
                style={{
                  height: '100px',
                  width: '100%',
                  marginTop: '10px',
                  padding: '10px'
                }}
              />
            ) : (
              <p>{user?.bio || 'No bio added yet.'}</p>
            )}

            <h3 style={{ marginTop: '20px' }}>Institution</h3>

            {isEditing ? (
              <input
                className="standalone-input"
                value={editForm.institution}
                onChange={(e) =>
                  setEditForm({ ...editForm, institution: e.target.value })
                }
                style={{ marginTop: '10px', height: '40px' }}
              />
            ) : (
              <p>{user?.institution || 'Not specified'}</p>
            )}

            <button
              className="secondary-button"
              style={{
                marginTop: '20px',
                color: '#dc2626',
                borderColor: '#fecaca'
              }}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete Account
            </button>
          </div>

          <div className="sidebar-card">
            <h3>Highlights</h3>

            <div className="stats-grid">
              <div className="stat-card">
                <strong>{myPosts.length}</strong>
                <span>Published proposals</span>
              </div>

              <div className="stat-card">
                <strong>
                  {myPosts.filter((p) => p.status === 'ACTIVE').length}
                </strong>
                <span>Active proposals</span>
              </div>

              <div className="stat-card">
                <strong>
                  {myPosts.filter((p) => p.status === 'CLOSED').length}
                </strong>
                <span>Closed proposals</span>
              </div>
            </div>
          </div>

          <div className="sidebar-card profile-proposals">
            <h3>Recent Proposals</h3>

            <div className="proposal-list">
              {myPosts.length === 0 ? (
                <p>No posts yet.</p>
              ) : (
                myPosts.map((post) => (
                  <div key={post.id} className="proposal-item">
                    <h5>{post.title}</h5>
                    <span>{post.status}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      {isDeleteModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(4px)'
          }}
        >
          <div
            style={{
              width: '420px',
              maxWidth: '92%',
              background: '#fff',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(15,23,42,0.25)'
            }}
          >
            <h2
              style={{
                margin: 0,
                marginBottom: '12px',
                fontSize: '24px',
                color: '#0f172a'
              }}
            >
              Delete Account?
            </h2>

            <p
              style={{
                color: '#64748b',
                lineHeight: 1.6,
                marginBottom: '24px'
              }}
            >
              This action cannot be undone. Your profile, posts, messages and
              activity data would be permanently removed.
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px'
              }}
            >
              <button
                className="secondary-button"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>

              <button
                className="primary-button"
                style={{
                  background: '#dc2626',
                  borderColor: '#dc2626'
                }}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}