export type Section = {
  id: string;
  label: string;
  description: string;
  color: string;
};

export const sections: Section[] = [
  {
    id: "about",
    label: "About",
    description: "프로필과 관심 분야",
    color: "#38bdf8",
  },
  {
    id: "experience",
    label: "Experience",
    description: "기여 프로젝트와 성과",
    color: "#a78bfa",
  },
  {
    id: "projects",
    label: "Projects",
    description: "사이드 프로젝트",
    color: "#34d399",
  },
  {
    id: "skills",
    label: "Skills",
    description: "기술 스택과 협업 도구",
    color: "#fb7185",
  },
  {
    id: "contact",
    label: "Contact",
    description: "함께 일할 기회",
    color: "#60a5fa",
  },
];

export const sectionIds = sections.map((section) => section.id);
