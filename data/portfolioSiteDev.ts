export type ProjectDevSection = {
  title: string;
  problem: string;
  solution: string;
  codePath: string;
  codeRole: string;
};

/** Portfolio(이 사이트) 초기 로딩 성능 개선 — Projects 카드 '개발 정리' 섹션 */
export const portfolioSiteDevSections: ProjectDevSection[] = [
  {
    title: "1. 매 방문마다 Supabase를 기다리던 서버 렌더링",
    problem:
      "app/page.tsx에 export const dynamic = \"force-dynamic\"이 있어 페이지가 캐시되지 않았습니다. 방문할 때마다 getPortfolioProjects()가 Supabase topic 테이블을 조회하고, 그 응답이 올 때까지 HTML 전송이 지연되었습니다. next build 결과도 ƒ(Dynamic)으로 표시되어 정적 배포 이점을 쓰지 못했습니다.",
    solution:
      "force-dynamic을 제거하고 export const revalidate = 60(ISR)을 적용했습니다. Supabase 조회는 unstable_cache로 60초간 서버 메모리에 캐시해 반복 요청 시 DB 왕복을 줄였습니다. 빌드 결과가 ○(Static, 1분 revalidate)로 바뀌어 첫 HTML이 CDN 캐시에서 바로 내려옵니다.",
    codePath: "app/page.tsx, lib/projects/getPortfolioProjects.ts",
    codeRole:
      "page.tsx — Next.js에게 이 페이지를 60초마다 재검증하는 정적 페이지로 취급하라고 알려주는 진입점입니다. getPortfolioProjects.ts — Supabase에서 portfolio 카테고리 글을 가져오는 fetch 함수이며, unstable_cache로 감싸 동일 데이터를 60초간 재사용합니다.",
  },
  {
    title: "2. Three.js가 첫 화면 JS 번들을 막던 문제",
    problem:
      "HomePage에서 ThreeBackground를 정적으로 import했고, ThreeBackground.tsx 상단에 import * as THREE from \"three\"가 있었습니다. three 패키지는 약 600KB 규모로, Hero가 보이기 전에 메인 번들 다운로드·파싱·WebGL 초기화까지 한꺼번에 실행되었습니다. 배경은 장식인데 첫 진입 체감 속도를 가장 많이 잡아먹는 구조였습니다.",
    solution:
      "ThreeBackgroundLazy.tsx에서 next/dynamic(..., { ssr: false })로 Three.js 청크를 분리하고, requestIdleCallback으로 브라우저가 한가할 때만 마운트합니다. ThreeBackground 내부에서는 useEffect 안에서 await import(\"three\")로 라이브러리를 추가 분리해, Hero 텍스트·헤더가 먼저 그려진 뒤 배경이 로드됩니다.",
    codePath:
      "components/home/HomePage.tsx, components/effects/ThreeBackgroundLazy.tsx, components/effects/ThreeBackground.tsx",
    codeRole:
      "HomePage.tsx — ThreeBackgroundLazy만 렌더해 배경을 지연 로딩합니다. ThreeBackgroundLazy.tsx — dynamic import + idle 시점 제어 래퍼입니다. ThreeBackground.tsx — 실제 WebGL 파티클·리본 셰이더를 그리며, three는 effect 내부에서만 동적 import합니다.",
  },
  {
    title: "3. GSAP이 메인 청크에 묶여 있던 문제",
    problem:
      "hooks/useGsapScrollReveal.ts가 파일 최상단에서 import { gsap } from \"@/lib/gsap\"로 GSAP·ScrollTrigger를 불러왔습니다. Hero 진입 애니메이션에 필요하지만, 스크롤 섹션 reveal 로직 전체가 초기 클라이언트 번들에 포함되어 첫 JS 실행 시간이 늘어났습니다.",
    solution:
      "useLayoutEffect 안에서 void import(\"@/lib/gsap\")로 비동기 로드하도록 바꿨습니다. Hero의 data-reveal-immediate 요소는 CSS로 먼저 숨긴 뒤, GSAP 청크가 도착하면 fromTo로 등장시킵니다. 메인 번들에서는 GSAP 코드가 분리됩니다.",
    codePath: "hooks/useGsapScrollReveal.ts, app/globals.css",
    codeRole:
      "useGsapScrollReveal.ts — 스크롤 루트 안 [data-reveal] 요소에 GSAP ScrollTrigger 애니메이션을 붙이는 훅입니다. globals.css — prefers-reduced-motion이 아닐 때 reveal 대상을 opacity:0으로 숨겨, GSAP 로드 전 텍스트가 잠깐 보이는 FOUC를 막습니다.",
  },
  {
    title: "4. Skills 섹션 아이콘이 첫 로딩에 포함되던 문제",
    problem:
      "SkillsSection은 화면 아래쪽에 있지만 HomePage에서 정적 import되어 있었습니다. data/skills.ts가 react-icons(SiReact, SiTypescript 등) 수십 개를 한꺼번에 import하므로, 사용자가 Skills까지 스크롤하지 않아도 아이콘 번들이 첫 방문에 함께 내려왔습니다.",
    solution:
      "HomePage에서 const SkillsSection = dynamic(() => import(...), { ssr: false })로 분리했습니다. Hero·Experience·Projects가 먼저 인터랙션 가능해지고, Skills 청크는 클라이언트에서 필요할 때 로드됩니다.",
    codePath: "components/home/HomePage.tsx, components/sections/SkillsSection.tsx, data/skills.ts",
    codeRole:
      "HomePage.tsx — dynamic()으로 SkillsSection 코드 스플릿을 선언합니다. SkillsSection.tsx — 카테고리 카드·모달 UI를 렌더하는 섹션 컴포넌트입니다. skills.ts — 스킬 목록·설명·아이콘 메타데이터를 담은 정적 데이터 파일입니다.",
  },
  {
    title: "5. 부가 최적화 (preconnect · 폰트 swap)",
    problem:
      "Supabase origin에 대한 TCP/TLS 핸드셰이크가 fetch 시점에야 시작되었고, 웹폰트가 로드될 때까지 텍스트 렌더가 지연될 수 있었습니다.",
    solution:
      "app/layout.tsx에 Supabase URL preconnect를 추가하고, Space Grotesk에 display: \"swap\"을 적용해 시스템 폰트로 먼저 보여 준 뒤 웹폰트로 교체합니다.",
    codePath: "app/layout.tsx",
    codeRole:
      "layout.tsx — 전역 HTML 뼈대, 폰트, preconnect, AppToaster를 설정하는 Next.js 루트 레이아웃입니다.",
  },
];

export const portfolioSiteDevSummary =
  "첫 진입이 느렸던 핵심 원인은 (1) force-dynamic으로 매 요청 Supabase 대기, (2) Three.js·GSAP·Skills 아이콘이 Hero와 함께 메인 번들에 실려 내려온 것이었습니다. ISR·unstable_cache로 HTML을 정적으로 제공하고, 무거운 라이브러리는 코드 스플릿·idle 지연 로딩으로 분리해 체감 로딩을 개선했습니다.";
