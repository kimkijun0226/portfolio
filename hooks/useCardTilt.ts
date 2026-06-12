"use client";

import { useCallback, useRef, useState } from "react";

const MAX_TILT = 16;
const TILT_GAIN = 2.8;
const HOVER_LIFT_Z = 24;

type TiltState = {
  rotateX: number;
  rotateY: number;
  translateZ: number;
  glareX: number;
  glareY: number;
  active: boolean;
};

const RESTING_STATE: TiltState = {
  rotateX: 0,
  rotateY: 0,
  translateZ: 0,
  glareX: 50,
  glareY: 50,
  active: false,
};

export function useCardTilt() {
  const cardRef = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState<TiltState>(RESTING_STATE);

  const updateTilt = useCallback((clientX: number, clientY: number) => {
    const card = cardRef.current;

    if (!card) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const nx = (clientX - rect.left) / rect.width - 0.5;
    const ny = (clientY - rect.top) / rect.height - 0.5;

    setTilt({
      rotateX: -ny * MAX_TILT * TILT_GAIN,
      rotateY: -nx * MAX_TILT * TILT_GAIN,
      translateZ: HOVER_LIFT_Z,
      glareX: (nx + 0.5) * 100,
      glareY: (ny + 0.5) * 100,
      active: true,
    });
  }, []);

  const onMouseMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      updateTilt(event.clientX, event.clientY);
    },
    [updateTilt]
  );

  const onMouseLeave = useCallback(() => {
    setTilt(RESTING_STATE);
  }, []);

  const onTouchStart = useCallback(
    (event: React.TouchEvent<HTMLElement>) => {
      const touch = event.touches[0];

      if (!touch) {
        return;
      }

      updateTilt(touch.clientX, touch.clientY);
    },
    [updateTilt]
  );

  const onTouchMove = useCallback(
    (event: React.TouchEvent<HTMLElement>) => {
      const touch = event.touches[0];

      if (!touch) {
        return;
      }

      updateTilt(touch.clientX, touch.clientY);
    },
    [updateTilt]
  );

  const onTouchEnd = useCallback(() => {
    setTilt(RESTING_STATE);
  }, []);

  const transform = `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateZ(${tilt.translateZ}px)`;

  return {
    cardRef,
    onMouseMove,
    onMouseLeave,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    transform,
    glareX: tilt.glareX,
    glareY: tilt.glareY,
    isActive: tilt.active,
  };
}
