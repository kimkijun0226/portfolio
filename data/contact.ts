import { sections } from "@/data/sections";

export const contact = {
  email: "kimkijun0226@gmail.com",
  github: "https://github.com/kimkijun0226",
  githubHandle: "kimkijun0226",
  greeting: "똑똑, 함께 일할 사람을 찾고 계신가요?",
  inquiry:
    "합류 또는 프로젝트 제안 문의가 있으시다면 언제든 환영합니다. 메일을 보내주시면 보통 이틀 안에 답변드립니다.",
  coffeeChat:
    "가벼운 개발 이야기 커피챗이나 피드백도 좋아요. \"요즘 어떤 스택에 관심 있으세요?\" 같은 가벼운 질문 한 통 환영합니다 🙂",
  mailCta: "메일 보내기",
  githubCta: "GitHub 보러가기",
  footer: {
    name: "김기준",
    role: "Frontend Developer",
    bio: "컴포넌트 설계와 성능 최적화로 UX와 DX를 함께 개선하는 프론트엔드 개발자입니다. 새로운 기술과 협업 속에서 빠르게 성장하는 편입니다.",
  },
  connect: [
    {
      id: "github",
      label: "GitHub",
      href: "https://github.com/kimkijun0226",
    },
    {
      id: "email",
      label: "Email",
      href: "mailto:kimkijun0226@gmail.com",
    },
  ],
  quickLinks: sections.map((section) => ({
    id: section.id,
    label: section.label,
    href: `#${section.id}`,
  })),
};
