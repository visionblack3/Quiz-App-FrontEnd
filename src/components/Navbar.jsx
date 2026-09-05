import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <span className="brand-mark">TB</span>
          Testbench
        </div>

        <nav className="nav-links">
          {isAdmin ? (
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Manage quizzes
            </NavLink>
          ) : (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Quizzes
              </NavLink>
              <NavLink to="/my-scores" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                My scores
              </NavLink>
            </>
          )}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className="nav-role-chip">{user?.username} · {isAdmin ? 'ADMIN' : 'USER'}</span>
          <button className="btn-ghost" onClick={handleLogout}>Sign out</button>
        </div>
      </div>
    </header>
  );
}
