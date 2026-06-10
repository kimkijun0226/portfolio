export type BlogPost = {
  date: string;
  title: string;
  tag: string;
  slug: string;
};

export const blogPosts: BlogPost[] = [
  {
    date: "2025.10",
    title: "TanStack Virtual로 10만 건 렌더링 최적화하기",
    tag: "# 성능최적화",
    slug: "tanstack-virtual",
  },
  {
    date: "2025.11",
    title: "Cursor Rules로 팀 컨벤션 자동화한 이야기",
    tag: "# DX",
    slug: "cursor-rules",
  },
  {
    date: "2025.09",
    title: "offset vs cursor 페이지네이션, 언제 뭘 써야 할까",
    tag: "# 아키텍처",
    slug: "pagination",
  },
  {
    date: "2025.08",
    title: "SOLID 원칙으로 500줄 컴포넌트 해체하기",
    tag: "# 설계",
    slug: "solid-component",
  },
];
