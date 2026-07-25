export function Logo({
  className = "w-6 h-6",
  showWordmark = false,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <div className="inline-flex items-center gap-3 select-none">
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="rc-vector-gradient" x1="32" y1="6" x2="32" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A8F05B" />
            <stop offset="50%" stopColor="#6FCF63" />
            <stop offset="100%" stopColor="#2FA866" />
          </linearGradient>
        </defs>

        {/* Outer Dark Container */}
        <rect width="64" height="64" rx="14" fill="#071A16" stroke="#163830" strokeWidth="2" />

        {/* Left Vertical Pillar (R) */}
        <rect x="12" y="12" width="9" height="40" rx="4.5" fill="url(#rc-vector-gradient)" />

        {/* Upper Loop of R */}
        <path
          d="M 21 12 H 34 C 40 12 44 16.5 44 22 C 44 27.5 40 32 34 32 H 21"
          fill="none"
          stroke="url(#rc-vector-gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 45° Diagonal Negative-Space Cut */}
        <path
          d="M 27 30 L 41 52"
          fill="none"
          stroke="url(#rc-vector-gradient)"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Large C Arc */}
        <path
          d="M 51 18 C 45 12 36 12 30 12 C 20 12 12 20 12 32 C 12 44 20 52 30 52 C 36 52 45 52 51 46"
          fill="none"
          stroke="url(#rc-vector-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Subtle Terminal Prompt inside C (> _) */}
        <path
          d="M 33 21 L 36 23.5 L 33 26"
          fill="none"
          stroke="#071A16"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="38" y1="26" x2="41" y2="26"
          stroke="#071A16"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {showWordmark && (
        <div className="flex flex-col text-left font-mono">
          <span className="text-sm font-medium tracking-tight text-zinc-900 dark:text-[#F0F6FC]">
            RahulChaube
          </span>
          <span className="text-[10px] font-normal tracking-wider text-zinc-500 dark:text-[#8B949E] uppercase">
            Runtime
          </span>
        </div>
      )}
    </div>
  );
}
