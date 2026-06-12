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
    title: "대량 문자 발송 플랫폼 리뉴얼",
    category: "웹 개발",
    company: "스탠다드네트웍스",
    role: "Frontend Developer",
    period: "2024.02 — 2025.12",
    color: "#60a5fa",
    summary:
      "SMS·LMS·MMS 대량 발송 및 실시간 양방향 소통 웹 서비스의 구조 재설계와 성능 고도화를 담당했습니다.",
    highlights: [
      "Feature 단위 폴더 구조와 SOLID 원칙 기반 컴포넌트 재설계로 100개 이상 컴포넌트 약 30% 감소",
      "CRA → Vite 마이그레이션으로 빌드 속도 약 30% 단축, 초기 로딩 1초 이내 개선",
      "TanStack Virtual 도입으로 10만 건 주소록 스크롤 렉 해소",
      "모바일 앱 내재화 착수 및 불필요 코드·외주 의존 구조 정리로 약 800MB 규모 코드베이스 경량화",
      "Cursor Rules·Figma MCP 기반 AI 개발 환경 구축으로 팀 컨벤션 일관성 확보",
    ],
    techStack: [
      "React",
      "TypeScript",
      "Vite",
      "MUI",
      "Zustand",
      "TanStack Query",
      "TanStack Virtual",
      "Storybook",
      "WebSocket",
      "FCM",
    ],
  },
  {
    id: "a015-mobile-app",
    title: "대량 문자 발송 플랫폼 앱",
    category: "앱 개발",
    company: "스탠다드네트웍스",
    role: "Frontend Developer",
    period: "2025.03 — 2025.12",
    color: "#a78bfa",
    summary:
      "대용량 문자 발송 서비스를 모바일에서도 누구나 쉽게 이용할 수 있도록 React Native 기반 앱을 설계·개발했습니다. 네이티브 화면과 WebView 하이브리드 구조를 병행하며, 초기 구현 이후 Feature 단위 구조 정비와 상태·UI 로직 리팩토링을 거쳐 주소록 관리부터 발송·결제·상태 확인까지 이어지는 사용자 여정을 모바일 환경에 맞게 재구성했습니다.",
    highlights: [
      "SMS·LMS·MMS 대량 발송을 모바일에서 완결할 수 있는 단계형 발송 플로우 설계 — 대상 선택, 메시지 작성, 발송·결과 확인까지 일관된 UX로 통합",
      "입력 검증과 단계별 가이드 UI로 발송 실수를 줄이고, 비전문 사용자도 안정적으로 서비스를 이용할 수 있도록 사용성 개선",
      "개인·그룹 주소록 관리 및 대량 발송용 연락처 필터·선택 기능 구현, 대규모 연락처 환경을 고려한 데이터 구조 최적화로 성능 안정성 확보",
      "WebSocket 기반 실시간 양방향 통신으로 채팅·발송 상태를 즉시 동기화하고, 프론트·백엔드 간 이벤트 스트림을 일관되게 처리",
      "WebView 기반 하이브리드 화면 구성으로 웹 서비스 자산을 앱 내에 통합, 네이티브·웹 경계에 맞춘 인증·결제(EasyPay) 연동 처리",
      "Android·iOS 스토어 배포 및 빌드·심사 이슈 대응, 크로스 플랫폼 환경에서 UI·기능 패리티 유지",
      "운영 단계에서 Zustand·TanStack Query 기반 상태·서버 데이터 레이어를 리팩토링하여 유지보수성과 기능 확장 대응력 강화",
    ],
    techStack: [
      "React Native",
      "TypeScript",
      "Zustand",
      "TanStack Query",
      "WebSocket",
      "WebView",
      "EasyPay",
    ],
  },
  {
    id: "smart-order-system",
    title: "스마트오더 · 키오스크 · POS 통합 시스템",
    category: "통합 웹 개발",
    company: "스탠다드네트웍스",
    role: "Frontend Developer",
    period: "2024.02 — 2025.12",
    color: "#34d399",
    summary:
      "카페 운영 인력 부족 문제를 해결하기 위한 통합 주문·결제·관리 시스템을 백엔드 개발자와 2인 체제로 기획부터 운영까지 구축했습니다.",
    highlights: [
      "오프라인·온라인 결제 로직 추상화 및 SSE 기반 실시간 주문 수신·관리자 화면 동기화",
      "Optimistic Update와 문자 알림 연동으로 주문 처리 시간 2~3분 → 30초 이내 단축",
      "일 평균 주문량 여름 평일 50건 → 90~100건, 주말 150건 이상으로 증가",
      "SEO 불필요·실시간 처리 중심 서비스 특성에 맞춰 React SPA 아키텍처 선정",
    ],
    techStack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Zustand",
      "TanStack Query",
      "SSE",
      "NicePay",
      "EasyPay",
    ],
  },
];
