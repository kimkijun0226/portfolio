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
  "카테고리별로 묶은 기술 스택입니다. 항목을 누르면 역량과 사용 경험을 볼 수 있습니다.";

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
          "컴포넌트 설계·상태 분리·렌더 최적화를 중심으로 실서비스와 사이드 프로젝트에 꾸준히 사용합니다. Feature 단위 폴더 구조와 SOLID 원칙을 적용해 100개 이상 컴포넌트를 재구성한 경험이 있습니다.",
        Icon: SiReact,
      },
      {
        id: "typescript",
        name: "TypeScript",
        color: "#3178C6",
        level: "expert",
        description:
          "Props·API 응답·스토어 상태까지 타입을 먼저 정의하고 any 사용을 최소화합니다. Supabase 제네릭 타입과 폼 스키마(Zod) 연동으로 런타임 오류를 줄이는 데 익숙합니다.",
        Icon: SiTypescript,
      },
      {
        id: "nextjs",
        name: "Next.js",
        color: "#ffffff",
        level: "proficient",
        description:
          "App Router, Server/Client 컴포넌트 경계, Route Handler를 활용한 풀스택 프론트 구성 경험이 있습니다. 이 포트폴리오와 커머스 대시보드 프로젝트에서 사용 중입니다.",
        Icon: SiNextdotjs,
      },
      {
        id: "react-native",
        name: "React Native",
        color: "#61DAFB",
        level: "proficient",
        description:
          "대량 문자 발송 앱을 React Native로 개발·배포했습니다. WebView 하이브리드, 결제 연동, WebSocket 실시간 동기화, 스토어 심사 대응까지 담당했습니다.",
        Icon: TbBrandReactNative,
      },
      {
        id: "vite",
        name: "Vite",
        color: "#646CFF",
        level: "proficient",
        description:
          "CRA 레거시 프로젝트를 Vite로 마이그레이션해 빌드 속도를 약 30% 개선한 경험이 있습니다. 개인 블로그·커뮤니티 프로젝트의 기본 번들러로 사용합니다.",
        Icon: SiVite,
      },
      {
        id: "tanstack-query",
        name: "TanStack Query",
        color: "#FF4154",
        level: "proficient",
        description:
          "서버 상태 캐싱·무효화·낙관적 업데이트를 표준 패턴으로 사용합니다. query-key-factory로 키를 구조화하고 Devtools로 디버깅합니다.",
        Icon: SiReactquery,
      },
      {
        id: "zustand",
        name: "Zustand",
        color: "#8B5CF6",
        level: "proficient",
        description:
          "장바구니 persist, 세션 스냅샷, 검색 UI 상태 등 클라이언트 전용 상태를 가볍게 관리합니다. 보일러플레이트 없이 slice 단위로 분리하는 방식을 선호합니다.",
        Icon: ZustandIcon,
      },
      {
        id: "tailwind",
        name: "Tailwind CSS",
        color: "#38BDF8",
        level: "proficient",
        description:
          "디자인 토큰·반응형·다크 모드를 CSS 변수와 Tailwind v4 @theme로 통합합니다. shadcn/ui와 함께 컴포넌트 스타일링의 기본 도구입니다.",
        Icon: SiTailwindcss,
      },
      {
        id: "shadcn",
        name: "Shadcn/ui",
        color: "#fafafa",
        level: "proficient",
        description:
          "Radix 기반 접근성과 커스터마이징 자유도를 활용해 폼·모달·토스트 UI를 구성합니다. 프로젝트별 테마 토큰에 맞게 variants를 조정합니다.",
        Icon: SiShadcnui,
      },
      {
        id: "mui",
        name: "MUI",
        color: "#007FFF",
        level: "familiar",
        description:
          "엔터프라이즈 웹 서비스에서 DataGrid·DatePicker 등 복합 컴포넌트를 활용했습니다. 테마 오버라이드와 sx 스타일링으로 디자인 시스템과 맞춥니다.",
        Icon: SiMui,
      },
      {
        id: "storybook",
        name: "Storybook",
        color: "#FF4785",
        level: "proficient",
        description:
          "공통 UI를 스토리로 문서화하고 디자인·개발 간 핸드오프 비용을 줄입니다. 커머스 대시보드에서 컴포넌트 단위 개발·검증에 사용 중입니다.",
        Icon: SiStorybook,
      },
      {
        id: "gsap",
        name: "GSAP",
        color: "#88CE02",
        level: "proficient",
        description:
          "ScrollTrigger로 섹션 등장·스크롤 연동 애니메이션을 구현합니다. 이 포트폴리오와 초기 포트폴리오 사이트에서 스크롤 기반 인터랙션에 활용했습니다.",
        Icon: SiGreensock,
      },
      {
        id: "expo",
        name: "Expo",
        color: "#ffffff",
        level: "familiar",
        description:
          "Expo Router 기반 탭·인증 플로우를 구성한 경험이 있습니다. 크로스 플랫폼 빌드·배포 파이프라인을 익히는 중입니다.",
        Icon: SiExpo,
      },
      {
        id: "radix",
        name: "Radix UI",
        color: "#8B5CF6",
        level: "proficient",
        description:
          "접근성이 보장된 headless primitive를 기반으로 모달·드롭다운·툴팁을 조합합니다. shadcn/ui의 하위 레이어로 자주 사용합니다.",
        Icon: SiRadixui,
      },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    subtitle: "서버·API 설계 학습",
    accent: "#e0234e",
    skills: [
      {
        id: "nestjs",
        name: "NestJS",
        color: "#E0234E",
        level: "learning",
        description:
          "모듈·DI·데코레이터 기반 백엔드 구조를 학습 중입니다. 프론트엔드에서 다뤄 온 도메인 분리·타입 안전성을 서버 레이어까지 확장하는 것이 목표입니다.",
        Icon: SiNestjs,
      },
    ],
  },
  {
    id: "database",
    title: "Database",
    subtitle: "데이터·인증·실시간",
    accent: "#3ecf8e",
    skills: [
      {
        id: "supabase",
        name: "Supabase",
        color: "#3ECF8E",
        level: "proficient",
        description:
          "Auth, PostgreSQL, RLS, Storage, Realtime을 활용한 서버리스 앱을 구축했습니다. 마이그레이션·시드 스크립트 작성과 브라우저·서버 클라이언트 분리에 익숙합니다.",
        Icon: SiSupabase,
      },
    ],
  },
  {
    id: "design",
    title: "Design",
    subtitle: "UI 설계·시각 작업",
    accent: "#f24e1e",
    skills: [
      {
        id: "figma",
        name: "Figma",
        color: "#F24E1E",
        level: "proficient",
        description:
          "와이어프레임·컴포넌트 시스템·프로토타입을 제작하고 개발 핸드오프에 사용합니다. Talk to Figma MCP로 디자인 토큰·노드 스펙을 코드와 동기화합니다.",
        Icon: SiFigma,
      },
      {
        id: "photoshop",
        name: "Photoshop",
        color: "#31A8FF",
        level: "familiar",
        description:
          "이미지 보정·배너·썸네일 작업에 활용합니다. 웹 에셋 전처리와 간단한 합성을 직접 처리할 수 있습니다.",
        Icon: DiPhotoshop,
      },
      {
        id: "illustrator",
        name: "Illustrator",
        color: "#FF9A00",
        level: "familiar",
        description:
          "아이콘·일러스트·벡터 에셋 제작에 사용합니다. SVG export와 웹 최적화까지 이어서 작업합니다.",
        Icon: DiIllustrator,
      },
    ],
  },
  {
    id: "collaboration",
    title: "Collaboration",
    subtitle: "협업·문서·워크플로",
    accent: "#a78bfa",
    skills: [
      {
        id: "notion",
        name: "Notion",
        color: "#ffffff",
        level: "proficient",
        description:
          "기획 문서·스프린트 보드·회고·기술 스펙을 정리합니다. 팀과 공유 가능한 단일 소스로 프로젝트 맥락을 유지합니다.",
        Icon: SiNotion,
      },
      {
        id: "github",
        name: "GitHub",
        color: "#ffffff",
        level: "proficient",
        description:
          "브랜치 전략, PR 리뷰, Conventional Commits, 이슈 트래킹을 일상적으로 사용합니다. 개인·팀 프로젝트 모두 GitHub 중심으로 운영합니다.",
        Icon: SiGithub,
      },
      {
        id: "cursor",
        name: "Cursor",
        color: "#ffffff",
        level: "proficient",
        description:
          "Cursor Rules·에이전트 워크플로로 반복 작업을 자동화하고 팀 컨벤션을 유지합니다. Figma MCP와 함께 디자인-코드 동기화에 활용합니다.",
        Icon: CursorIcon,
      },
      {
        id: "slack",
        name: "Slack",
        color: "#4A154B",
        level: "familiar",
        description:
          "일상적인 팀 커뮤니케이션·알림·스레드 기반 논의에 사용합니다. 개발 이슈 공유와 빠른 피드백 루프에 익숙합니다.",
        Icon: SiSlack,
      },
      {
        id: "discord",
        name: "Discord",
        color: "#5865F2",
        level: "familiar",
        description:
          "스터디·사이드 프로젝트·커뮤니티 소통 채널로 활용합니다. 음성·화면 공유를 통한 페어 작업에도 사용합니다.",
        Icon: SiDiscord,
      },
    ],
  },
];
