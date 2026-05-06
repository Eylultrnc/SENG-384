import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { apiFetch } from '../api';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('Verifying your email...');
  const navigate = useNavigate();
  const hasFetched = React.useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    const verifyToken = async () => {
      try {
        await apiFetch(`/auth/verify-email?token=${token}`);
        setStatus('success');
        setMessage('Your email has been successfully verified! You can now log in.');
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Verification failed. The link might be invalid or expired.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <AuthLayout
      left={
        <div className="register-left" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2>Email Verification</h2>
          <p>Verifying your account to give you full access to HealthAI.</p>
        </div>
      }
      right={
        <div className="auth-form-card auth-form-card--medium" style={{ textAlign: 'center' }}>
          {status === 'loading' && (
            <div>
              <h2>Verifying...</h2>
              <p className="subtle-copy">{message}</p>
            </div>
          )}
          {status === 'success' && (
            <div>
              <CheckCircle2 size={64} color="#22c55e" style={{ margin: '0 auto 20px' }} />
              <h2>Verified!</h2>
              <p className="subtle-copy" style={{ color: '#166534', marginBottom: '24px' }}>{message}</p>
              <button onClick={() => navigate('/')} className="primary-button primary-button--light">
                Go to Login
              </button>
            </div>
          )}
          {status === 'error' && (
            <div>
              <XCircle size={64} color="#ef4444" style={{ margin: '0 auto 20px' }} />
              <h2>Verification Failed</h2>
              <p className="subtle-copy" style={{ color: '#991b1b', marginBottom: '24px' }}>{message}</p>
              <button onClick={() => navigate('/')} className="secondary-button" style={{ width: '100%' }}>
                Back to Home
              </button>
            </div>
          )}
        </div>
      }
    />
  );
}
