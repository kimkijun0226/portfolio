import styles from "./Logo.module.css";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <a
      href="/"
      aria-label="김기준 포트폴리오 홈"
      className={`group/logo ${styles.link} relative inline-flex shrink-0 cursor-pointer items-center ${className ?? ""}`}
    >
      <span className={styles.scene}>
        <span className={styles.cube}>
          <span className={`${styles.face} ${styles.faceFront}`}>
            <span className={styles.letter}>K</span>
          </span>
          <span className={`${styles.face} ${styles.faceBack}`} aria-hidden />
          <span className={`${styles.face} ${styles.faceTop}`} aria-hidden />
          <span className={`${styles.face} ${styles.faceBottom}`} aria-hidden />
          <span className={`${styles.face} ${styles.faceLeft}`} aria-hidden />
          <span className={`${styles.face} ${styles.faceRight}`} aria-hidden />
        </span>
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute top-[calc(100%+8px)] left-1/2 z-[60] -translate-x-1/2 whitespace-nowrap rounded-md border border-line-soft bg-bg px-2.5 py-1.5 text-caption leading-none text-fg opacity-0 shadow-[0_4px_16px_rgba(0,0,0,0.35)] transition-opacity duration-150 group-hover/logo:opacity-100"
      >
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-b-line-soft"
          aria-hidden
        />
        <span
          className="absolute bottom-full left-1/2 mb-px -translate-x-1/2 border-[4px] border-transparent border-b-bg"
          aria-hidden
        />
        홈으로 가기
      </span>
    </a>
  );
}
