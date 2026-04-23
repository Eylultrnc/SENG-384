import React, { useEffect, useState } from 'react';
import AppHeader from '../components/AppHeader';
import SidebarProfile from '../components/SidebarProfile';
import { apiFetch } from '../api';

export default function MainPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          <div className="page-intro">
            <h1>Health AI Insights (REAL DATA)</h1>
            <p>Now connected to backend 🚀</p>
          </div>

          {loading && <p>Loading posts...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {!loading && !error && (
            <div className="article-list">
              {posts.length === 0 ? (
                <p>No posts found.</p>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="article-card">
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

      <button className="floating-action">➤</button>
      <button className="help-button">?</button>
    </div>
  );
}  