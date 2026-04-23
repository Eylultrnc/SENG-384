import React from 'react';

export default function FormInput({
  label,
  placeholder,
  type = 'text',
  rightText,
  value,
  onChange
}) {
  return (
    <label className="form-group">
      {label && <span className="form-label">{label}</span>}

      <div className="input-wrap">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />

        {rightText ? (
          <span className="input-right-text">{rightText}</span>
        ) : null}
      </div>
    </label>
  );
} 