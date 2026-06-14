"use client";

import styles from "./ScrollIndicator.module.css";

export function ScrollIndicator() {
  return (
    <div
      data-reveal-immediate
      data-reveal-delay="0.75"
      aria-hidden
      className={styles.root}
    >
      <span className={styles.text}>Scroll</span>
      <div className={styles.mouse}>
        <span className={styles.wheel} />
      </div>
    </div>
  );
}
