import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../api/authApi';

const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/;

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const prefillEmail = location.state?.email || '';

  const [form, setForm] = useState({ email: prefillEmail, otp: '', newPassword: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(form.email)) return 'Enter a valid @gmail.com address.';
    if (!/^[0-9]{4}$/.test(form.otp)) return 'OTP must be exactly 4 digits.';
    if (!PASSWORD_REGEX.test(form.newPassword)) {
      return 'Password needs 8+ characters with upper, lower, digit and special character.';
    }
    if (form.newPassword !== form.confirm) return 'Passwords do not match.';
    return '';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ email: form.email, otp: form.otp, newPassword: form.newPassword });
      setSuccess('Password reset. Redirecting to sign in…');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.message || 'Could not reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <span className="auth-eyebrow">Testbench</span>
        <h1>Reset password</h1>
        <p>Enter the 4-digit code we emailed you along with a new password.</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="email">Gmail address</label>
            <input id="email" name="email" type="email" value={form.email} onChange={onChange} required />
          </div>
          <div className="field">
            <label htmlFor="otp">4-digit code</label>
            <input
              id="otp"
              name="otp"
              inputMode="numeric"
              maxLength={4}
              value={form.otp}
              onChange={onChange}
              required
            />
            <div className="field-hint">The code expires 5 minutes after it's sent.</div>
          </div>
          <div className="field">
            <label htmlFor="newPassword">New password</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={form.newPassword}
              onChange={onChange}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="confirm">Confirm new password</label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={onChange}
              required
            />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Resetting…' : 'Reset password'}
          </button>
        </form>

        <div className="auth-footer-link">
          <Link to="/forgot-password">Resend code</Link> · <Link to="/login">Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}
