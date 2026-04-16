import { Mail, MapPin, Stethoscope, UserCircle2 } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import { profileStats, proposals } from '../data/mockData';
import React from 'react';

export default function ProfilePage() {
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
              <h1>John Doe</h1>
              <p className="profile-role"><Stethoscope size={16} /> Healthcare Professional</p>
              <div className="profile-meta">
                <span><Mail size={15} /> john.doe@healthai.dev</span>
                <span><MapPin size={15} /> Istanbul, Türkiye</span>
              </div>
            </div>
          </div>
          <button className="secondary-button">Edit Profile</button>
        </section>

        <section className="profile-grid">
          <div className="sidebar-card">
            <h3>About</h3>
            <p>
              Passionate about applying AI in healthcare, particularly in radiology workflows, decision support systems, and early disease detection.
            </p>
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
      <button className="help-button">?</button>
    </div>
  );
}
