export type ContributedProject = {
  id: string;
  title: string;
  category: string;
  company: string;
  role: string;
  period: string;
  color: string;
  summary: string;
  highlights: string[];
  techStack: string[];
};

export function formatPeriod(period: string) {
  const [start, end] = period.split(/\s*—\s*/);
  return end ? `${start} ~ ${end}` : start;
}

export const experienceIntro =
  "회사에서 기여한 프로젝트들입니다.";

export const contributedProjects: ContributedProject[] = [
  {
    id: "a015-platform",
    title: "대량 문자 발송 플랫폼 리뉴얼 및 고도화",
    category: "웹 개발",
    company: "스탠다드네트웍스",
    role: "UI 퍼블리싱 · 프론트엔드 개발",
    period: "2024.08 — 2025.12",
    color: "#60a5fa",
    summary:
      "기존 대량 문자 발송 서비스를 운영하며 화면 리디자인과 퍼블리싱, 신규 기능 개발, 공통 컴포넌트 설계와 프론트엔드 구조 정비를 담당했습니다.",
    highlights: [
      "문자 발송·주소록·실시간 채팅·대시보드·사용자 관리 화면을 리디자인하고 PC·태블릿·모바일 반응형 UI 구현",
      "복합 화면의 최소 너비와 스크롤 영역을 조정하고 Button·Input·Toast·이미지 업로드·채팅 UI를 공통 컴포넌트로 구성",
      "SMS·LMS·MMS 발송, 템플릿 관리, 이미지 Drag & Drop 업로드와 발송 결과 조회·재발송 기능 개발",
      "주소록·그룹 관리, 검색·필터, 엑셀 업로드·인라인 편집과 WebSocket 실시간 채팅·FCM 알림 구현",
      "Feature 기반 폴더 구조 재설계, Recoil에서 Zustand로 상태 관리 전환, CRA에서 Vite로 개발 환경 마이그레이션",
      "TanStack Virtual 주소록 가상화, Infinite Query 캐시 페이지 제한, 메모이제이션·검색 Debounce와 Optimistic Update 적용",
    ],
    techStack: [
      "React",
      "TypeScript",
      "Vite",
      "MUI",
      "styled-components",
      "Tailwind CSS",
      "Zustand",
      "TanStack Query",
      "TanStack Virtual",
      "WebSocket",
      "FCM",
    ],
  },
  {
    id: "a015-mobile-app",
    title: "React Native 앱 내재화",
    category: "앱 개발",
    company: "스탠다드네트웍스",
    role: "모바일 UI 구현 · React Native 개발",
    period: "2024.08 — 2025.12",
    color: "#a78bfa",
    summary:
      "기존 WebView 기반 앱에서 마이페이지를 제외한 주요 화면을 React Native로 전환했습니다. 모바일 UI와 공통 컴포넌트를 구현하고 웹·앱 프로젝트의 운영 구조를 정비했습니다.",
    highlights: [
      "로그인·문자 발송·주소록·실시간 채팅·알림 화면을 React Native로 구현하고 모바일 환경에 맞게 화면 구성",
      "Header·Button·Input·Toast·목록·이미지 업로드 UI를 공통 컴포넌트로 구성",
      "Android·iOS 화면 크기와 레이아웃에 대응하고 Safe Area 겹침·키보드 활성화 시 입력 영역 가림 문제 처리",
      "WebSocket 실시간 채팅과 FCM Push 알림·토큰 관리 기능 구현, 앱 생명주기에 따른 연결 관리",
      "카메라·QR 및 바코드 스캔·이미지 업로드·파일 다운로드·디바이스 권한 처리와 플랫폼별 이미지 저장 방식 대응",
      "웹·앱 프로젝트를 분리해 독립적으로 배포할 수 있는 운영 구조 구성",
    ],
    techStack: ["React Native", "TypeScript", "WebSocket", "FCM"],
  },
  {
    id: "smart-order-system",
    title: "스마트오더·키오스크·POS 시스템 구축",
    category: "통합 웹 개발",
    company: "스탠다드네트웍스",
    role: "UI/UX 디자인 · 웹 퍼블리싱 · 프론트엔드 개발",
    period: "2024.12 — 2025.12",
    color: "#34d399",
    summary:
      "스마트오더·키오스크·POS의 주문·결제와 매장 운영 관리 기능을 통합한 서비스를 구축했습니다. Figma 기반 UI/UX 디자인부터 기기별 퍼블리싱, 프론트엔드 기능 개발을 담당했습니다.",
    highlights: [
      "Figma로 스마트오더·키오스크·POS·관리자 UI 구조를 설계하고 모바일 상품 탐색·옵션 선택·결제 및 터치 환경에 맞는 화면 구현",
      "Button·Dialog·Table·Tabs·Toast·주문 카드·상품 옵션 선택 공통 UI와 PC·태블릿·모바일 반응형 레이아웃 구성",
      "결제 상태 안내, 로딩·중복 클릭 방지·입력 오류 피드백과 카운트형·선택형 상품 옵션 및 가격 계산 로직 구현",
      "주문 접수·상태 변경·직접 주문, 상품·옵션·재고·할인·운영 시간·직원 출퇴근 관리와 판매 현황 대시보드 개발",
      "스마트오더 EasyPay 모바일 결제 및 POS 카드·카카오페이·제로페이 결제 연동",
      "SSE 기반 실시간 주문 알림·관리자 화면 동기화와 React Query·Optimistic Update 기반 주문 상태 처리 구현",
    ],
    techStack: [
      "React",
      "TypeScript",
      "Vite",
      "Figma",
      "styled-components",
      "Tailwind CSS",
      "shadcn/ui",
      "Zustand",
      "TanStack Query",
      "SSE",
      "EasyPay",
    ],
  },
];
