import React, { useState, useEffect } from 'react';
import AppHeader from '../components/AppHeader';
import SidebarProfile from '../components/SidebarProfile';
import AddFriendModal from '../components/AddFriendModal';
import ScheduleMeetingModal from '../components/ScheduleMeetingModal';
import { Send, UserPlus } from 'lucide-react';
import { apiFetch } from '../api';
import { useParams } from 'react-router-dom';

export default function MessagesPage() {
  const { userId } = useParams();
  const [users, setUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [rescheduleMeetingData, setRescheduleMeetingData] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = currentUser.id || currentUser.userId;

  const activeMeeting = meetings
    .filter((m) => {
      const requesterId = String(m.requester_id);
      const receiverId = String(m.receiver_id);
      const activeChatId = String(activeChat?.id);
      const me = String(currentUserId);

      return (
        (requesterId === me && receiverId === activeChatId) ||
        (receiverId === me && requesterId === activeChatId)
      );
    })
    .sort((a, b) => {
      if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
      if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
      return new Date(b.created_at) - new Date(a.created_at);
    })[0];

  useEffect(() => {
    fetchUsers();
    fetchMeetings();
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.id);
      fetchMeetings();
    }

    const handleNewMessage = () => {
      if (activeChat) {
        fetchMessages(activeChat.id);
        fetchMeetings();
      }
    };

    window.addEventListener('unreadCountChanged', handleNewMessage);
    return () => window.removeEventListener('unreadCountChanged', handleNewMessage);
  }, [activeChat]);

  const fetchMeetings = async () => {
    try {
      const data = await apiFetch('/messages/meetings');
      setMeetings(data);
    } catch (err) {
      console.error('MEETINGS ERROR:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/users');
      setUsers(data);

      if (data.length > 0) {
        if (userId) {
          const selectedUser = data.find((u) => String(u.id) === String(userId));
          setActiveChat(selectedUser || data[0]);
          return;
        }

        setActiveChat(data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatUserId) => {
    try {
      const data = await apiFetch(`/messages/${chatUserId}`);
      setMessages(data);

      const latestIncomingMessage = data
        .filter((msg) => String(msg.sender_id) !== String(currentUserId))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

      if (latestIncomingMessage) {
        localStorage.setItem(
          `lastRead_${currentUserId}_${chatUserId}`,
          latestIncomingMessage.created_at
        );

        window.dispatchEvent(new Event('unread-updated'));
      }
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const respondMeeting = async (meetingId, action) => {
    try {
      const updated = await apiFetch('/messages/meeting/respond', {
        method: 'POST',
        body: JSON.stringify({ meetingId, action })
      });

      setMeetings(meetings.map((m) =>
        m.id === updated.id ? updated : m
      ));

      if (activeChat) {
        fetchMessages(activeChat.id);
      }
    } catch (err) {
      console.error(err);
      alert('Meeting response failed');
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeChat) return;

    try {
      await apiFetch('/messages', {
        method: 'POST',
        body: JSON.stringify({
          receiverId: activeChat.id,
          content: messageText
        })
      });

      setMessageText('');
      fetchMessages(activeChat.id);
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  return (
    <div className="app-shell messages-shell">
      <AppHeader />

      <main className="dashboard-layout messages-layout">
        <SidebarProfile />

        <section className="messages-container">
          <div className="messages-sidebar">
            <div className="messages-sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>Messages</h2>
              <button
                className="primary-button"
                style={{ padding: '6px 12px', minHeight: 'auto' }}
                onClick={() => setIsAddFriendOpen(true)}
              >
                <UserPlus size={16} />
              </button>
            </div>

            <div className="conversation-list">
              {loading ? (
                <p style={{ padding: '24px', color: '#666' }}>Loading users...</p>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className={`conversation-item ${activeChat?.id === user.id ? 'active' : ''}`}
                    onClick={() => setActiveChat(user)}
                  >
                    <div className="avatar-placeholder">{(user.full_name || 'U')[0].toUpperCase()}</div>
                    <div className="conversation-info">
                      <div className="conversation-header">
                        <h4>{user.full_name}</h4>
                      </div>
                      <p className="last-message">{user.role}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="messages-chat-view">
            {activeChat ? (
              <>
                <div className="chat-header">
                  <div className="chat-recipient">
                    <div className="avatar-placeholder">{(activeChat.full_name || 'U')[0].toUpperCase()}</div>
                    <div>
                      <h3>{activeChat.full_name}</h3>
                      <p>{activeChat.role}</p>
                    </div>
                  </div>

                </div>

                {activeMeeting && (
                  <div className="meeting-banner">
                    <div>
                      <strong>Meeting Scheduled</strong>
                      <p>{new Date(activeMeeting.meeting_time).toLocaleString()}</p>
                    </div>

                    {String(activeMeeting.requester_id) !== String(currentUserId) &&
                    activeMeeting.status === 'PENDING' ? (
                      <div className="meeting-actions">
                        <button
                          className="secondary-button"
                          onClick={() => respondMeeting(activeMeeting.id, 'ACCEPTED')}
                        >
                          Accept
                        </button>

                        <button
                          className="secondary-button"
                          onClick={() => respondMeeting(activeMeeting.id, 'DECLINED')}
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <div className="meeting-actions">
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb' }}>
                          {activeMeeting.status}
                        </span>

                        {String(activeMeeting.requester_id) === String(currentUserId) &&
                          activeMeeting.status === 'PENDING' && (
                            <button
                              className="secondary-button"
                              onClick={() => setRescheduleMeetingData(activeMeeting)}
                            >
                              Reschedule
                            </button>
                          )}
                      </div>
                    )}
                  </div>
                )}

                <div className="chat-bubbles-area">
                  {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: 'auto', marginBottom: 'auto' }}>
                      No messages yet. Say hi!
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isSentByMe = String(msg.sender_id) === String(currentUserId);

                      return (
                        <div key={msg.id} className={`chat-bubble ${isSentByMe ? 'sent' : 'received'}`}>
                          <p>{msg.content}</p>
                          <span className="timestamp">
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="chat-input-area">
                  <div className="chat-input-wrapper">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />

                    <button className="send-btn" onClick={handleSendMessage}>
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', background: '#f8fafc' }}>
                <Send size={48} style={{ color: '#cbd5e1', marginBottom: '20px' }} />
                <h2>Your Messages</h2>
                <p>Select a user from the left sidebar to start chatting.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <AddFriendModal
        isOpen={isAddFriendOpen}
        onClose={() => setIsAddFriendOpen(false)}
        users={users}
        onSelectUser={(u) => setActiveChat(u)}
      />

      <ScheduleMeetingModal
        isOpen={!!rescheduleMeetingData}
        request={rescheduleMeetingData}
        isReschedule={true}
        onClose={() => setRescheduleMeetingData(null)}
        onScheduled={(updatedMeeting) => {
          setMeetings(meetings.map((m) =>
            m.id === updatedMeeting.id ? updatedMeeting : m
          ));

          if (activeChat) {
            fetchMessages(activeChat.id);
          }
        }}
      />
    </div>
  );
}