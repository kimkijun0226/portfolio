import { zustandIconPath } from "@/components/icons/zustand-path";
import type { IconType } from "react-icons";

export const ZustandIcon: IconType = ({ className, ...props }) => (
  <svg
    viewBox="0 0 128 128"
    fill="currentColor"
    className={className}
    aria-hidden
    {...props}
  >
    <path d={zustandIconPath} />
  </svg>
);

const CURSOR_MAIN_PATH =
  "M680.944 244.828c5.112-3.381 11.892-.41 11.536 5.709l-14.605 264.65-14.969 263.809c-.656 29.379-25.476 48.962-46.315 21.639-44.91-58.881-111-159-145-180.5s-150.246-31.958-224-38.5c-20-1.774-27-33-7.753-45.474z";

const CURSOR_SHADOW_PATH =
  "M632.268 407.006c5.113-3.382 11.892.52 11.536 6.639l-25.833 444.694c-.401 6.896-9.163 9.573-13.35 4.079l-126.959-166.59a7.44 7.44 0 0 0-4.932-2.865l-207.193-27.736c-6.816-.912-8.854-9.79-3.118-13.584z";

export const CursorIcon: IconType = ({ className, ...props }) => (
  <svg
    viewBox="0 0 1024 1024"
    fill="currentColor"
    className={className}
    aria-hidden
    {...props}
  >
    <path d={CURSOR_SHADOW_PATH} opacity={0.35} />
    <path d={CURSOR_MAIN_PATH} />
  </svg>
);
