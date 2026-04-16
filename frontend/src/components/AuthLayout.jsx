import React from 'react';

export default function AuthLayout({ left, right, stacked = false }) {
  return (
    <div className={`auth-layout ${stacked ? 'auth-layout--stacked' : ''}`}>
      <section className="auth-pane auth-pane--left">{left}</section>
      <section className="auth-pane auth-pane--right">{right}</section>
    </div>
  );
}
