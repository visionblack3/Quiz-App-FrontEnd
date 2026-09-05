import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/authApi';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirm: '', 
    role: 'USER' 
  });

  // 1. FIXED: Added missing visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.username.trim()) return 'Username is required.';
    if (!EMAIL_REGEX.test(form.email)) return 'Only @gmail.com addresses are allowed.';
    if (!PASSWORD_REGEX.test(form.password)) {
      return 'Password needs 8+ characters with upper, lower, digit and a special character (@$!%*?&#).';
    }
    if (form.password !== form.confirm) return 'Passwords do not match.';
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
      await registerUser({ 
        username: form.username, 
        email: form.email, 
        password: form.password, 
        role: form.role 
      });
      setSuccess('Account created. Redirecting to sign in…');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <span className="auth-eyebrow">Testbench</span>
        <h1>Create account</h1>
        <p>Register with your Gmail address to get started.</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input id="username" name="username" value={form.username} onChange={onChange} required />
          </div>

          <div className="field">
            <label htmlFor="email">Gmail address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@gmail.com"
              value={form.email}
              onChange={onChange}
              required
            />
            <div className="field-hint">Only @gmail.com addresses are accepted.</div>
          </div>

          {/* PASSWORD FIELD WITH RELATIVE WRAPPER */}
          <div className="field">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={onChange}
                style={{ width: '100%', paddingRight: '40px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: 0
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '⌣' : '👁️'}
              </button>
            </div>
            <div className="field-hint">8+ chars, upper &amp; lower case, a digit, and one of @$!%*?&amp;#</div>
          </div>

          {/* CONFIRM PASSWORD FIELD WITH RELATIVE WRAPPER AND CORRECT STATE */}
          <div className="field">
            <label htmlFor="confirm">Confirm password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                id="confirm"
                name="confirm"
                type={showConfirm ? 'text' : 'password'}
                value={form.confirm}
                onChange={onChange}
                style={{ width: '100%', paddingRight: '40px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: 0
                }}
                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirm ? '⌣' : '👁️'}
              </button>
            </div>
          </div>

          <div className="field" style={{ marginBottom: '20px' }}>
            <label htmlFor="role">Register As:</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={onChange}
              className="input-select"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="auth-footer-link">
          Already registered? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}