export default function Toggle({ label, checked, onChange, disabled = false }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} disabled={disabled} onClick={() => onChange(!checked)} className="ui-toggle">
      <span aria-hidden="true" />
    </button>
  );
}
