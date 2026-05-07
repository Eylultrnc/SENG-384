import React, { useState } from 'react';
import { X } from 'lucide-react';
import { apiFetch } from '../api';

export default function CreatePostModal({ isOpen, onClose, onPostCreated }) {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    needed_expertise: '',
    working_domain: '',
    project_stage: 'IDEA',
    collaboration_type: 'ADVISOR',
    commitment_level: 'FLEXIBLE',
    confidentiality_level: 'MEDIUM',
    city: user?.city || '',
    country: user?.country || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const authorName = user ? user.fullName : 'Unknown Author';

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const resetAndClose = () => {
    setError('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.city.trim() || !formData.country.trim()) {
      setError('City and country are required for matching.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await apiFetch('/posts', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          city: formData.city.trim(),
          country: formData.country.trim()
        })
      });

      onPostCreated(data.post);
      resetAndClose();
    } catch (err) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Create New Post</h2>

          <button className="icon-button" onClick={resetAndClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              required
              type="text"
              name="title"
              className="standalone-input"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. AI Lung Cancer Detection"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              required
              name="description"
              className="standalone-input"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detail your project needs..."
              style={{ height: '90px', padding: '12px' }}
            />
          </div>

          <div className="two-column-grid">
            <div className="form-group">
              <label className="form-label">Needed Expertise</label>
              <input
                required
                type="text"
                name="needed_expertise"
                className="standalone-input"
                value={formData.needed_expertise}
                onChange={handleChange}
                placeholder="e.g. Radiology, NLP"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Working Domain</label>
              <input
                required
                type="text"
                name="working_domain"
                className="standalone-input"
                value={formData.working_domain}
                onChange={handleChange}
                placeholder="e.g. Diagnostics"
              />
            </div>
          </div>

          <div className="two-column-grid">
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                required
                type="text"
                name="city"
                className="standalone-input"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Istanbul"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Country</label>
              <input
                required
                type="text"
                name="country"
                className="standalone-input"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g. Türkiye"
              />
            </div>
          </div>

          <div className="two-column-grid">
            <div className="form-group">
              <label className="form-label">Project Stage</label>
              <select
                name="project_stage"
                className="standalone-input"
                value={formData.project_stage}
                onChange={handleChange}
              >
                <option value="IDEA">Idea</option>
                <option value="PROTOTYPE">Prototype</option>
                <option value="RESEARCH">Research</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Collaboration</label>
              <select
                name="collaboration_type"
                className="standalone-input"
                value={formData.collaboration_type}
                onChange={handleChange}
              >
                <option value="ADVISOR">Advisor</option>
                <option value="CO_FOUNDER">Co-Founder</option>
                <option value="RESEARCH_PARTNER">Research Partner</option>
              </select>
            </div>
          </div>

          <div className="two-column-grid">
            <div className="form-group">
              <label className="form-label">Commitment Level</label>
              <select
                name="commitment_level"
                className="standalone-input"
                value={formData.commitment_level}
                onChange={handleChange}
              >
                <option value="FLEXIBLE">Flexible</option>
                <option value="PART_TIME">Part-time</option>
                <option value="FULL_TIME">Full-time</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Confidentiality Level</label>
              <select
                name="confidentiality_level"
                className="standalone-input"
                value={formData.confidentiality_level}
                onChange={handleChange}
              >
                <option value="LOW">Public short pitch</option>
                <option value="MEDIUM">Details discussed in meeting only</option>
                <option value="HIGH">Highly confidential</option>
              </select>
            </div>
          </div>

          <div
            className="modal-footer"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '14px', color: '#64748b' }}>
                <strong>Author:</strong> {authorName}
              </div>

              <div style={{ fontSize: '12px', color: '#ef4444' }}>
                * This post will automatically expire in 30 days.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="secondary-button"
                onClick={resetAndClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                style={{ padding: '0 24px' }}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Post'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}