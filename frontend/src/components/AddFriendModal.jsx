import React, { useState, useEffect } from 'react';
import { X, UserPlus, Search } from 'lucide-react';

export default function AddFriendModal({ isOpen, onClose, users, onSelectUser }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{maxWidth: '450px'}}>
        <div className="modal-header">
          <h2>Start Conversation</h2>
          <button className="icon-button" onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="modal-body" style={{padding: '0'}}>
          <div style={{padding: '16px', borderBottom: '1px solid #e2e6ec'}}>
            <div className="search-bar-small">
              <Search size={14} />
              <input 
                type="text" 
                placeholder="Search colleagues by name or role..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div style={{maxHeight: '350px', overflowY: 'auto', padding: '8px 0'}}>
            {filteredUsers.length === 0 ? (
              <p style={{padding: '24px', textAlign: 'center', color: '#64748b'}}>No users found matching your search.</p>
            ) : (
              filteredUsers.map(user => (
                <div 
                  key={user.id} 
                  style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '12px 20px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  onClick={() => {
                    onSelectUser(user);
                    onClose();
                  }}
                >
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <div className="avatar-placeholder" style={{width: '40px', height: '40px'}}>
                      {(user.full_name || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 style={{margin: '0 0 4px 0', fontSize: '1rem', color: '#0f172a'}}>{user.full_name}</h4>
                      <p style={{margin: '0', fontSize: '0.8rem', color: '#64748b'}}>{user.role}</p>
                    </div>
                  </div>
                  <button className="secondary-button" style={{padding: '6px 12px', minHeight: 'auto'}}>
                    <UserPlus size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
