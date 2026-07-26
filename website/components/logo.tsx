export function Logo({
  className = "h-9 w-auto",
}: {
  className?: string;
  showWordmark?: boolean;
  useFullBanner?: boolean;
}) {
  return (
    <img
      src="/rahulchaube-runtime.png"
      alt="RahulChaube Runtime"
      className={`object-contain select-none ${className}`}
    />
  );
}
