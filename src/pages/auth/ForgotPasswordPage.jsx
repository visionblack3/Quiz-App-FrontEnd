import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../api/authApi';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      // Carry the email forward so the reset screen doesn't ask twice.
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      setError(err.message || 'Could not send the OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <span className="auth-eyebrow">Testbench</span>
        <h1>Forgot password</h1>
        <p>We'll email a 4-digit code to your registered Gmail address.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="email">Gmail address</label>
            <input
              id="email"
              type="email"
              placeholder="you@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Sending code…' : 'Send code'}
          </button>
        </form>

        <div className="auth-footer-link">
          <Link to="/login">Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}
