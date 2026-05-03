import React, { useEffect, useState } from 'react';
import AppHeader from '../components/AppHeader';
import SidebarProfile from '../components/SidebarProfile';
import CreatePostModal from '../components/CreatePostModal';
import { apiFetch } from '../api';
import { MoreVertical } from 'lucide-react';
import EditPostModal from '../components/EditPostModal';

export default function MainPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const [filters, setFilters] = useState({
    query: '',
    domain: '',
    expertise: '',
    status: 'ACTIVE'
  });

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

      // 🔥 BACKEND "Already requested" dönerse
      if (err.message?.includes('Already requested')) {
        alert('You already sent this request 👍');
      } else {
        alert('Something went wrong ❌');
      }
    }
  };

  const deletePostHandler = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
      await apiFetch(`/posts/${id}`, { method: 'DELETE' });
      setPosts(posts.filter((p) => p.id !== id));
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
          <div className="page-intro" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

                  return (
                    <div key={post.id} className="article-card">
                      <h3>{post.title}</h3>
                      <p>{post.description}</p>
                      <p><strong>Expertise:</strong> {post.needed_expertise}</p>
                      <p><strong>Domain:</strong> {post.working_domain}</p>
                      <p><strong>Status:</strong> {post.status}</p>

                      <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {!isOwner && isActive && (
                          <button
                            type="button"
                            className="secondary-button"
                            onClick={() => sendRequest(post.author_id, post.id)}
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
                                    deletePostHandler(post.id);
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
              setPosts(posts.map(p =>
                p.id === updatedPost.id ? updatedPost : p
              ));
            }}
          />
      <button className="floating-action" onClick={() => window.location.href = '/messages'}>➤</button>
    </div>
    
  );
}