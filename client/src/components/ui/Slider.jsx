export default function Slider({ label, value, valueText, onChange, min, max, step, ...props }) {
  return (
    <label className="ui-slider">
      <span className="ui-slider-label"><span>{label}</span><span className="tabular-nums">{valueText ?? value}</span></span>
      <input aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} {...props} />
    </label>
  );
}
