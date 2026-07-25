export function Logo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="32" height="32" rx="7" className="fill-zinc-900 dark:fill-[#161B22] stroke-zinc-200 dark:stroke-[#30363D]" strokeWidth="1" />
      <path
        d="M16 6L25 11.25V21.75L16 27L7 21.75V11.25L16 6Z"
        className="stroke-blue-600 dark:stroke-blue-500"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M16 6V16.5M16 16.5L25 11.25M16 16.5L7 11.25"
        className="stroke-blue-500 dark:stroke-blue-400"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16.5" r="2" className="fill-blue-600 dark:fill-blue-400" />
    </svg>
  );
}
