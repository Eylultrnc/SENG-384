import AppHeader from '../components/AppHeader';
import SidebarProfile from '../components/SidebarProfile';
import ArticleCard from '../components/ArticleCard';
import { articles } from '../data/mockData';
import React from 'react';

export default function MainPage() {
  return (
    <div className="app-shell">
      <AppHeader />
      <main className="dashboard-layout">
        <SidebarProfile />
        <section className="feed-section">
          <div className="page-intro">
            <h1>Health AI Insights</h1>
            <p>Discover the latest in healthcare AI innovations</p>
          </div>
          <div className="article-list">
            {articles.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        </section>
      </main>
      <button className="floating-action">➤</button>
      <button className="help-button">?</button>
    </div>
  );
}
