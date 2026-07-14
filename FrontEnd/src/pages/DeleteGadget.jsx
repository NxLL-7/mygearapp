import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./DeleteGadget.css";
import "../Toast.css";

export default function DeleteGadget() {
  const [gadgets, setGadgets] = useState([]);
  const [selectedGadgets, setSelectedGadgets] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

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

  const toggleSelect = (gadgetId) => {
    setSelectedGadgets((prev) => {
      if (prev.includes(gadgetId)) {
        return prev.filter((id) => id !== gadgetId);
      } else {
        return [...prev, gadgetId];
      }
    });
  };

  const handleDelete = async () => {

    if (selectedGadgets.length === 0) return;
    setShowConfirm(false);
    window.dispatchEvent(new Event('start-loading'));

    try {

      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/gadget-delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            selectedGadgets,
          }),
        }
      );

      const result = await res.json();
      if (res.ok) {
        console.log(result.message);
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
          navigate("/about");
        }, 1500);
      } else {
        console.log(result.message);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      window.dispatchEvent(new Event('stop-loading'));
    }
  };
  return (
    <div className="page-container">
      {showNotification && (
        <div className="toast-notification">
          <span className="toast-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
          <span className="toast-text">Items deleted successfully!</span>
        </div>
      )}
      <div className="container flex-col delete-container">
        <div className="delete-header">
          <div className="delete-header-left">
            <h1 className="title delete-title">Delete Gear</h1>
            <p className="delete-header-desc">Select items to remove from your collection</p>
          </div>
          <Link to="/about" className="glass-button secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            Back
          </Link>
        </div>

        <div className="glass-panel delete-panel">
          {gadgets.length === 0 ? (
            <div className="delete-empty-state">
              <div className="delete-empty-icon-wrapper" aria-hidden="true">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </div>
              <h3 className="delete-empty-title">Nothing to delete</h3>
              <p className="delete-empty-text">
                Your collection is empty. Add some gear first!
              </p>
            </div>
          ) : (
            <div className="gadgets-grid delete-grid">
              {gadgets.map((gadget, index) => {
                const gadgetId = gadget.gadget_id;
                const isSelected = selectedGadgets.includes(gadgetId);

                return (
                  <div
                    key={gadgetId}
                    className={`glass-panel delete-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleSelect(gadgetId)}
                    style={{ animationDelay: `${index * 50}ms` }}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSelect(gadgetId); }}}
                  >
                    <div className="delete-card-header">
                      <div className="delete-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                        <span className="delete-badge-text">
                          {gadget.gadget_product_name || "Unknown Product"}
                        </span>
                      </div>
                      <div className={`checkbox ${isSelected ? 'checked' : ''}`} aria-hidden="true">
                        {isSelected && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        )}
                      </div>
                    </div>
                    {gadget.gadget_name && (
                      <h3 className="about-product-name">{gadget.gadget_name}</h3>
                    )}
                    {gadget.gadget_description && (
                      <p className="delete-card-desc">
                        {gadget.gadget_description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {gadgets.length > 0 && (
            <div className="delete-footer">
              <span className="delete-selected-count">
                {selectedGadgets.length} selected
              </span>
              <button
                className={`glass-button danger-button ${selectedGadgets.length === 0 ? 'disabled' : ''}`}
                onClick={() => setShowConfirm(true)}
                disabled={selectedGadgets.length === 0}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Delete Selected ({selectedGadgets.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="confirm-modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="glass-panel confirm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-icon" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h2 className="confirm-modal-title">Delete {selectedGadgets.length} {selectedGadgets.length === 1 ? 'item' : 'items'}?</h2>
            <p className="confirm-modal-text">This action cannot be undone. These items will be permanently removed.</p>
            <div className="confirm-modal-actions">
              <button className="glass-button secondary" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button className="glass-button danger-button confirm-delete-btn" onClick={handleDelete}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
