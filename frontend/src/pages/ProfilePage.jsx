import React, { useEffect, useState } from 'react';
import { Mail, MapPin, Stethoscope, UserCircle2, ShieldAlert, Edit2, Check, X } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import { profileStats, proposals } from '../data/mockData';
import { apiFetch } from '../api';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    institution: '',
    bio: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setEditForm({
        fullName: parsed.fullName || '',
        institution: parsed.institution || '',
        bio: parsed.bio || 'Passionate about leveraging AI to improve healthcare outcomes...'
      });
    }
  }, []);

  const handleSave = async () => {
    try {
      const data = await apiFetch('/users/me', {
        method: 'PUT',
        body: JSON.stringify(editForm)
      });
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user)); // Update global session!
      setIsEditing(false);
    } catch (err) {
      alert("Error updating profile");
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
                  onChange={e => setEditForm({...editForm, fullName: e.target.value})} 
                  style={{marginBottom: '10px', height: '40px'}} 
                />
              ) : (
                <h1>{user?.fullName || 'John Doe'}</h1>
              )}
              <p className="profile-role">
                {user?.role === 'ENGINEER' ? <ShieldAlert size={16} /> : <Stethoscope size={16} />} 
                {user?.role || 'Healthcare Professional'}
              </p>
              <div className="profile-meta">
                <span><Mail size={15} /> {user?.email || 'john.doe@healthai.dev'}</span>
                <span><MapPin size={15} /> Istanbul, Türkiye</span>
              </div>
            </div>
          </div>
          {isEditing ? (
            <div style={{display: 'flex', gap: '10px'}}>
              <button className="secondary-button" onClick={() => setIsEditing(false)}><X size={16}/> Cancel</button>
              <button className="primary-button" style={{minHeight: '40px', padding: '0 20px'}} onClick={handleSave}><Check size={16}/> Save</button>
            </div>
          ) : (
            <button className="secondary-button" onClick={() => setIsEditing(true)}><Edit2 size={15} style={{marginRight: '6px'}}/> Edit Profile</button>
          )}
        </section>

        <section className="profile-grid">
          <div className="sidebar-card">
            <h3>About</h3>
            {isEditing ? (
                <textarea 
                  className="standalone-input" 
                  value={editForm.bio} 
                  onChange={e => setEditForm({...editForm, bio: e.target.value})} 
                  style={{height: '100px', width: '100%', marginTop: '10px', padding: '10px'}} 
                />
            ) : (
              <p>
                {user?.bio || 'Passionate about applying AI in healthcare, particularly in radiology workflows, decision support systems, and early disease detection.'}
              </p>
            )}
            
            <h3 style={{marginTop: '20px'}}>Institution</h3>
            {isEditing ? (
                <input 
                  className="standalone-input" 
                  value={editForm.institution} 
                  onChange={e => setEditForm({...editForm, institution: e.target.value})} 
                  style={{marginTop: '10px', height: '40px'}} 
                />
            ) : (
              <p>
                {user?.institution || 'Not specified'}
              </p>
            )}
          </div>

          <div className="sidebar-card">
            <h3>Highlights</h3>
            <div className="stats-grid">
              {profileStats.map((item) => (
                <div className="stat-card" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-card profile-proposals">
            <h3>Recent Proposals</h3>
            <div className="proposal-list">
              {proposals.map((proposal) => (
                <div key={proposal.title} className="proposal-item">
                  <h5>{proposal.title}</h5>
                  <span>{proposal.submitted}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
