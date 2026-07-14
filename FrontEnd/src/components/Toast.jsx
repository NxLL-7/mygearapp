import "../Toast.css";

/**
 * Reusable toast notification component.
 * Eliminates ~40 lines of duplicated JSX per page.
 *
 * @param {"success" | "error"} type
 * @param {string} message
 * @param {boolean} visible
 */
export default function Toast({ type = "success", message, visible }) {
  if (!visible || !message) return null;

  return (
    <div className={`toast-notification ${type === "error" ? "error" : ""}`}>
      <span className="toast-icon">
        {type === "error" ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <span className="toast-text">{message}</span>
    </div>
  );
}
