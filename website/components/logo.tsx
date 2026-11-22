export function Logo({
  className = "h-10 w-auto",
}: {
  className?: string;
  showWordmark?: boolean;
  useFullBanner?: boolean;
}) {
  return (
    <img
      src="/rahulchaube-runtimelogo.png"
      alt="RC Runtime Logo"
      className={`object-contain select-none ${className}`}
    />
  );
}
