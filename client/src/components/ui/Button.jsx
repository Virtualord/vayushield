const variants = { filled: 'ui-button-filled', tinted: 'ui-button-tinted', plain: 'ui-button-plain' };

export default function Button({ variant = 'plain', className = '', children, ...props }) {
  return <button className={`ui-button ${variants[variant] ?? variants.plain} ${className}`} {...props}>{children}</button>;
}
