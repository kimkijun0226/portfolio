export type Project = {
  id: string;
  topicId?: number;
  title: string;
  description: string;
  tag: string;
  image?: string;
  imageAlt?: string;
  liveUrl?: string;
  githubUrl?: string;
  chips: string[];
};

export const projectsIntro =
  "개인적으로 만들어 본 사이드 프로젝트들입니다.";

export const revieProject: Project = {
  id: "revie-shopping-mall",
  topicId: 124,
  title: "RÊVIE (레비) — 라이프스타일 쇼핑몰",
  description:
    "패션·뷰티·리빙 상품을 하나의 취향으로 연결하는 라이프스타일 쇼핑몰입니다. 상품 탐색·검색, 장바구니, 토스페이먼츠 결제, 구매 리뷰를 구현하고 관리자 화면에서 매출 분석과 주문·배송 상태를 관리합니다. Supabase Auth·RLS로 접근 권한을 제어하고, TanStack Query와 Zustand로 서버·클라이언트 상태를 분리했습니다.",
  tag: "사이드 프로젝트",
  liveUrl: "https://commerce-dashboard-pied.vercel.app/",
  githubUrl: "https://github.com/kimkijun0226/commerce-dashboard",
  chips: [
    "Next.js",
    "React 19",
    "TypeScript",
    "Supabase",
    "TanStack Query",
    "Zustand",
    "Tailwind CSS",
    "Storybook",
    "Toss Payments",
    "Chart.js",
  ],
};

export const fallbackProjects: Project[] = [
  {
    id: "my-page-project",
    title: "MyPage — 개인 블로그·커뮤니티",
    description:
      "Supabase 기반 서버리스 환경에서 토픽 작성·공유, 댓글·좋아요, 팔로우, DM, 실시간 알림을 구현한 개인 웹앱입니다. BlockNote 에디터와 React Hook Form·Zod 검증으로 글 작성 UX를 구성하고, TanStack Query와 Zustand로 서버·클라이언트 상태를 분리했습니다.",
    tag: "사이드 프로젝트",
    liveUrl: "https://my-page.cloud",
    githubUrl: "https://github.com/kimkijun0226/MyPageProject",
    chips: [
      "React 19",
      "TypeScript",
      "Vite",
      "Supabase",
      "TanStack Query",
      "Zustand",
      "BlockNote",
      "Tailwind CSS",
      "shadcn/ui",
    ],
  },
  revieProject,
  {
    id: "comunity-app",
    title: "커뮤니티 앱 (Expo)",
    description:
      "Expo Router 기반 크로스 플랫폼 커뮤니티 앱입니다. 로그인·회원가입 인증 플로우, 피드 목록, 마이페이지·설정 탭을 구성했고 TanStack Query로 서버 상태를 관리하며 axios 기반 API 레이어를 분리했습니다.",
    tag: "사이드 프로젝트",
    chips: [
      "Expo",
      "React Native",
      "TypeScript",
      "Expo Router",
      "TanStack Query",
      "React Navigation",
    ],
  },
  {
    id: "portfolio-website",
    title: "프론트엔드 포트폴리오 사이트",
    description:
      "프론트엔드 개발을 처음 배우며 만든 초기 포트폴리오입니다. HTML·CSS·JavaScript로 직접 퍼블리싱하고, GSAP·Locomotive Scroll 같은 라이브러리를 익히기 위해 스크롤 애니메이션과 가로 스크롤 섹션을 실험했습니다. 지금 보면 다소 투박하지만, 그때의 시도들이 이후 작업의 출발점이 되었습니다.",
    tag: "초기 작업",
    liveUrl: "https://applekimkijun.github.io/kijun-portfolio/",
    githubUrl: "https://github.com/kimkijun0226/portfolio-website",
    chips: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "GSAP",
      "Locomotive Scroll",
    ],
  },
  {
    id: "topic-128",
    topicId: 128,
    title: "Portfolio — Next.js 인터랙티브 포트폴리오",
    description:
      "Next.js 16 App Router 기반 단일 페이지 포트폴리오입니다. 커스텀 스크롤 루트와 GSAP ScrollTrigger로 섹션 스냅·가로 프로젝트 슬라이드를 구현했고, Three.js WebGL 파티클 배경과 Skills 카드 3D 틸트 인터랙션을 적용했습니다. Supabase topic 테이블과 연동해 블로그 portfolio 카테고리 글이 Projects 섹션에 자동 반영됩니다.",
    tag: "사이드 프로젝트",
    liveUrl: "https://kimkijun.com",
    githubUrl: "https://github.com/kimkijun0226/portfolio",
    chips: [
      "Next.js",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "GSAP",
      "Three.js",
      "Supabase",
    ],
  },
];
