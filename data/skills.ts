import { CursorIcon, ZustandIcon } from "@/components/icons/FocusBrandIcons";
import type { IconType } from "react-icons";
import { DiIllustrator, DiPhotoshop } from "react-icons/di";
import {
  SiDiscord,
  SiExpo,
  SiFigma,
  SiGithub,
  SiGreensock,
  SiMui,
  SiNestjs,
  SiNextdotjs,
  SiNotion,
  SiRadixui,
  SiReact,
  SiReactquery,
  SiShadcnui,
  SiSlack,
  SiStorybook,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVite,
} from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";

export type SkillLevel = "expert" | "proficient" | "familiar" | "learning";

export type Skill = {
  id: string;
  name: string;
  color: string;
  level: SkillLevel;
  description: string;
  Icon: IconType;
};

export type SkillCategory = {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
  skills: Skill[];
};

export const skillLevelMeta: Record<
  SkillLevel,
  { label: string; percent: number }
> = {
  expert: { label: "숙련", percent: 92 },
  proficient: { label: "실무 활용", percent: 78 },
  familiar: { label: "경험 있음", percent: 58 },
  learning: { label: "학습 중", percent: 34 },
};

export const skillsIntro =
  "카테고리별로 정리한 기술 스택입니다. 항목을 선택하면 해당 기술을 어떤 목적으로 사용했는지 확인할 수 있습니다.";

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    title: "Frontend",
    subtitle: "웹·앱 UI와 인터랙션",
    accent: "#61dafb",
    skills: [
      {
        id: "react",
        name: "React",
        color: "#61DAFB",
        level: "expert",
        description:
          "문자 발송 플랫폼과 스마트오더·키오스크·POS 화면을 React로 개발했습니다. Feature 기반 폴더 구조와 공통 컴포넌트를 구성하고 UI와 비즈니스 로직을 분리했습니다.",
        Icon: SiReact,
      },
      {
        id: "typescript",
        name: "TypeScript",
        color: "#3178C6",
        level: "expert",
        description:
          "React·React Native 프로젝트에서 API 응답, 컴포넌트 props와 상태에 타입을 정의했습니다. swagger-typescript-api를 활용해 API 타입을 자동 생성하는 개발 환경을 구성했습니다.",
        Icon: SiTypescript,
      },
      {
        id: "nextjs",
        name: "Next.js",
        color: "#ffffff",
        level: "proficient",
        description:
          "서버와 클라이언트 역할을 분리해 성능을 개선하기 위해 App Router와 Server/Client 컴포넌트 경계를 구분했습니다. 포트폴리오와 블로그·대시보드 프로젝트에 적용했습니다.",
        Icon: SiNextdotjs,
      },
      {
        id: "react-native",
        name: "React Native",
        color: "#61DAFB",
        level: "proficient",
        description:
          "기존 WebView 앱의 주요 화면을 React Native로 전환했습니다. Safe Area·키보드 대응, 공통 UI, WebSocket 채팅, FCM 알림과 카메라·파일·디바이스 권한 처리를 구현했습니다.",
        Icon: TbBrandReactNative,
      },
      {
        id: "vite",
        name: "Vite",
        color: "#646CFF",
        level: "proficient",
        description:
          "문자 발송 플랫폼의 CRA 개발 환경을 Vite로 마이그레이션했습니다. 스마트오더·키오스크·POS 프로젝트에서도 Vite를 사용했습니다.",
        Icon: SiVite,
      },
      {
        id: "tanstack-query",
        name: "TanStack Query",
        color: "#FF4154",
        level: "proficient",
        description:
          "주소록과 주문 데이터의 서버 상태를 관리했습니다. Infinite Query의 maxPages로 캐시 페이지 수를 제한하고 Optimistic Update로 주소록 수정·주문 상태 변경을 처리했습니다.",
        Icon: SiReactquery,
      },
      {
        id: "zustand",
        name: "Zustand",
        color: "#8B5CF6",
        level: "proficient",
        description:
          "문자 발송 플랫폼의 상태 관리를 Recoil에서 Zustand로 전환했습니다. 스마트오더·키오스크·POS에서도 클라이언트 상태를 관리했습니다.",
        Icon: ZustandIcon,
      },
      {
        id: "tailwind",
        name: "Tailwind CSS",
        color: "#38BDF8",
        level: "proficient",
        description:
          "문자 발송 플랫폼과 스마트오더·키오스크·POS의 UI를 구현했습니다. PC·태블릿·모바일 반응형 레이아웃과 공통 컴포넌트 스타일을 구성했습니다.",
        Icon: SiTailwindcss,
      },
      {
        id: "shadcn",
        name: "Shadcn/ui",
        color: "#fafafa",
        level: "proficient",
        description:
          "스마트오더·키오스크·POS에서 Button, Dialog, Table, Tabs, Toast 등 공통 UI를 구현했습니다. 기기별 사용 환경에 맞춰 화면을 구성했습니다.",
        Icon: SiShadcnui,
      },
      {
        id: "mui",
        name: "MUI",
        color: "#007FFF",
        level: "familiar",
        description:
          "문자 발송·주소록·채팅·대시보드·사용자 관리 화면을 MUI와 디자인 시안에 맞춰 구현했습니다. 반응형 기능을 활용해 복합 화면의 레이아웃을 구성했습니다.",
        Icon: SiMui,
      },
      {
        id: "storybook",
        name: "Storybook",
        color: "#FF4785",
        level: "proficient",
        description:
          "공통 컴포넌트를 Storybook으로 문서화하고 UI 재사용 구조를 관리했습니다. 디자이너·기획자·백엔드 개발자와 화면 요구사항과 API 명세를 협의했습니다.",
        Icon: SiStorybook,
      },
      {
        id: "gsap",
        name: "GSAP",
        color: "#88CE02",
        level: "proficient",
        description:
          "스크롤 경험을 개선하기 위해 ScrollTrigger로 섹션 등장 애니메이션을 구현했습니다. 이 포트폴리오에도 적용했습니다.",
        Icon: SiGreensock,
      },
      {
        id: "expo",
        name: "Expo",
        color: "#ffffff",
        level: "familiar",
        description:
          "크로스 플랫폼 앱 개발 역량을 키우기 위해 Expo Router로 탭·인증 화면을 구성했습니다. iOS·Android 빌드와 배포를 익히기 위해 노력 중입니다!",
        Icon: SiExpo,
      },
      {
        id: "radix",
        name: "Radix UI",
        color: "#8B5CF6",
        level: "proficient",
        description:
          "접근성을 확보한 UI를 만들기 위해 모달, 드롭다운, 툴팁에 Radix UI를 기반으로 구현했습니다. shadcn/ui와 함께 사용하고 있습니다.",
        Icon: SiRadixui,
      },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    subtitle: "서버·API 역량 확장",
    accent: "#e0234e",
    skills: [
      {
        id: "nestjs",
        name: "NestJS",
        color: "#E0234E",
        level: "learning",
        description:
          "프론트엔드에서 나눈 도메인 설계를 서버까지 확장하기 위해 NestJS를 학습하고 있습니다. 모듈·DI 기반 백엔드 구조를 익히기 위해 노력 중입니다!",
        Icon: SiNestjs,
      },
    ],
  },
  {
    id: "database",
    title: "Database",
    subtitle: "데이터·인증",
    accent: "#3ecf8e",
    skills: [
      {
        id: "supabase",
        name: "Supabase",
        color: "#3ECF8E",
        level: "proficient",
        description:
          "인증과 데이터 관리를 한곳에서 처리하기 위해 Supabase Auth, Postgres, Storage를 연동했습니다. 블로그와 포트폴리오에 마이그레이션과 서버·클라이언트 분리를 적용했습니다.",
        Icon: SiSupabase,
      },
    ],
  },
  {
    id: "design",
    title: "Design",
    subtitle: "UI 설계·이미지 작업",
    accent: "#f24e1e",
    skills: [
      {
        id: "figma",
        name: "Figma",
        color: "#F24E1E",
        level: "proficient",
        description:
          "스마트오더·키오스크·POS·관리자 시스템의 전체 UI 구조를 Figma로 설계했습니다. 기기별 사용 환경에 맞는 디자인 시안을 만들고 퍼블리싱에 반영했습니다.",
        Icon: SiFigma,
      },
      {
        id: "photoshop",
        name: "Photoshop",
        color: "#31A8FF",
        level: "familiar",
        description:
          "웹 에셋 품질을 맞추기 위해 배너·썸네일 보정과 이미지 전처리를 직접 수행했습니다.",
        Icon: DiPhotoshop,
      },
      {
        id: "illustrator",
        name: "Illustrator",
        color: "#FF9A00",
        level: "familiar",
        description:
          "웹에 필요한 벡터 에셋을 직접 제작하기 위해 아이콘·일러스트를 만들고 SVG로 export했습니다.",
        Icon: DiIllustrator,
      },
    ],
  },
  {
    id: "collaboration",
    title: "Collaboration",
    subtitle: "협업·문서",
    accent: "#a78bfa",
    skills: [
      {
        id: "notion",
        name: "Notion",
        color: "#ffffff",
        level: "proficient",
        description:
          "팀이 같은 맥락을 공유하기 위해 기획 문서, 스프린트, 회고를 Notion에 정리했습니다.",
        Icon: SiNotion,
      },
      {
        id: "github",
        name: "GitHub",
        color: "#ffffff",
        level: "proficient",
        description:
          "변경 이력을 명확히 관리하기 위해 브랜치 전략, PR 리뷰, Conventional Commits를 적용했습니다. 개인·회사 프로젝트 모두 GitHub로 운영했습니다.",
        Icon: SiGithub,
      },
      {
        id: "cursor",
        name: "Cursor",
        color: "#ffffff",
        level: "proficient",
        description:
          "Cursor Rules로 프로젝트의 코딩 규칙을 정리하고 Figma MCP를 활용해 디자인 정보를 개발 과정에 반영했습니다.",
        Icon: CursorIcon,
      },
      {
        id: "slack",
        name: "Slack",
        color: "#4A154B",
        level: "familiar",
        description:
          "이슈 공유와 피드백 속도를 높이기 위해 Slack 스레드 기반으로 팀 커뮤니케이션을 이어갔습니다.",
        Icon: SiSlack,
      },
      {
        id: "discord",
        name: "Discord",
        color: "#5865F2",
        level: "familiar",
        description:
          "스터디와 사이드 프로젝트 협업을 위해 Discord로 화면 공유와 논의를 진행했습니다.",
        Icon: SiDiscord,
      },
    ],
  },
];
