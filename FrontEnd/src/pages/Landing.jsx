import { Link } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  const user = localStorage.getItem('username');

  return (
    <div className="page-container">
      {/* Ambient glow orbs */}
      <div className="landing-orbs" aria-hidden="true">
        <div className="landing-orb landing-orb-1" />
        <div className="landing-orb landing-orb-2" />
        <div className="landing-orb landing-orb-3" />
      </div>

      <div className="landing-hero flex-center">
        <div className="container text-center landing-content">
          <div className="landing-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Your personal gear manager
          </div>

          <h1 className="landing-title">
            Track everything<br />
            <span className="landing-title-accent">you own.</span>
          </h1>

          <p className="landing-subtitle">
            A beautiful way to manage your daily gadgets, catalog your inventory,<br className="landing-br" />
            and keep track of the things that matter to you.
          </p>

          <div className="landing-cta-group">
            <Link to={user ? "/about" : "/register"} className="glass-button landing-cta-primary">
              {user ? "Go To Your Dashboard" : "Register Now !!"}
              {/* <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg> */}
            </Link>
            {!user && (
              <Link to="/login" className="glass-button secondary landing-cta-secondary">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="container landing-features">
        <div className="landing-features-grid">
          <div className="glass-panel landing-feature-card">
            <div className="landing-feature-icon landing-feature-icon-violet">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            </div>
            <h3 className="landing-feature-title">Inventory Management</h3>
            <p className="landing-feature-desc">Add, organize, and describe all your gadgets in one beautiful dashboard.</p>
          </div>

          <div className="glass-panel landing-feature-card">
            <div className="landing-feature-icon landing-feature-icon-cyan">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <h3 className="landing-feature-title">Favorites System</h3>
            <p className="landing-feature-desc">Mark your most-loved gear as favorites and access them instantly.</p>
          </div>

          <div className="glass-panel landing-feature-card">
            <div className="landing-feature-icon landing-feature-icon-blue">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 className="landing-feature-title">Secure & Personal</h3>
            <p className="landing-feature-desc">Your data is private and secure. Only you can see your collection.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
