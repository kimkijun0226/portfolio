import {
  CursorIcon,
  ZustandIcon,
} from "@/components/icons/FocusBrandIcons";
import type { IconType } from "react-icons";
import {
  SiNextdotjs,
  SiReact,
  SiReactquery,
  SiStorybook,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVite,
} from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";

export type FocusItem = {
  name: string;
  Icon: IconType;
};

export const focusItems: FocusItem[] = [
  { name: "React", Icon: SiReact },
  { name: "TypeScript", Icon: SiTypescript },
  { name: "Next.js", Icon: SiNextdotjs },
  { name: "React Native", Icon: TbBrandReactNative },
  { name: "TanStack Query", Icon: SiReactquery },
  { name: "Zustand", Icon: ZustandIcon },
  { name: "Vite", Icon: SiVite },
  { name: "Tailwind CSS", Icon: SiTailwindcss },
  { name: "Storybook", Icon: SiStorybook },
  { name: "Supabase", Icon: SiSupabase },
  { name: "Cursor", Icon: CursorIcon },
];
