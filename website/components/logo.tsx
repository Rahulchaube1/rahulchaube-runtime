export function Logo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="32" height="32" rx="8" fill="#161B22" stroke="#30363D" strokeWidth="1" />
      <path
        d="M16 6L25 11.25V21.75L16 27L7 21.75V11.25L16 6Z"
        stroke="#3B82F6"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M16 6V16.5M16 16.5L25 11.25M16 16.5L7 11.25"
        stroke="#60A5FA"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16.5" r="2.5" fill="#3B82F6" />
    </svg>
  );
}
