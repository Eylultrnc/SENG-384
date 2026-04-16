import { Heart, MessageCircle } from 'lucide-react';
import React from 'react';

export default function ArticleCard({ title, excerpt, likes, comments, liked }) {
  return (
    <article className="article-card">
      <h3>{title}</h3>
      <p>{excerpt}</p>
      <div className="article-card__footer">
        <span className={`metric ${liked ? 'metric--active' : ''}`}>
          <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
          {likes}
        </span>
        <span className="metric">
          <MessageCircle size={20} />
          {comments}
        </span>
      </div>
    </article>
  );
}
