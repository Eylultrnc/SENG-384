import React, { useEffect, useState } from 'react';
import AppHeader from '../components/AppHeader';
import SidebarProfile from '../components/SidebarProfile';
import CreatePostModal from '../components/CreatePostModal';
import EditPostModal from '../components/EditPostModal';
import NDAModal from '../components/NDAModal';
import { apiFetch } from '../api';
import { MoreVertical } from 'lucide-react';

export default function MainPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [ndaTarget, setNdaTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const [filters, setFilters] = useState({
    query: '',
    domain: '',
    expertise: '',
    status: 'ACTIVE'
  });

  const normalizeText = (value) =>
    String(value || '')
      .trim()
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/İ/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c');

  const getMatchBadges = (post) => {
    const badges = [];

    const userCity = normalizeText(currentUser.city);
    const postCity = normalizeText(post.city);

    const userCountry = normalizeText(currentUser.country);
    const postCountry = normalizeText(post.country);

    if (userCity && postCity && userCity === postCity) {
      badges.push('Same city match');
    } else if (userCountry && postCountry && userCountry === postCountry) {
      badges.push('Same country match');
    }

    if (post.working_domain) {
      badges.push(`Domain: ${post.working_domain}`);
    }

    if (post.needed_expertise) {
      badges.push(`Needs: ${post.needed_expertise}`);
    }

    return badges;
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const query = new URLSearchParams(filters).toString();
        const data = await apiFetch(`/posts?${query}`);
        setPosts(data);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [filters]);

  const markAsClosed = async (id) => {
    try {
      await apiFetch(`/posts/${id}/close`, { method: 'PUT' });

      setPosts(posts.map((p) =>
        p.id === id ? { ...p, status: 'CLOSED' } : p
      ));
    } catch (err) {
      console.error(err);
      alert('Could not close post');
    }
  };

  const publishPost = async (id) => {
    try {
      await apiFetch(`/posts/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'ACTIVE' })
      });

      setPosts(posts.map((p) =>
        p.id === id ? { ...p, status: 'ACTIVE' } : p
      ));
    } catch (err) {
      console.error(err);
      alert('Could not publish post');
    }
  };

  const sendRequest = async (receiverId, postId) => {
    try {
      await apiFetch('/messages/request', {
        method: 'POST',
        body: JSON.stringify({ receiverId, postId })
      });

      alert('Request sent ✅');
    } catch (err) {
      console.error(err);

      if (err.message?.includes('Already requested')) {
        alert('You already sent this request 👍');
      } else {
        alert('Something went wrong ❌');
      }
    }
  };

  const deletePostHandler = async (id) => {
    try {
      await apiFetch(`/posts/${id}`, { method: 'DELETE' });
      setPosts(posts.filter((p) => p.id !== id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  return (
    <div className="app-shell">
      <AppHeader />

      <main className="dashboard-layout">
        <SidebarProfile />

        <section className="feed-section">
          <div
            className="page-intro"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h1>Health AI Insights</h1>

            <button
              className="primary-button"
              style={{ height: '42px', minHeight: '42px', padding: '0 20px' }}
              onClick={() => setIsModalOpen(true)}
            >
              + Create Post
            </button>
          </div>

          <div className="filter-bar">
            <input
              className="filter-input"
              placeholder="Search..."
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            />

            <input
              className="filter-input"
              placeholder="Domain"
              value={filters.domain}
              onChange={(e) => setFilters({ ...filters, domain: e.target.value })}
            />

            <input
              className="filter-input"
              placeholder="Expertise"
              value={filters.expertise}
              onChange={(e) => setFilters({ ...filters, expertise: e.target.value })}
            />

            <select
              className="filter-select"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All</option>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="CLOSED">Closed</option>
              <option value="MEETING_SCHEDULED">Meeting Scheduled</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>

          {loading && <p>Loading posts...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {!loading && !error && (
            <div className="article-list">
              {posts.length === 0 ? (
                <p>No posts found.</p>
              ) : (
                posts.map((post) => {
                  const isOwner = String(post.author_id) === String(currentUser.id);
                  const isActive = post.status === 'ACTIVE';
                  const isDraft = post.status === 'DRAFT';
                  const matchBadges = getMatchBadges(post);

                  return (
                    <div key={post.id} className="article-card">
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '16px'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <h3 style={{ margin: 0, marginBottom: '10px' }}>{post.title}</h3>

                          {!isOwner && matchBadges.length > 0 && (
                            <div
                              style={{
                                display: 'flex',
                                gap: '8px',
                                flexWrap: 'wrap',
                                marginBottom: '12px'
                              }}
                            >
                              {matchBadges.map((badge) => (
                                <span key={badge} className="match-badge">
                                  {badge}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            minWidth: '120px'
                          }}
                        >
                          <span style={{ fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap' }}>
                            {post.created_at
                              ? new Date(post.created_at).toLocaleDateString()
                              : 'Just now'}
                          </span>

                          <span
                            style={{
                              fontSize: '12px',
                              color: '#ef4444',
                              whiteSpace: 'nowrap',
                              marginTop: '4px'
                            }}
                          >
                            Expires:{' '}
                            {post.expiry_date
                              ? new Date(post.expiry_date).toLocaleDateString()
                              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <p>{post.description}</p>
                      <p><strong>Expertise:</strong> {post.needed_expertise}</p>
                      <p><strong>Domain:</strong> {post.working_domain}</p>

                      {(post.city || post.country) && (
                        <p>
                          <strong>Location:</strong>{' '}
                          {[post.city, post.country].filter(Boolean).join(', ')}
                        </p>
                      )}

                      <p>
                        <strong>Status:</strong>{' '}
                        {post.status === 'MEETING_SCHEDULED' ? 'MEETING SCHEDULED' : post.status}
                      </p>

                      <p><strong>Author:</strong> {post.author_name || 'Unknown'}</p>

                      <div
                        style={{
                          marginTop: '14px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        {!isOwner && isActive && (
                          <button
                            type="button"
                            className="secondary-button"
                            onClick={() => setNdaTarget({ receiverId: post.author_id, postId: post.id })}
                          >
                            Express Interest
                          </button>
                        )}

                        {isOwner && (
                          <div style={{ marginLeft: 'auto', position: 'relative' }}>
                            <button
                              type="button"
                              className="secondary-button"
                              style={{ width: '44px', minHeight: '40px', padding: 0 }}
                              onClick={() => setOpenMenuId(openMenuId === post.id ? null : post.id)}
                            >
                              <MoreVertical size={18} />
                            </button>

                            {openMenuId === post.id && (
                              <div
                                style={{
                                  position: 'absolute',
                                  right: 0,
                                  top: '48px',
                                  background: '#fff',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '12px',
                                  boxShadow: '0 12px 24px rgba(15, 23, 42, 0.12)',
                                  padding: '8px',
                                  zIndex: 50,
                                  minWidth: '160px'
                                }}
                              >
                                <button
                                  type="button"
                                  className="menu-action"
                                  onClick={() => {
                                    setEditingPost(post);
                                    setOpenMenuId(null);
                                  }}
                                >
                                  Edit
                                </button>

                                {isDraft && (
                                  <button
                                    type="button"
                                    className="menu-action"
                                    onClick={() => {
                                      publishPost(post.id);
                                      setOpenMenuId(null);
                                    }}
                                  >
                                    Publish
                                  </button>
                                )}

                                {isActive && (
                                  <button
                                    type="button"
                                    className="menu-action"
                                    onClick={() => {
                                      markAsClosed(post.id);
                                      setOpenMenuId(null);
                                    }}
                                  >
                                    Partner Found
                                  </button>
                                )}

                                <button
                                  type="button"
                                  className="menu-action menu-action-danger"
                                  onClick={() => {
                                    setDeleteTarget(post);
                                    setOpenMenuId(null);
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </section>
      </main>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={(newPost) => setPosts([newPost, ...posts])}
      />

      <EditPostModal
        isOpen={!!editingPost}
        post={editingPost}
        onClose={() => setEditingPost(null)}
        onUpdated={(updatedPost) => {
          setPosts(posts.map((p) =>
            p.id === updatedPost.id ? updatedPost : p
          ));
        }}
      />

      <NDAModal
        isOpen={!!ndaTarget}
        onClose={() => setNdaTarget(null)}
        onAccept={() => {
          if (!ndaTarget) return;
          sendRequest(ndaTarget.receiverId, ndaTarget.postId);
          setNdaTarget(null);
        }}
      />
      {deleteTarget && (
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
            <h2 style={{ margin: 0, marginBottom: '12px' }}>
              Delete Post?
            </h2>

            <p style={{ color: '#64748b', lineHeight: 1.6 }}>
              Are you sure you want to delete <strong>{deleteTarget.title}</strong>?
              This action cannot be undone.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                className="secondary-button"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>

              <button
                className="primary-button"
                style={{ background: '#dc2626', borderColor: '#dc2626' }}
                onClick={() => deletePostHandler(deleteTarget.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        className="floating-action"
        onClick={() => window.location.href = '/messages'}
      >
        ➤
      </button>
    </div>
  );
}