import { Link } from 'react-router-dom';

export default function StandaloneLoginPage() {
  return (
    <main className="standalone-login-page">
      <div className="standalone-login-card">
        <h1>Login to Your Account</h1>
        <div className="form-stack">
          <input className="standalone-input" type="email" placeholder="Email" />
          <input className="standalone-input" type="password" placeholder="Password" />
          <Link to="/main" className="primary-button">
            Login
          </Link>
          <a className="standalone-forgot" href="#">Forgot Password?</a>
        </div>
      </div>
    </main>
  );
}
