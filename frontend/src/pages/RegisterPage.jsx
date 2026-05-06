import { ArrowLeft, Settings, Stethoscope } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
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
  const currentRole = roleContent[role];
  const { Icon } = currentRole;
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [verificationToken, setVerificationToken] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }
    setError('');
    setLoading(true);

    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          fullName: `${firstName} ${lastName}`.trim(),
          email,
          password,
          role,
        }),
      });
      setSuccess("Account created successfully!");
      if (data.verificationToken) {
        setVerificationToken(data.verificationToken);
      }
    } catch (err) {
      setError(err.message || "Registration failed");
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
              <FormInput required value={firstName} onChange={e => setFirstName(e.target.value)} label="Name" placeholder="First name" />
              <FormInput required value={lastName} onChange={e => setLastName(e.target.value)} label="Last Name" placeholder="Last name" />
            </div>
            <FormInput required value={email} onChange={e => setEmail(e.target.value)} label="Email" placeholder="Enter your email" type="email" />
            <FormInput required value={password} onChange={e => setPassword(e.target.value)} label="Password" placeholder="Create a password" type="password" />
            <FormInput required value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)} label="Repeat Password" placeholder="Repeat your password" type="password" />
            
            {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}
            {success && <p className="success-message" style={{color: 'green', marginBottom: '10px'}}>{success}</p>}
            
            {verificationToken && (
              <div style={{ padding: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', marginBottom: '16px' }}>
                <p style={{ fontSize: '13px', color: '#166534', margin: '0 0 8px 0' }}>
                  Please check your email to verify your account. (Simulation link below)
                </p>
                <Link 
                  to={`/verify-email?token=${verificationToken}`}
                  style={{ display: 'inline-block', fontSize: '14px', color: '#15803d', fontWeight: 'bold', textDecoration: 'underline' }}
                >
                  Verify Email Address
                </Link>
              </div>
            )}
            
            {!verificationToken && (
              <button disabled={loading} type="submit" className="primary-button primary-button--light">
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            )}
          </form>
        </div>
      }
    />
  );
}
