import { ArrowLeft, Settings, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import React from 'react';

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
          <div className="form-stack">
            <div className="two-column-grid">
              <FormInput label="Name" placeholder="First name" />
              <FormInput label="Last Name" placeholder="Last name" />
            </div>
            <FormInput label="Email" placeholder="Enter your email" />
            <FormInput label="Password" placeholder="Create a password" type="password" />
            <FormInput label="Repeat Password" placeholder="Repeat your password" type="password" />
            <Link className="primary-button primary-button--light" to="/main">
              Sign Up
            </Link>
          </div>
        </div>
      }
    />
  );
}
