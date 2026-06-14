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
          "유지보수하기 쉬운 화면 구조를 만들기 위해 Feature 단위 폴더 구조와 props·상태 범위 분리를 적용했습니다. 회사 프로젝트와 사이드 프로젝트에서 지속적으로 사용하고 있습니다.",
        Icon: SiReact,
      },
      {
        id: "typescript",
        name: "TypeScript",
        color: "#3178C6",
        level: "expert",
        description:
          "런타임 오류를 줄이기 위해 API 응답, props, store 상태에 타입을 먼저 정의했습니다. any 사용을 최소화하는 규칙을 프로젝트에 맞게 적용했습니다.",
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
          "모바일에서도 서비스를 완결하기 위해 React Native로 문자 발송 앱을 개발하고 스토어에 배포했습니다. WebView, 결제 연동, WebSocket 동기화, 심사 대응을 담당했습니다.",
        Icon: TbBrandReactNative,
      },
      {
        id: "vite",
        name: "Vite",
        color: "#646CFF",
        level: "proficient",
        description:
          "빌드 시간을 단축하기 위해 CRA 프로젝트를 Vite로 마이그레이션했습니다. 개인 프로젝트 번들러로도 계속 사용하고 있습니다.",
        Icon: SiVite,
      },
      {
        id: "tanstack-query",
        name: "TanStack Query",
        color: "#FF4154",
        level: "proficient",
        description:
          "서버 데이터를 안정적으로 관리하기 위해 캐시 갱신, 로딩·에러 처리, 낙관적 업데이트를 프로젝트 상황에 맞게 적용했습니다.",
        Icon: SiReactquery,
      },
      {
        id: "zustand",
        name: "Zustand",
        color: "#8B5CF6",
        level: "proficient",
        description:
          "불필요한 보일러플레이트를 줄이기 위해 장바구니, 검색 UI, 모달 상태 등 클라이언트 전용 상태를 Zustand로 관리했습니다.",
        Icon: ZustandIcon,
      },
      {
        id: "tailwind",
        name: "Tailwind CSS",
        color: "#38BDF8",
        level: "proficient",
        description:
          "프로젝트마다 스타일 기준을 맞추기 위해 Tailwind v4 @theme로 디자인 토큰과 반응형, 다크 모드를 통합했습니다.",
        Icon: SiTailwindcss,
      },
      {
        id: "shadcn",
        name: "Shadcn/ui",
        color: "#fafafa",
        level: "proficient",
        description:
          "공통 UI 개발 속도를 높이기 위해 폼, 모달, 토스트에 shadcn/ui를 도입하고 프로젝트별 theme variant를 조정했습니다.",
        Icon: SiShadcnui,
      },
      {
        id: "mui",
        name: "MUI",
        color: "#007FFF",
        level: "familiar",
        description:
          "복잡한 엔터프라이즈 UI를 빠르게 구성하기 위해 DataGrid, DatePicker 등 MUI 컴포넌트를 활용했습니다. 테마와 sx로 디자인 시스템에 맞게 스타일을 조정했습니다.",
        Icon: SiMui,
      },
      {
        id: "storybook",
        name: "Storybook",
        color: "#FF4785",
        level: "proficient",
        description:
          "컴포넌트 단위 협업을 원활하게 하기 위해 공통 UI를 Storybook으로 문서화했습니다. 대시보드 프로젝트에서 디자인 핸드오프에 사용하고 있습니다.",
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
          "디자인과 개발 간 간격을 줄이기 위해 와이어프레임과 컴포넌트 시스템을 Figma로 정리해 핸드오프했습니다. Figma MCP로 스펙 확인 흐름도 도입했습니다.",
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
          "팀 코딩 규칙을 일관되게 유지하기 위해 Cursor Rules를 정리하고 반복 작업 자동화에 활용했습니다. Figma MCP와 함께 디자인-코드 동기화에도 사용했습니다.",
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
