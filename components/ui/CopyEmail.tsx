"use client";

import { toast } from "sonner";
import { HoverTooltip } from "@/components/ui/HoverTooltip";
import { contact } from "@/data/contact";

const EMAIL = contact.email;

type CopyEmailProps = {
  className?: string;
};

export function CopyEmail({ className }: CopyEmailProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      toast.success("이메일이 복사되었습니다");
    } catch {
      toast.error("복사에 실패했습니다");
    }
  };

  return (
    <HoverTooltip label="클릭하여 복사" className={className}>
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 cursor-pointer border-0 bg-transparent p-0 font-header text-header-email font-normal tracking-wide whitespace-nowrap text-muted transition-opacity hover:text-fg hover:opacity-90"
      >
        {EMAIL}
      </button>
    </HoverTooltip>
  );
}
