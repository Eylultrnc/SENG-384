import React, { useState } from "react";
import { apiFetch } from "../api";
import "./FeedbackModal.css";

export default function FeedbackModal({ onClose }) {
  const [type, setType] = useState("GENERAL");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Please enter a message.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiFetch("/feedbacks", {
        method: "POST",
        body: JSON.stringify({ type, message })
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content feedback-modal">
        <div className="modal-header">
          <h2>Send Feedback</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        {success ? (
          <div className="feedback-success">
            <p>Thank you for your feedback!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="feedback-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label>Category</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="GENERAL">General Feedback</option>
                <option value="FEATURE">Feature Request</option>
                <option value="BUG">Bug Report</option>
              </select>
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you think..."
                rows="5"
                required
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
