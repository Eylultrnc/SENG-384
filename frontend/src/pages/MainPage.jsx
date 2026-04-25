import React, { useEffect, useState } from 'react';
import AppHeader from '../components/AppHeader';
import SidebarProfile from '../components/SidebarProfile';
import CreatePostModal from '../components/CreatePostModal';
import { apiFetch } from '../api';
import { useNavigate } from 'react-router-dom';

export default function MainPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await apiFetch('/posts');
        setPosts(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="app-shell">
      <AppHeader />

      <main className="dashboard-layout">
        <SidebarProfile />

        <section className="feed-section">
          <div className="page-intro" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h1>Health AI Insights</h1>
            <button className="primary-button" style={{height: '42px', minHeight: '42px', padding: '0 20px'}} onClick={() => setIsModalOpen(true)}>+ Create Post</button>
          </div>

          {loading && <p>Loading posts...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {!loading && !error && (
            <div className="article-list">
              {posts.length === 0 ? (
                <p>No posts found.</p>
              ) : (
                posts.map((post) => (
                  <div 
                    key={post.id} 
                    className="article-card"
                    onClick={() => navigate(`/messages/${post.author_id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <h3>{post.title}</h3>
                    <p>{post.description}</p>
                    <p><strong>Expertise:</strong> {post.needed_expertise}</p>
                    <p><strong>Domain:</strong> {post.working_domain}</p>
                    <p><strong>Status:</strong> {post.status}</p>
                  </div>
                ))
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

      <button className="floating-action" onClick={() => navigate('/messages')}>➤</button>
    </div>
  );
}  