# portfolio

김기준 프론트엔드 개발자 포트폴리오 사이트입니다.  
단일 페이지 스크롤 구조로 About · Experience · Projects 등 섹션을 탐색하며, Three.js 배경과 GSAP 스크롤 애니메이션을 결합했습니다.

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router), React 19, TypeScript |
| 스타일 | Tailwind CSS v4, CSS Modules |
| 애니메이션 | GSAP + ScrollTrigger |
| 3D 배경 | Three.js (WebGL 파티클 + GLSL 리본 셰이더) |
| UI | react-icons, sonner |
| 패키지 매니저 | Yarn |

## 실행 방법

```bash
yarn install
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

```bash
yarn build   # 프로덕션 빌드
yarn start   # 프로덕션 서버
yarn lint    # ESLint
```

## 아키텍처 개요

```
app/
  layout.tsx          # 루트 레이아웃, 폰트, 메타데이터
  page.tsx            # 메인 페이지 — 섹션 조립 및 스크롤 훅 연결
  globals.css         # 디자인 토큰, 스크롤 스냅, 테마 변수

components/           # UI 컴포넌트 (섹션·헤더·카드 등)
data/                 # 정적 콘텐츠 (프로필, 경력, 프로젝트, 섹션 정의)
hooks/                # 스크롤·애니메이션 커스텀 훅
lib/                  # 디자인 시스템, GSAP, 스크롤 유틸
public/images/        # 프로필·프로젝트 이미지
```

## 스크롤 시스템

포트폴리오의 핵심 인터랙션은 **커스텀 스크롤 루트** 위에서 동작합니다.

### 세로 스크롤 + 섹션 스냅

- `main[data-scroll-root]`가 `h-dvh overflow-y-auto` 스크롤 컨테이너입니다.
- CSS `scroll-snap-type: y mandatory`와 `data-snap-section`으로 섹션 단위 스냅을 적용합니다.
- `scroll-padding-top`으로 고정 헤더 높이만큼 스냅 오프셋을 보정합니다.

### Projects 가로 스크롤

- `ProjectsSection`은 `sticky` 콘텐츠 + JS로 계산한 섹션 높이(`slideCount × viewportHeight`)로 세로 스크롤 거리를 만듭니다.
- `useProjectsHorizontalScroll`이 `translate3d`로 트랙을 이동시키며, 슬라이드별 스냅 마커 위치를 px 단위로 동기화합니다.

### Experience 타임라인 dot

- 타임라인 dot와 회사명·기간 라벨은 **각각 하나**만 존재하며, `--dot-y` CSS 변수로 세로 위치를 갱신합니다.
- `useExperienceTimelineDot`이 스크롤 프레임(`subscribeScrollFrame`)마다 활성 항목·색상·텍스트를 동기화합니다.

### GSAP 등장 애니메이션

- `useGsapScrollReveal`이 `data-reveal`, `data-reveal-immediate`, `data-reveal-stagger` 요소에 ScrollTrigger 기반 fade-up을 적용합니다.
- 스크롤 컨테이너를 `scroller`로 지정해 네이티브 스크롤과 연동합니다.

## 섹션 구성

| 섹션 | id | 설명 |
|------|----|------|
| About | `about` | 히어로 — 프로필, 타이핑 애니메이션, 관심 분야 칩 |
| Experience | `experience` | 경력 타임라인 — dot 추적, 카드형 기여 프로젝트 |
| Projects | `projects` | 가로 스크롤 프로젝트 카드 |
| Education / Skills / Contact | — | 플레이스홀더 (추후 구현 예정) |

## 배경 (Three.js)

`ThreeBackground`는 두 레이어로 구성됩니다.

1. **파티클 필드** — `THREE.Points`로 별처럼 보이는 점들이 카메라 주위를 회전
2. **리본 셰이더** — 커스텀 vertex/fragment shader로 물결 형태의 리본을 렌더링

`data-theme`(dark/light) 변경 시 색상을 MutationObserver로 동기화합니다.

## 디자인 시스템

`lib/design-system.ts`에 타이포·레이아웃 토큰을 모아 Tailwind 클래스 문자열로 재사용합니다.  
`app/globals.css`의 CSS 변수(`--bg`, `--fg`, `--muted` 등)로 다크/라이트 테마를 전환합니다.

## 데이터 수정

콘텐츠는 `data/` 폴더의 TypeScript 파일에서 관리합니다.

- `profile.ts` — 이름, 소개, 이메일
- `experience.ts` — 경력·기여 프로젝트
- `projects.ts` — 포트폴리오 프로젝트
- `sections.ts` — 네비게이션 섹션 정의
- `focus.ts`, `techStack.ts`, `blog.ts` — About 보조 데이터

## 라이선스

Private — 개인 포트폴리오 용도
