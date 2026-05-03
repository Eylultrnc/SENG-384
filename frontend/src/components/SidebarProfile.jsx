import React, { useEffect, useState } from 'react';
import { UserCircle2 } from 'lucide-react';
import { proposals } from '../data/mockData';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';

export default function SidebarProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('toastStateChanged', { detail: !!toastMessage }));
  }, [toastMessage]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const data = await apiFetch('/messages/unread-count');
        const count = Number(data.count) || 0;
        setUnreadCount(count);

        // Broadcast count so other components (like MainPage) can show a badge
        window.dispatchEvent(new CustomEvent('unreadCountChanged', { detail: count }));

        // Show Toast if there is a new unread message
        if (data.latestMessage) {
          const lastNotifiedId = localStorage.getItem('lastNotifiedMessageId');
          if (String(data.latestMessage.id) !== lastNotifiedId) {
            setToastMessage({
              sender: data.latestMessage.sender_name,
              content: data.latestMessage.content,
              time: new Date(data.latestMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
            localStorage.setItem('lastNotifiedMessageId', String(data.latestMessage.id));

            // Hide toast after 5 seconds
            setTimeout(() => setToastMessage(null), 5000);
          }
        }
      } catch (err) {
        console.error('UNREAD COUNT ERROR:', err);
      }
    };

    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <aside className="sidebar">
      <div className="sidebar-card profile-card">
        <div className="profile-card__header">
          <div className="profile-avatar">
            <UserCircle2 size={58} strokeWidth={1.7} />
          </div>

          <div style={{ overflow: 'hidden' }}>
            <h3 style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.fullName || 'John Doe'}
            </h3>
            <p>{user?.role || 'Healthcare Professional'}</p>
          </div>
        </div>

        <Link to="/profile" className="secondary-button secondary-button--wide">
          View Profile
        </Link>

        <Link
          to="/messages"
          className="secondary-button secondary-button--wide"
          style={{
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>DMs & Messages</span>

          {unreadCount > 0 && !toastMessage && (
            <span className="notification-dot"></span>
          )}
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
    {toastMessage && (
      <div 
        onClick={() => {
          setToastMessage(null);
          navigate('/messages');
        }}
        style={{
        position: 'fixed',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#1e293b',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        cursor: 'pointer',
        animation: 'slideDown 0.3s ease-out'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong style={{ fontSize: '14px', color: '#94a3b8' }}>Yeni mesaj: {toastMessage.sender}</strong>
          <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '16px' }}>{toastMessage.time}</span>
        </div>
        <span style={{ fontSize: '15px' }}>{toastMessage.content}</span>
      </div>
    )}
    </>
  );
}