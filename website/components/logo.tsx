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
          <linearGradient id="rc-vector-gradient" x1="32" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A8F05B" />
            <stop offset="50%" stopColor="#6FCF63" />
            <stop offset="100%" stopColor="#2FA866" />
          </linearGradient>
        </defs>

        {/* Outer Dark Container */}
        <rect width="64" height="64" rx="16" fill="#071A16" stroke="#163830" strokeWidth="2" />

        {/* R Stem (Left Vertical Pillar) */}
        <rect x="11" y="11" width="8" height="42" rx="4" fill="url(#rc-vector-gradient)" />

        {/* R Upper Loop */}
        <path
          d="M 19 11 H 34 C 41 11 45 15 45 21.5 C 45 28 41 32 34 32 H 19"
          fill="none"
          stroke="url(#rc-vector-gradient)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* R Leg (Diagonal) */}
        <path
          d="M 28 31 L 41 53"
          fill="none"
          stroke="url(#rc-vector-gradient)"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* C Outer Arc (embracing right and bottom) */}
        <path
          d="M 46 16 C 52 21 55 29 55 37 C 55 46.5 47.5 53 37 53 H 26"
          fill="none"
          stroke="url(#rc-vector-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* 45° Negative-Space Diagonal Cut */}
        <line x1="22" y1="36" x2="48" y2="28" stroke="#071A16" strokeWidth="3" strokeLinecap="round" />

        {/* Subtle Terminal Prompt inside R loop (> _) */}
        <path
          d="M 24 19 L 27 21.5 L 24 24"
          fill="none"
          stroke="#071A16"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="29" y1="24" x2="33" y2="24"
          stroke="#071A16"
          strokeWidth="1.8"
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
