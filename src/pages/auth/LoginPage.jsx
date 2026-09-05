import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.username, form.password);
      const isAdmin = user.role === 'ADMIN' || user.role === 'ROLE_ADMIN';
      navigate(isAdmin ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Username or password wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <span className="auth-eyebrow">Testbench</span>
        <h1>Sign in</h1>
        {/* <p>Take assessments or manage your quiz bank.</p> */}

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              autoComplete="username"
              value={form.username}
              onChange={onChange}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={onChange}
              required
            />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="auth-footer-link">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <div className="auth-footer-link">
          New here? <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
