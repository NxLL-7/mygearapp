import { Link, useLocation } from "react-router-dom";
import "./About.css";
import { useEffect, useState } from "react";

export default function About() {
  const location = useLocation();

  const [gadgets, setGadgets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetailGadget, setSelectedDetailGadget] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    window.dispatchEvent(new Event('start-loading'));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/get-gadgets`, {
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
      window.dispatchEvent(new Event('stop-loading'));
    }
  };

  return (
    <div className="page-container">
      <div className="container flex-col about-container">
        <div className="about-header">
          <div className="about-header-left">
            <h1 className="title about-title">My Gear</h1>
            <p className="about-header-count">
              {gadgets.length} {gadgets.length === 1 ? 'item' : 'items'} in collection
            </p>
          </div>
          {gadgets.length > 0 && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="glass-button about-manage-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Manage
            </button>
          )}
        </div>

        <div className="glass-panel about-panel">
          {gadgets.length === 0 ? (
            <div className="about-empty-state">
              <div className="about-empty-icon-wrapper" aria-hidden="true">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </div>
              <h3 className="about-empty-title">Your collection is empty</h3>
              <p className="about-empty-text">
                Start building your gear inventory by adding your first item.
              </p>
              <Link to="/add-gadget" className="glass-button about-empty-cta">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Your First Gadget
              </Link>
            </div>
          ) : (
            <div className="gadgets-grid about-grid">
              {gadgets.map((gadget, index) => {
                const isFav = gadget.favorite || gadget.is_favorite || gadget.isFavorite;
                return (
                  <div
                    key={gadget.gadget_id}
                    className={`glass-panel about-card ${isFav ? 'favorite-card' : ''}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="about-card-header">
                      <div className="about-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                        <span className="about-badge-text">
                          {gadget.gadget_name} → {gadget.gadget_product_name || "Unknown Product"}
                        </span>
                      </div>
                      {isFav && (
                        <div className="about-fav-indicator" title="Favorite" aria-label="Favorite gadget">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
                      )}
                    </div>
                    <p className="about-card-desc" title={gadget.gadget_description}>
                      {gadget.gadget_description}
                    </p>
                    {gadget.gadget_description && gadget.gadget_description.length > 80 && (
                      <button 
                        className="about-card-more" 
                        onClick={() => setSelectedDetailGadget(gadget)}
                      >
                        Read more
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Manage Modal */}
      {isModalOpen && (
        <div
          className="manage-modal-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="glass-panel manage-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="manage-modal-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-primary)' }}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              <h2 className="manage-modal-title">Manage Gear</h2>
            </div>
            <div className="manage-modal-actions">
              <Link to="/add-gadget" className="manage-action-btn manage-action-add">
                <div className="manage-action-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </div>
                <div className="manage-action-text">
                  <span className="manage-action-label">Add Gadget</span>
                  <span className="manage-action-desc">Add new items to your collection</span>
                </div>
              </Link>
              <Link to="/favorite-gadget" className="manage-action-btn manage-action-fav">
                <div className="manage-action-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <div className="manage-action-text">
                  <span className="manage-action-label">Favorite Gadgets</span>
                  <span className="manage-action-desc">Mark items as your favorites</span>
                </div>
              </Link>
              <Link to="/delete-gadget" className="manage-action-btn manage-action-delete">
                <div className="manage-action-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </div>
                <div className="manage-action-text">
                  <span className="manage-action-label">Delete Gadgets</span>
                  <span className="manage-action-desc">Remove items from your collection</span>
                </div>
              </Link>
            </div>
            <button
              className="glass-button secondary manage-modal-close"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedDetailGadget && (
        <div
          className="manage-modal-overlay"
          onClick={() => setSelectedDetailGadget(null)}
        >
          <div
            className="glass-panel detail-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="detail-modal-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              <span>{selectedDetailGadget.gadget_product_name || "Unknown Product"}</span>
            </div>
            
            <h2 className="detail-modal-title">
              {selectedDetailGadget.gadget_name}
            </h2>
            
            <p className="detail-modal-desc">
              {selectedDetailGadget.gadget_description}
            </p>
            
            <button
              className="glass-button secondary manage-modal-close"
              onClick={() => setSelectedDetailGadget(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
