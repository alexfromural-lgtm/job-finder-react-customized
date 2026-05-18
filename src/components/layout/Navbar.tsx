import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate('/');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container">
        <div className="navbar-inner">
          {/* Logo */}
          <NavLink to="/" className="navbar-logo" aria-label="JobFinder home">
            ⚡ JobFinder
          </NavLink>

          {/* Desktop links */}
          <div className="navbar-links" style={{ display: 'flex' }}>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
              Browse Jobs
            </NavLink>

            {isAuthenticated && hasRole('JOB_SEEKER') && (
              <NavLink to="/dashboard/seeker" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                My Dashboard
              </NavLink>
            )}

            {isAuthenticated && hasRole('JOB_SEEKER') && (
              <NavLink to="/dashboard/seeker/applications" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                My Applications
              </NavLink>
            )}

            {isAuthenticated && hasRole('JOB_SEEKER') && (
              <NavLink to="/dashboard/seeker/saved" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Saved Jobs
              </NavLink>
            )}

            {isAuthenticated && hasRole('JOB_SEEKER') && (
              <NavLink to="/profile/seeker" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                My Profile
              </NavLink>
            )}

            {isAuthenticated && hasRole('RECRUITER') && (
              <NavLink to="/dashboard/recruiter" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                My Jobs
              </NavLink>
            )}

            {isAuthenticated && hasRole('RECRUITER') && (
              <NavLink to="/profile/recruiter" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                My Profile
              </NavLink>
            )}

            {isLoading ? (
              // Placeholder keeps the navbar height stable while session resolves
              <div style={{ width: 120, height: 32 }} />
            ) : isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  👤 {user?.name}
                </span>
                <Button
                  id="logout-btn"
                  variant="secondary"
                  size="sm"
                  loading={loggingOut}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '0.5rem' }}>
                <Button
                  id="nav-login-btn"
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  id="nav-signup-btn"
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
