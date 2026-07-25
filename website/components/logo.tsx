export function Logo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="rc-gradient" x1="32" y1="6" x2="32" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A8F05B" />
          <stop offset="50%" stopColor="#6FCF63" />
          <stop offset="100%" stopColor="#2FA866" />
        </linearGradient>
      </defs>

      {/* Dark Outer Container */}
      <rect width="64" height="64" rx="14" fill="#071A16" stroke="#163830" strokeWidth="2" />

      {/* R + C Connected Monogram Geometry */}
      {/* Left Pillar (R) */}
      <rect x="12" y="12" width="10" height="40" rx="5" fill="url(#rc-gradient)" />

      {/* Upper Loop of R connecting to C */}
      <path
        d="M 22 12 H 38 C 44.627 12 50 17.373 50 24 C 50 30.627 44.627 36 38 36 H 22"
        fill="none"
        stroke="url(#rc-gradient)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Diagonal Negative-Space Execution Cut */}
      <path
        d="M 27 31 L 43 51"
        fill="none"
        stroke="url(#rc-gradient)"
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* Embedded Subtle Terminal Prompt inside C (visible on larger sizes) */}
      <path
        d="M 32 21 L 36 24 L 32 27"
        fill="none"
        stroke="#071A16"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <line
        x1="38" y1="27" x2="42" y2="27"
        stroke="#071A16"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}
