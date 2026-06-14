"use client";

import { useEffect, useRef } from "react";

type SlideInTextProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function SlideInText({ children, className, delay = 0 }: SlideInTextProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    node.style.opacity = "0";
    node.style.transform = "translateX(-3rem)";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        node.style.transition = `opacity 0.75s ease-out ${delay}s, transform 0.75s cubic-bezier(0.33, 1, 0.68, 1) ${delay}s`;
        node.style.opacity = "1";
        node.style.transform = "translateX(0)";
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
