export default function Loading() {
  return (
    <div className="shell">
      <div className="skeleton-banner" />
      <div className="skeleton-head">
        <div className="skeleton-line skeleton-line-lg" />
        <div className="skeleton-line skeleton-line-sm" />
      </div>
      <div className="skeleton-list">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-line skeleton-line-title" />
            <div className="skeleton-line" />
            <div className="skeleton-line skeleton-line-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
