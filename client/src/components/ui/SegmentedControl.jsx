export default function SegmentedControl({ label, value, options, onChange, className = '' }) {
  return (
    <div className={`segmented-control ${className}`} role="group" aria-label={label}>
      {options.map(({ value: optionValue, label: optionLabel }) => (
        <button key={optionValue} type="button" aria-pressed={value === optionValue} onClick={() => onChange(optionValue)}>
          {optionLabel}
        </button>
      ))}
    </div>
  );
}
