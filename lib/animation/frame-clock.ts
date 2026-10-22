export function createFrameClock() {
  const interval = 1000 / 60;
  let nextFrame = 0;
  let lastFrame: number | null = null;

  return (timestamp: number, hidden = false): number | null => {
    if (hidden) {
      lastFrame = null;
      nextFrame = 0;
      return null;
    }
    if (timestamp + 0.1 < nextFrame) return null;

    const delta = lastFrame === null
      ? 1 / 60
      : Math.min(0.05, Math.max(0, (timestamp - lastFrame) / 1000));
    nextFrame = lastFrame === null
      ? timestamp + interval
      : nextFrame + (Math.floor(Math.max(0, timestamp - nextFrame) / interval) + 1) * interval;
    lastFrame = timestamp;
    return delta;
  };
}
