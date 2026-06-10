import type { FocusItem } from "@/data/focus";
import { ds } from "@/lib/design-system";

type FocusChipProps = Pick<FocusItem, "name" | "Icon">;

export function FocusChip({ name, Icon }: FocusChipProps) {
  return (
    <span className={ds.chip}>
      <Icon className="size-3 shrink-0 opacity-90" aria-hidden />
      {name}
    </span>
  );
}
