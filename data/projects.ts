export type Project = {
  id: string;
  title: string;
  description: string;
  tag: string;
  image: string;
  imageAlt: string;
  liveUrl?: string;
  githubUrl?: string;
  chips: string[];
};

export const projectsIntro =
  "실서비스와 사이드 프로젝트로 쌓아 온 작업들입니다.";

export const projects: Project[] = [
  {
    id: "cafe-order",
    title: "카페 통합 주문 시스템",
    description:
      "키오스크·스마트오더·POS 관리자를 하나로 통합한 토스오더 유사 서비스. 백엔드 개발자와 2인 체제로 기획부터 운영까지 전담했습니다.",
    tag: "실서비스",
    image: "/images/projects/cafe-order.svg",
    imageAlt: "카페 통합 주문 시스템 화면",
    chips: [
      "React",
      "TypeScript",
      "SSE",
      "Shadcn/ui",
      "Zustand",
      "NicePay",
      "EasyPay",
    ],
  },
  {
    id: "a015-platform",
    title: "대량 문자 발송 플랫폼",
    description:
      "SMS·LMS·MMS 대량 발송 및 실시간 양방향 소통 웹 플랫폼. 10만 건 주소록 가상화와 서비스 전반 리뉴얼을 진행했습니다.",
    tag: "실서비스",
    image: "/images/projects/a015-platform.svg",
    imageAlt: "대량 문자 발송 플랫폼 화면",
    chips: [
      "React",
      "Vite",
      "TanStack Virtual",
      "WebSocket",
      "FCM",
      "React Native",
    ],
  },
  {
    id: "blog-community",
    title: "개인 블로그 · 커뮤니티 웹앱",
    description:
      "Supabase 기반 서버리스 환경에서 댓글·좋아요·DM·실시간 알림 기능을 구현한 개인 프로젝트입니다.",
    tag: "사이드 프로젝트",
    image: "/images/projects/blog-community.svg",
    imageAlt: "개인 블로그 커뮤니티 웹앱 화면",
    githubUrl: "https://github.com",
    chips: [
      "React 19",
      "Supabase",
      "TanStack Query",
      "Zustand",
      "Cloudflare Pages",
    ],
  },
];
