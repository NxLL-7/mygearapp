import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import "./Login.css";
import "../Toast.css";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_Name: "",
    user_mobile: "",
    username: "",
    password: "",
  });
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }; 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingFields = [];
    if (!formData.full_Name) missingFields.push("Name");
    if (!formData.user_mobile) missingFields.push("Phone");
    if (!formData.username) missingFields.push("Username");
    if (!formData.password) missingFields.push("Password");

    if (missingFields.length > 0) {
      setErrorMessage(`Please fill in: ${missingFields.join(", ")}`);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccessMessage(result.message || "Registration successful!");
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/login");
        }, 2000);
      } else {
        setErrorMessage(result.message || "Registration failed");
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (err) {
      setErrorMessage("A network error has occurred. Please try again.");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  return (
    <div className="page-container centered-form-page register-container">
      {/* Ambient orbs */}
      <div className="auth-orbs" aria-hidden="true">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
      </div>

      {showSuccess && (
        <div className="toast-notification">
          <span className="toast-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
          <span className="toast-text">{successMessage}</span>
        </div>
      )}
      {showError && (
        <div className="toast-notification error">
          <span className="toast-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </span>
          <span className="toast-text">{errorMessage}</span>
        </div>
      )}

      <div className="glass-panel register-panel">
        <div className="auth-header">
          <div className="auth-logo" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="reg-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
              <rect width="80" height="80" x="10" y="10" rx="20" fill="url(#reg-logo-grad)" />
              <text x="50" y="66" fontSize="44" fontWeight="700" textAnchor="middle" fill="white" fontFamily="Inter, system-ui">G</text>
            </svg>
          </div>
          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">Start managing your gear collection</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="auth-label" htmlFor="reg-name">Full Name</label>
            <div className="auth-input-wrapper">
              <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input
                id="reg-name"
                type="text"
                name="full_Name"
                className="glass-input auth-input"
                placeholder="Enter your full name"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="auth-label" htmlFor="reg-phone">Phone Number</label>
            <div className="auth-input-wrapper">
              <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <input
                id="reg-phone"
                type="tel"
                name="user_mobile"
                className="glass-input auth-input"
                placeholder="Enter your phone number"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="auth-label" htmlFor="reg-username">Username</label>
            <div className="auth-input-wrapper">
              <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input
                id="reg-username"
                type="text"
                name="username"
                className="glass-input auth-input"
                placeholder="Choose a username"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="auth-label" htmlFor="reg-password">Password</label>
            <div className="auth-input-wrapper">
              <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input
                id="reg-password"
                type="password"
                name="password"
                className="glass-input auth-input"
                placeholder="Create a secure password"
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="glass-button auth-submit-btn">
            Create Account
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </form>

        <div className="auth-footer">
          <span className="auth-footer-text">Already have an account?</span>
          <Link to="/login" className="auth-footer-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
