import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(localStorage.getItem('username'));
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(localStorage.getItem('username'));
    };
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  }, [navigate]);

  const isActive = useCallback((path) => location.pathname === path, [location.pathname]);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container">
        <div className="nav-left">
          <Link to="/" className="nav-brand" aria-label="MyGear home">
            <span className="nav-brand-logo" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
                <defs>
                  <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
                <rect width="80" height="80" x="10" y="10" rx="20" fill="url(#logo-grad)" />
                <text x="50" y="66" fontSize="44" fontWeight="700" textAnchor="middle" fill="white" fontFamily="Inter, system-ui">G</text>
              </svg>
            </span>
            <span className="nav-brand-text">MyGear</span>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`nav-hamburger ${mobileOpen ? 'open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>

        {/* Mobile backdrop */}
        {mobileOpen && (
          <div className="nav-mobile-backdrop" onClick={() => setMobileOpen(false)} />
        )}

        <div className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Home
          </Link>

          {user && (
            <Link to="/myself" className={`nav-link ${isActive('/myself') ? 'active' : ''}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              My Profile
            </Link>
          )}

          {user && (
            <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              My Gear
            </Link>
          )}

          <div className="nav-separator" />

          {user ? (
            <button onClick={handleLogout} className="glass-button secondary nav-button">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="glass-button secondary nav-button">Login</Link>
              <Link to="/register" className="glass-button nav-button nav-button-primary">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
