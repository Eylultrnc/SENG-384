import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function NDAModal({ isOpen, onClose, onAccept }) {
  const [accepted, setAccepted] = useState(false);

  if (!isOpen) return null;

  const handleAccept = (e) => {
    e.preventDefault();
    if (accepted) {
      onAccept();
      setAccepted(false); // Reset state for next time
    }
  };

  const handleClose = () => {
    setAccepted(false);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2>Non-Disclosure Agreement (NDA)</h2>
          <button type="button" className="icon-button" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleAccept} className="modal-body">
          <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '14px', lineHeight: '1.6', color: '#334155', maxHeight: '200px', overflowY: 'auto', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
            <p><strong>Strictly Confidential</strong></p>
            <p>
              By expressing interest in this project, you agree to maintain strict confidentiality regarding all discussions, materials, and proprietary information shared during the collaboration process.
            </p>
            <p>
              You shall not disclose, reproduce, or use any project-related information for any purpose other than evaluating or participating in this specific collaboration. Any violation of this agreement may result in legal action and permanent suspension from the HealthAI platform.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <input 
              type="checkbox" 
              id="nda-checkbox" 
              checked={accepted} 
              onChange={(e) => setAccepted(e.target.checked)} 
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="nda-checkbox" style={{ fontSize: '14px', cursor: 'pointer', userSelect: 'none' }}>
              I have read and agree to the Non-Disclosure Agreement
            </label>
          </div>

          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="secondary-button" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={!accepted}>
              Accept & Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
