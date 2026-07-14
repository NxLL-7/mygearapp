import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./MySelf.css";
import "./About.css";

export default function MySelf() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [gadgets, setGadgets] = useState([]);
  const [profile, setProfile] = useState({
    username: "",
    fullName: "",
    mobile: "",
    password: "",
  });

  const [selectedGadget, setSelectedGadget] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      navigate("/login");
    } else {
      setProfile((prev) => ({
        ...prev,
        username: storedUsername,
        fullName: localStorage.getItem("fullName") || "",
        mobile: localStorage.getItem("mobile") || "",
        password: localStorage.getItem("password") || "",
      }));
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    window.dispatchEvent(new Event("start-loading"));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/favorite-gadget-only`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (res.ok) {
        setGadgets(result);
      } else {
        console.log(res.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      window.dispatchEvent(new Event("stop-loading"));
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("username", profile.username);
    localStorage.setItem("fullName", profile.fullName);
    localStorage.setItem("mobile", profile.mobile);
    localStorage.setItem("password", profile.password);

    window.dispatchEvent(new Event("authChange"));
    setIsEditing(false);
  };

  return (
    <div className="page-container">
      <div className="myself-layout container">
        {/* Profile Header */}
        <div className="myself-header">
          <div className="myself-avatar" aria-hidden="true">
            <span className="myself-avatar-letter">
              {profile.username ? profile.username.charAt(0).toUpperCase() : '?'}
            </span>
          </div>
          <div className="myself-header-info">
            <h1 className="myself-large-username">@{profile.username}</h1>
            {profile.fullName && (
              <p className="myself-fullname">{profile.fullName}</p>
            )}
            <div className="myself-stats">
              <div className="myself-stat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span>{gadgets.length} favorite{gadgets.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Favorites Section */}
        <div className="myself-content">
          <div className="glass-panel myself-panel">
            <div className="myself-section-header">
              <h2 className="myself-subtitle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                Favorite Gear
              </h2>
            </div>

            {gadgets.length === 0 ? (
              <div className="myself-empty-state">
                <div className="myself-empty-icon-wrapper" aria-hidden="true">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <h3 className="myself-empty-title">No favorites yet</h3>
                <p className="myself-empty-text">Mark gadgets as favorites to see them here.</p>
                <Link to="/about" className="glass-button myself-empty-cta">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                  Go to My Gear
                </Link>
              </div>
            ) : (
              <div className="gadgets-grid myself-fav-grid">
                {gadgets.map((gadget, index) => (
                  <div
                    key={gadget.gadget_id}
                    className="glass-panel myself-fav-card"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="myself-fav-card-header">
                      <div className="about-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                        <span className="about-badge-text">
                          {gadget.gadget_name} → {gadget.gadget_product_name || "Unknown Product"}
                        </span>
                      </div>
                    </div>
                    {gadget.gadget_description && (
                      <div className="myself-fav-card-actions">
                        <button 
                          className="about-card-more" 
                          onClick={() => setSelectedGadget(gadget)}
                        >
                          Read more
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gadget Details Modal */}
      {selectedGadget && (
        <div className="myself-modal-overlay" onClick={() => setSelectedGadget(null)}>
          <div className="glass-panel myself-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="myself-modal-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              <span className="myself-modal-badge-text">
                {selectedGadget.gadget_product_name || "Unknown Product"}
              </span>
            </div>
            <h3 className="myself-modal-title">
              {selectedGadget.gadget_name}
            </h3>
            <div className="myself-modal-body">
              {selectedGadget.gadget_description}
            </div>
            <div className="myself-modal-footer">
              <button 
                className="glass-button secondary myself-modal-close" 
                onClick={() => setSelectedGadget(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
