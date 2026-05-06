import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { apiFetch } from '../api';

export default function EditPostModal({ isOpen, onClose, post, onUpdated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    needed_expertise: '',
    working_domain: '',
    project_stage: 'IDEA',
    collaboration_type: 'ADVISOR',
    commitment_level: 'FLEXIBLE',
    confidentiality_level: 'MEDIUM',
    city: 'Istanbul',
    country: 'Türkiye'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const authorName = user ? user.fullName : 'Unknown Author';

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        description: post.description || '',
        needed_expertise: post.needed_expertise || '',
        working_domain: post.working_domain || '',
        project_stage: post.project_stage || 'IDEA',
        collaboration_type: post.collaboration_type || 'ADVISOR',
        commitment_level: post.commitment_level || 'FLEXIBLE',
        confidentiality_level: post.confidentiality_level || 'MEDIUM',
        city: post.city || 'Istanbul',
        country: post.country || 'Türkiye'
      });
    }
  }, [post]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const updated = await apiFetch(`/posts/${post.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });

      onUpdated(updated.post || updated);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Edit Post</h2>
          <button type="button" className="icon-button" onClick={onClose}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleUpdate} className="modal-body">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label className="form-label">Title</label>
            <input required type="text" name="title" className="standalone-input" value={formData.title} onChange={handleChange} placeholder="e.g. AI Lung Cancer Detection" />
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea required name="description" className="standalone-input" value={formData.description} onChange={handleChange} placeholder="Detail your project needs..." style={{height: '90px', padding: '12px'}} />
          </div>
          
          <div className="two-column-grid">
            <div className="form-group">
              <label className="form-label">Needed Expertise</label>
              <input required type="text" name="needed_expertise" className="standalone-input" value={formData.needed_expertise} onChange={handleChange} placeholder="e.g. Radiology, NLP" />
            </div>
            <div className="form-group">
              <label className="form-label">Working Domain</label>
              <input required type="text" name="working_domain" className="standalone-input" value={formData.working_domain} onChange={handleChange} placeholder="e.g. Diagnostics" />
            </div>
          </div>
          
          <div className="two-column-grid">
            <div className="form-group">
              <label className="form-label">Project Stage</label>
              <select name="project_stage" className="standalone-input" value={formData.project_stage} onChange={handleChange}>
                <option value="IDEA">Idea</option>
                <option value="PROTOTYPE">Prototype</option>
                <option value="RESEARCH">Research</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Collaboration</label>
              <select name="collaboration_type" className="standalone-input" value={formData.collaboration_type} onChange={handleChange}>
                <option value="ADVISOR">Advisor</option>
                <option value="CO_FOUNDER">Co-Founder</option>
                <option value="RESEARCH_PARTNER">Research Partner</option>
              </select>
            </div>
          </div>

          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              <strong>Author:</strong> {authorName}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
              <button type="submit" className="primary-button" style={{padding: '0 24px'}} disabled={loading}>
                {loading ? 'Saving...' : 'Save Details'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}