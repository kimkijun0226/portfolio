"use client";

import { useEffect, useState } from "react";

type TypingTextProps = {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  active?: boolean;
};

export function TypingText({
  text,
  className,
  speed = 42,
  delay = 1200,
  active = true,
}: TypingTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!active) {
      setDisplayed("");
      setIsComplete(false);
      return;
    }

    setDisplayed("");
    setIsComplete(false);

    let index = 0;
    let intervalId: number | null = null;

    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));

        if (index >= text.length) {
          if (intervalId) {
            window.clearInterval(intervalId);
          }
          setIsComplete(true);
        }
      }, speed);
    }, delay);

    return () => {
      window.clearTimeout(startId);
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [text, speed, delay, active]);

  return (
    <span className={`relative block ${className ?? ""}`}>
      <span className="invisible block select-none" aria-hidden>
        {text}
        <span className="ml-0.5 inline-block">|</span>
      </span>
      <span className="absolute top-0 left-0 block w-full">
        {displayed}
        <span
          className={`ml-0.5 inline-block text-muted ${
            isComplete
              ? "animate-none opacity-0"
              : "animate-[caret-blink_0.9s_step-end_infinite]"
          }`}
          aria-hidden
        >
          |
        </span>
      </span>
    </span>
  );
}
