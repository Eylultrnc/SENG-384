import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Stethoscope } from 'lucide-react';
import { apiFetch } from '../api';
import AuthLayout from '../components/AuthLayout';
import RoleCard from '../components/RoleCard';
import FormInput from '../components/FormInput';

export default function LoginLandingPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/main');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <AuthLayout
      left={
        <div className="auth-center auth-copy-block">
          <h1>HEALTH AI</h1>
          <p className="subtle-copy">
            Welcome! If you don't have an account please choose your role to sign up
          </p>

          <div className="role-card-grid">
            <RoleCard
              icon={Settings}
              title="Engineer"
              description="Join as an engineer to collaborate on healthcare AI solutions."
              onClick={() => navigate('/register/engineer')}
            />
            <RoleCard
              icon={Stethoscope}
              title="Healthcare Professional"
              description="Join as a healthcare professional to share cases and connect with engineers."
              onClick={() => navigate('/register/healthcare')}
            />
          </div>
        </div>
      }
      right={
        <div className="auth-form-card auth-form-card--narrow">
          <h2>Login</h2>
          <p className="subtle-copy">Sign in to continue to Health AI.</p>

          <form className="form-stack" onSubmit={handleLogin}>
            <FormInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <FormInput
              label="Password"
              placeholder="Enter your password"
              type="password"
              rightText="Forgot Password?"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label className="checkbox-row">
              <input type="checkbox" />
              <span>Remember Me</span>
            </label>

            <button
              type="submit"
              className="primary-button primary-button--light"
            >
              Log In
            </button>

            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      }
    />
  );
} 