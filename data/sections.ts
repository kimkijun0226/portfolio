export type Section = {
  id: string;
  label: string;
  color: string;
};

export const sections: Section[] = [
  { id: "about", label: "About", color: "#38bdf8" },
  { id: "experience", label: "Experience", color: "#a78bfa" },
  { id: "projects", label: "Projects", color: "#34d399" },
  { id: "education", label: "Education", color: "#fbbf24" },
  { id: "skills", label: "Skills", color: "#fb7185" },
  { id: "contact", label: "Contact", color: "#60a5fa" },
];

export const sectionIds = sections.map((section) => section.id);
