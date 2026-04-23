import { Navigate, Route, Routes } from 'react-router-dom';
import LoginLandingPage from './pages/LoginLandingPage';
import StandaloneLoginPage from './pages/StandaloneLoginPage';
import RegisterPage from './pages/RegisterPage';
import MainPage from './pages/MainPage';
import ProfilePage from './pages/ProfilePage';
import MessagesPage from './pages/MessagesPage';
import React from 'react';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginLandingPage />} />
      <Route path="/login" element={<StandaloneLoginPage />} />
      <Route path="/register/healthcare" element={<RegisterPage role="healthcare" />} />
      <Route path="/register/engineer" element={<RegisterPage role="engineer" />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
