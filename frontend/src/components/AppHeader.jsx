import { ArrowLeft, Home, UserCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import React from 'react';

export default function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header__left">
        <Link to="/" className="icon-button" aria-label="Go back">
          <ArrowLeft size={20} />
        </Link>
        <Link to="/main" className="icon-button" aria-label="Home page">
          <Home size={20} />
        </Link>
      </div>
      <div className="app-header__title">HEALTH AI</div>
      <Link to="/profile" className="header-avatar" aria-label="Open profile">
        <UserCircle2 size={22} />
      </Link>
    </header>
  );
}
