const paths = {
  critical: <><path d="M12 3 22 20H2L12 3Z" /><path d="M12 9v5m0 3h.01" /></>,
  high: <path d="m12 3 9 17H3L12 3Z" />,
  moderate: <path d="m12 3 9 9-9 9-9-9 9-9Z" />,
  low: <path d="m5 12 4 4L19 6" />,
  sparkle: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" /></>,
  wind: <><path d="M3 8h12a3 3 0 1 0-3-3" /><path d="M2 12h17a3 3 0 1 1-3 3" /><path d="M4 16h6a2 2 0 1 1-2 2" /></>,
  traffic: <><path d="M5 16h14l-1.5-7h-11L5 16Z" /><path d="m8 9 1-3h6l1 3M7 16v2m10-2v2" /><circle cx="8" cy="13" r=".7" /><circle cx="16" cy="13" r=".7" /></>,
  industry: <><path d="M3 21V9l6 3V8l6 4V5h4v16H3Z" /><path d="M7 17h2m3 0h2m3 0h1" /></>,
  school: <><path d="m3 9 9-5 9 5-9 5-9-5Z" /><path d="M6 11v6c4 3 8 3 12 0v-6M21 9v7" /></>,
  hospital: <><path d="M4 21V5h16v16M2 21h20M12 8v8m-4-4h8" /></>,
  person: <><circle cx="12" cy="7" r="3" /><path d="M5 21c.5-5 2.8-7 7-7s6.5 2 7 7" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  moon: <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" />,
  copy: <><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h3" /></>,
  chevron: <path d="m9 18 6-6-6-6" />,
  grabber: <path d="M5 9h14M5 15h14" />,
};

export default function Icon({ name, size = 18, className = '', ...props }) {
  return <svg aria-hidden="true" data-icon={name} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>{paths[name] ?? paths.sparkle}</svg>;
}
