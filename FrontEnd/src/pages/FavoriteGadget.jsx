import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FavoriteGadget.css";
import "../Toast.css";

export default function FavoriteGadget() {
  const [gadgets, setGadgets] = useState([]);
  const [selectedGadgets, setSelectedGadgets] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    window.dispatchEvent(new Event("start-loading"));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/g-gadgets", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (res.ok) {
        setGadgets(result);
        const initialSelected = result.map((g) => ({
          gadget_id: g.gadget_id,
          favorite: Boolean(g.is_fav || g.favorite || g.is_favorite),
        }));
        setSelectedGadgets(initialSelected);
      } else {
        console.log(res.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      window.dispatchEvent(new Event("stop-loading"));
    }
  };

  const toggleSelect = (gadgetId) => {
    setSelectedGadgets((prev) =>
      prev.map((item) =>
        item.gadget_id === gadgetId
          ? { ...item, favorite: !item.favorite }
          : item,
      ),
    );
  };

  const handleFavorite = async () => {
    setShowConfirm(false);
    window.dispatchEvent(new Event("start-loading"));

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/g-favorite-u", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          selectedGadgets,
        }),
      });
      const result = await res.json();

      if (res.ok) {
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
          navigate("/about");
        }, 1500);
        console.log(selectedGadgets);
      } else {
        console.log(result.message);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      window.dispatchEvent(new Event("stop-loading"));
    }
  };

  const selectedCount = selectedGadgets.filter((g) => g.favorite).length;

  return (
    <div className="page-container">
      {showNotification && (
        <div className="toast-notification">
          <span className="toast-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </span>
          <span className="toast-text">Favorites updated successfully!</span>
        </div>
      )}
      <div className="container flex-col fav-container">
        <div className="fav-header">
          <div className="fav-header-left">
            <h1 className="title fav-title">Favorite Gear</h1>
            <p className="fav-header-desc">Toggle the star to mark items as favorites</p>
          </div>
          <Link to="/about" className="glass-button secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            Back
          </Link>
        </div>

        <div className="glass-panel fav-panel">
          {gadgets.length === 0 ? (
            <div className="fav-empty-state">
              <div className="fav-empty-icon-wrapper" aria-hidden="true">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <h3 className="fav-empty-title">No gadgets found</h3>
              <p className="fav-empty-text">
                Add some gear to your collection first.
              </p>
            </div>
          ) : (
            <div className="gadgets-grid fav-grid">
              {gadgets.map((gadget, index) => {
                const gadgetId = gadget.gadget_id;
                const isSelected =
                  selectedGadgets.find((item) => item.gadget_id === gadgetId)
                    ?.favorite || false;

                return (
                  <div
                    key={gadgetId}
                    className={`glass-panel fav-card ${isSelected ? "selected" : ""}`}
                    onClick={() => toggleSelect(gadgetId)}
                    style={{ animationDelay: `${index * 50}ms` }}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSelect(gadgetId); }}}
                  >
                    <div className="fav-card-header">
                      <div className="fav-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                        <span className="fav-badge-text">
                          {gadget.gadget_product_name || "Unknown Product"}
                        </span>
                      </div>
                      <div className={`star-checkbox ${isSelected ? "checked" : ""}`} aria-hidden="true">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={isSelected ? "#F59E0B" : "none"} stroke={isSelected ? "#F59E0B" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      </div>
                    </div>
                    {gadget.gadget_name && (
                      <h3 className="about-product-name">{gadget.gadget_name}</h3>
                    )}
                    {gadget.gadget_description && (
                      <p className="fav-card-desc">
                        {gadget.gadget_description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {gadgets.length > 0 && (
            <div className="fav-footer">
              <span className="fav-selected-count">
                {selectedCount} favorite{selectedCount !== 1 ? 's' : ''} selected
              </span>
              <button
                className="glass-button fav-submit-button"
                onClick={() => setShowConfirm(true)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                Save Favorites ({selectedCount})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div
          className="confirm-modal-overlay"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="glass-panel confirm-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-modal-icon fav-confirm-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <h2 className="confirm-modal-title">
              Update Favorites?
            </h2>
            <p className="confirm-modal-text">
              {selectedCount} {selectedCount === 1 ? 'item' : 'items'} will be marked as your favorites.
            </p>
            <div className="confirm-modal-actions">
              <button
                className="glass-button secondary"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="glass-button fav-submit-button"
                onClick={handleFavorite}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
