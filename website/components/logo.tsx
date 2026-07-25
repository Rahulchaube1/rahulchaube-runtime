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

        {/* Left Vertical Pillar (R Stem) */}
        <rect x="10" y="10" width="12" height="44" rx="6" fill="url(#rc-vector-gradient)" />

        {/* Upper Modular Block (R Loop / Upper C) */}
        <path
          d="M 25 10 H 42 C 49.7 10 54 14.3 54 22 C 54 29.7 49.7 34 42 34 H 25"
          fill="none"
          stroke="url(#rc-vector-gradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Lower Modular Block (Lower C) */}
        <path
          d="M 25 34 H 42 C 49.7 34 54 38.3 54 46 C 54 53.7 49.7 54 42 54 H 25"
          fill="none"
          stroke="url(#rc-vector-gradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 45° Negative-Space Diagonal Cut */}
        <line x1="20" y1="36" x2="44" y2="28" stroke="#071A16" strokeWidth="4.5" strokeLinecap="round" />

        {/* Subtle Terminal Prompt inside C (> _) */}
        <path
          d="M 32 20 L 35 22.5 L 32 25"
          fill="none"
          stroke="#071A16"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="37" y1="25" x2="41" y2="25"
          stroke="#071A16"
          strokeWidth="2"
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
