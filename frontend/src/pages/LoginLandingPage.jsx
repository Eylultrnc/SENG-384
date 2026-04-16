import { Link, useNavigate } from 'react-router-dom';
import { Settings, Stethoscope } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import RoleCard from '../components/RoleCard';
import FormInput from '../components/FormInput';
import React from 'react';

export default function LoginLandingPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      left={
        <div className="auth-center auth-copy-block">
          <h1>HEALTH AI</h1>
          <p className="subtle-copy">Welcome! If you don't have an account please choose your role to sign up</p>
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
          <div className="form-stack">
            <FormInput label="Email" placeholder="Enter your email" />
            <FormInput label="Password" placeholder="Enter your password" type="password" rightText="Forgot Password?" />
            <label className="checkbox-row">
              <input type="checkbox" />
              <span>Remember Me</span>
            </label>
            <Link className="primary-button primary-button--light" to="/main">
              Log In
            </Link>
          </div>
        </div>
      }
    />
  );
}
