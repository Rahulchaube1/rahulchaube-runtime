import Image from "next/image";

export function Logo({
  className = "w-9 h-9",
  showWordmark = false,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <div className="inline-flex items-center gap-3 select-none">
      <img
        src="/logo.png"
        alt="RahulChaube Runtime Logo"
        className={`${className} object-contain rounded-xl`}
      />

      {showWordmark && (
        <div className="flex flex-col text-left font-sans">
          <span className="text-base font-black tracking-tight text-zinc-900 dark:text-[#F0F6FC]">
            RahulChaube
          </span>
          <span className="text-[11px] font-bold tracking-wider text-zinc-500 dark:text-[#8B949E] uppercase">
            Runtime
          </span>
        </div>
      )}
    </div>
  );
}
