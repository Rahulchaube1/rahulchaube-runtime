export function Logo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="v2-rc-gradient" x1="32" y1="6" x2="32" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A8F05B" />
          <stop offset="50%" stopColor="#6FCF63" />
          <stop offset="100%" stopColor="#2FA866" />
        </linearGradient>
      </defs>

      {/* Outer Rounded Container */}
      <rect width="64" height="64" rx="14" fill="#071A16" stroke="#163830" strokeWidth="2" />

      {/* R Stem */}
      <rect x="12" y="12" width="9" height="40" rx="4.5" fill="url(#v2-rc-gradient)" />

      {/* R Loop */}
      <path
        d="M 21 12 H 32 C 37.523 12 42 16.477 42 22 C 42 27.523 37.523 32 32 32 H 21"
        fill="none"
        stroke="url(#v2-rc-gradient)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* R Diagonal Leg (Execution Cut) */}
      <path
        d="M 27 30 L 40 52"
        fill="none"
        stroke="url(#v2-rc-gradient)"
        strokeWidth="9"
        strokeLinecap="round"
      />

      {/* C Arc */}
      <path
        d="M 52 20 C 47.5 13.5 39 12 33 12 C 22 12 14 21 14 32 C 14 43 22 52 33 52 C 39 52 47.5 50.5 52 44"
        fill="none"
        stroke="url(#v2-rc-gradient)"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.95"
      />
    </svg>
  );
}
