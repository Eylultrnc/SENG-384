import React from 'react';

export default function FormInput({ label, placeholder, type = 'text', rightText }) {
  return (
    <label className="form-group">
      {label && <span className="form-label">{label}</span>}
      <div className="input-wrap">
        <input type={type} placeholder={placeholder} />
        {rightText ? <span className="input-right-text">{rightText}</span> : null}
      </div>
    </label>
  );
}
