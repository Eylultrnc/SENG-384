import React, { useEffect, useState } from 'react';
import { UserCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api';

export default function SidebarProfile() {
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [requests, setRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const data = await apiFetch('/messages/unread-count');
        setUnreadCount(Number(data.count) || 0);
      } catch (err) {
        console.error('UNREAD COUNT ERROR:', err);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await apiFetch('/messages/requests');
        setRequests(data);
      } catch (err) {
        console.error('REQUEST ERROR:', err);
      }
    };

    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchAcceptedRequests = async () => {
      try {
        const data = await apiFetch('/messages/requests/accepted');
        setAcceptedRequests(data);
      } catch (err) {
        console.error('ACCEPTED REQUEST ERROR:', err);
      }
    };

    fetchAcceptedRequests();
    const interval = setInterval(fetchAcceptedRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const data = await apiFetch('/posts/my-posts');
        setMyPosts(data);
      } catch (err) {
        console.error('MY POSTS ERROR:', err);
      }
    };

    fetchMyPosts();
  }, []);

  const respondRequest = async (requestId, action) => {
    try {
      await apiFetch('/messages/request/respond', {
        method: 'POST',
        body: JSON.stringify({ requestId, action })
      });

      setRequests(requests.filter((req) => req.id !== requestId));
    } catch (err) {
      console.error('RESPOND REQUEST ERROR:', err);
    }
  };

  return (
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
          {unreadCount > 0 && <span className="notification-dot"></span>}
        </Link>

        {requests.length > 0 && (
          <div style={{ marginTop: '12px', padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ fontSize: '14px' }}>New Requests</strong>

            {requests.map((req) => (
              <div key={req.id} style={{ marginTop: '10px', fontSize: '13px' }}>
                <p style={{ margin: 0 }}>{req.sender_name}</p>
                <p style={{ margin: 0, fontWeight: '600' }}>{req.post_title}</p>

                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button
                    type="button"
                    className="secondary-button"
                    style={{ padding: '6px 10px', minHeight: '32px', fontSize: '12px' }}
                    onClick={() => respondRequest(req.id, 'ACCEPTED')}
                  >
                    Accept
                  </button>

                  <button
                    type="button"
                    className="secondary-button"
                    style={{ padding: '6px 10px', minHeight: '32px', fontSize: '12px' }}
                    onClick={() => respondRequest(req.id, 'REJECTED')}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {acceptedRequests.length > 0 && (
          <div style={{ marginTop: '12px', padding: '12px', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
            <strong style={{ fontSize: '14px' }}>Accepted Requests</strong>

            {acceptedRequests.map((req) => (
              <div key={req.id} style={{ marginTop: '10px', fontSize: '13px' }}>
                <p style={{ margin: 0 }}>{req.receiver_name} accepted your request</p>
                <p style={{ margin: 0, fontWeight: '600' }}>{req.post_title}</p>

                <div className="accepted-actions">
                  <Link
                    to={`/messages/${req.receiver_id}`}
                    className="accepted-action-button"
                  >
                    Open DM
                  </Link>

                  <button
                    type="button"
                    className="accepted-action-button"
                    onClick={async () => {
                      const time = prompt("Enter meeting time (YYYY-MM-DD HH:mm)");
                      if (!time) return;

                      try {
                        await apiFetch('/messages/meeting', {
                          method: 'POST',
                          body: JSON.stringify({
                            receiverId: req.receiver_id,
                            postId: req.post_id,
                            meetingTime: time
                          })
                        });

                        alert('Meeting scheduled 📅');
                      } catch (err) {
                        console.error(err);
                        alert('Failed');
                      }
                    }}
                  >
                    Schedule
                  </button>

                  <button
                    type="button"
                    className="accepted-action-button accepted-action-muted"
                    onClick={() =>
                      setAcceptedRequests(
                        acceptedRequests.filter((r) => r.id !== req.id)
                      )
                    }
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sidebar-card">
        <h4>About Me</h4>
        <p>
          {user?.bio || 'No bio added yet.'}
        </p>
      </div>

      <div className="sidebar-card">
        <h4>My Posts</h4>
        <div className="proposal-list">
          {myPosts.length === 0 ? (
            <p style={{ color: '#64748b' }}>No posts yet.</p>
          ) : (
            myPosts.map((post) => (
              <div key={post.id} className="proposal-item">
                <h5>{post.title}</h5>
                <span>{post.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}