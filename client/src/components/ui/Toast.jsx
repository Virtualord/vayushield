export default function Toast({ label, tone = 'info', children }) {
  return <div role="status" aria-label={label} className={`ui-toast ui-toast-${tone}`}>{children}</div>;
}
