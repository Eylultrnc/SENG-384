import { ArrowLeft, Settings, Stethoscope } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import React, { useState } from 'react';
import { apiFetch } from '../api';

const roleContent = {
  healthcare: {
    title: 'Healthcare Professional',
    description:
      'Join as a healthcare professional to share cases, seek AI-powered insights, and connect with expert engineers. Collaborate on real-world problems and improve patient care with innovative technology.',
    Icon: Stethoscope,
  },
  engineer: {
    title: 'Engineer',
    description:
      'Join as an engineer to collaborate on healthcare AI solutions. Connect with healthcare professionals, share your expertise, and work on innovative projects that make an impact.',
    Icon: Settings,
  },
};

export default function RegisterPage({ role = 'healthcare' }) {
  const navigate = useNavigate();
  const currentRole = roleContent[role];
  const { Icon } = currentRole;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !email || !password || !repeatPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== repeatPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          fullName: `${firstName} ${lastName}`,
          email,
          password,
          role: role.toUpperCase(),
          institution: '',
        }),
      });

      setError('');
      alert('Registration successful! Please log in with your credentials.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      left={
        <div className="register-left">
          <Link to="/" className="back-link">
            <ArrowLeft size={18} /> Go Back
          </Link>
          <div className="register-role-block">
            <Icon size={84} strokeWidth={1.8} />
            <div>
              <h2>{currentRole.title}</h2>
              <p>{currentRole.description}</p>
            </div>
          </div>
        </div>
      }
      right={
        <div className="auth-form-card auth-form-card--medium">
          <h2>Register</h2>
          <p className="subtle-copy">Create a new account to get started.</p>
          <form className="form-stack" onSubmit={handleRegister}>
            <div className="two-column-grid">
              <FormInput
                label="Name"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <FormInput
                label="Last Name"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <FormInput
              label="Email"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormInput
              label="Password"
              placeholder="Create a password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormInput
              label="Repeat Password"
              placeholder="Repeat your password"
              type="password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button
              type="submit"
              className="primary-button primary-button--light"
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
        </div>
      }
    />
  );
}
