export default function SectionHeader({ eyebrow, title, description, action, className = '' }) {
  return (
    <header className={`section-header ${className}`}>
      <div className="section-header-copy">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {description && <p className="section-header-description">{description}</p>}
      </div>
      {action && <div className="section-header-action">{action}</div>}
    </header>
  );
}
