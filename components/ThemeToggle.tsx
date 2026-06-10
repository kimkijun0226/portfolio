import { HiMoon, HiSun } from "react-icons/hi2";
import { HoverTooltip } from "@/components/HoverTooltip";

type ThemeToggleProps = {
  darkMode: boolean;
  onToggle: () => void;
};

export function ThemeToggle({ darkMode, onToggle }: ThemeToggleProps) {
  return (
    <HoverTooltip label={darkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}>
      <button
        type="button"
        className="flex size-9 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-fg/80 transition-colors hover:text-fg"
        onClick={onToggle}
        aria-label={darkMode ? "라이트 모드로 변경" : "다크 모드로 변경"}
      >
        {darkMode ? <HiMoon size={22} /> : <HiSun size={22} />}
      </button>
    </HoverTooltip>
  );
}
