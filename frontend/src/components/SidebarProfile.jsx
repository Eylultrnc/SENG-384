import React, { useEffect, useState } from 'react';
import { UserCircle2 } from 'lucide-react';
import { proposals } from '../data/mockData';
import { Link } from 'react-router-dom';

export default function SidebarProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-card profile-card">
        <div className="profile-card__header">
          <div className="profile-avatar">
            <UserCircle2 size={58} strokeWidth={1.7} />
          </div>
          <div style={{overflow: 'hidden'}}>
            <h3 style={{whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'}}>{user?.fullName || 'John Doe'}</h3>
            <p>{user?.role || 'Healthcare Professional'}</p>
          </div>
        </div>
        <Link to="/profile" className="secondary-button secondary-button--wide">
          View Profile
        </Link>
        <Link to="/messages" className="secondary-button secondary-button--wide" style={{marginTop: '10px', display: 'flex', gap: '8px'}}>
          <span>DMs & Messages</span>
        </Link>
      </div>

      <div className="sidebar-card">
        <h4>About Me</h4>
        <p>
          Passionate about leveraging AI to improve healthcare outcomes. Specializing in medical imaging and diagnostic tools.
        </p>
      </div>

      <div className="sidebar-card">
        <h4>Recent Proposals</h4>
        <div className="proposal-list">
          {proposals.map((proposal) => (
            <div key={proposal.title} className="proposal-item">
              <h5>{proposal.title}</h5>
              <span>{proposal.submitted}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
