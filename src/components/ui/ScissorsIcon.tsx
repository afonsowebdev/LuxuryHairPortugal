export function ScissorsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="2.4" />
      <circle cx="6" cy="18" r="2.4" />
      <line x1="20" y1="4" x2="7.8" y2="14.4" />
      <line x1="7.8" y1="9.6" x2="20" y2="20" />
      <line x1="7.8" y1="9.6" x2="4" y2="12" />
    </svg>
  );
}
