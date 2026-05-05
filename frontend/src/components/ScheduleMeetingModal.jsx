import React, { useState } from 'react';
import { apiFetch } from '../api';

export default function ScheduleMeetingModal({
  isOpen,
  onClose,
  request,
  onScheduled,
  isReschedule = false
}) {
  const [meetingTime, setMeetingTime] = useState('');

  const nowLocal = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  if (!isOpen || !request) return null;

  const handleSubmit = async () => {
    if (!meetingTime) {
      alert('Please select a meeting time');
      return;
    }

    if (new Date(meetingTime) <= new Date()) {
      alert('Please select a future date and time');
      return;
    }

    const meetingTimeForApi = new Date(meetingTime).toISOString();

    try {
      const created = await apiFetch(
        isReschedule ? '/messages/meeting/reschedule' : '/messages/meeting',
        {
          method: isReschedule ? 'PATCH' : 'POST',
          body: JSON.stringify(
            isReschedule
              ? { meetingId: request.id, meetingTime: meetingTimeForApi }
              : {
                  receiverId: request.receiver_id,
                  postId: request.post_id,
                  meetingTime: meetingTimeForApi
                }
          )
        }
      );

      onScheduled(created);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Meeting could not be scheduled');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>{isReschedule ? 'Reschedule Meeting' : 'Schedule Meeting'}</h2>

        <p style={{ color: '#64748b' }}>
          Choose a date and time for <strong>{request.post_title}</strong>
        </p>

        <input
          className="filter-input"
          type="datetime-local"
          min={nowLocal}
          value={meetingTime}
          onChange={(e) => setMeetingTime(e.target.value)}
          style={{ width: '100%', marginTop: '12px' }}
        />

        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <button className="primary-button" onClick={handleSubmit}>
            {isReschedule ? 'Update' : 'Schedule'}
          </button>

          <button className="secondary-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}