import { sections } from "@/data/sections";

export const contact = {
  email: "kimkijun0226@gmail.com",
  github: "https://github.com/kimkijun0226",
  githubHandle: "kimkijun0226",
  greeting: "똑똑, 함께 일할 사람을 찾고 계신가요?",
  inquiry:
    "좋은 팀과 재미있는 프로젝트를 만나는 것을 기대하고 있습니다. 협업이나 합류 제안이 있으시다면 언제든 편하게 연락 주세요. 하루 이내 바로 답변드립니다!",
  coffeeChat:
    "새로운 기술을 배우고 프로젝트에 적용하는 과정에서 큰 즐거움을 느낍니다. 맡은 일은 끝까지 책임지고, 팀과 함께 더 좋은 결과를 만드는 것을 중요하게 생각합니다. 레거시와 새로운 기술 사이에서 정답을 고집하기보다, 현재 팀과 서비스에 가장 적합한 선택을 고민합니다. 작은 문제라도 그냥 지나치지 않고 직접 해결해 보며 서비스를 개선하는 개발자가 되고자 합니다. 꾸준히 성장하며 함께 일하고 싶은 프론트엔드 개발자 김기준입니다.",
  closing: "편하게 연락주시면 감사하겠습니다",
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
