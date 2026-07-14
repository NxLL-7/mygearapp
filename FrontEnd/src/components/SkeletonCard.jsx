import "./SkeletonCard.css";

/**
 * Skeleton loader card that matches the gadget card layout.
 * Shows a shimmer animation while data is loading.
 *
 * @param {number} count — number of skeleton cards to render (default: 6)
 */
export default function SkeletonCard({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton-card" aria-hidden="true">
          <div className="skeleton-badge skeleton-shimmer" />
          <div className="skeleton-line skeleton-line-full skeleton-shimmer" />
          <div className="skeleton-line skeleton-line-short skeleton-shimmer" />
        </div>
      ))}
    </>
  );
}
