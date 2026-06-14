type HoverTooltipProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

export function HoverTooltip({
  label,
  children,
  className,
}: HoverTooltipProps) {
  return (
    <div
      className={`group/tooltip relative inline-flex cursor-pointer ${className ?? ""}`}
    >
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute top-[calc(100%+8px)] left-1/2 z-[60] -translate-x-1/2 whitespace-nowrap rounded-md border border-line-soft bg-bg px-2.5 py-1.5 text-caption leading-none text-fg opacity-0 shadow-[0_4px_16px_rgba(0,0,0,0.35)] transition-opacity duration-150 group-hover/tooltip:opacity-100"
      >
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-b-line-soft"
          aria-hidden
        />
        <span
          className="absolute bottom-full left-1/2 mb-px -translate-x-1/2 border-[4px] border-transparent border-b-bg"
          aria-hidden
        />
        {label}
      </span>
    </div>
  );
}
