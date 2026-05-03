import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api';

export default function EditPostModal({ isOpen, onClose, post, onUpdated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setDescription(post.description || '');
    }
  }, [post]);

  if (!isOpen) return null;

  const handleUpdate = async () => {
    try {
      const updated = await apiFetch(`/posts/${post.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title,
          description
        })
      });

      onUpdated(updated);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Edit Post</h2>

        <input
          className="filter-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <textarea
          className="filter-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />

        <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
          <button className="primary-button" onClick={handleUpdate}>
            Save
          </button>

          <button className="secondary-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}