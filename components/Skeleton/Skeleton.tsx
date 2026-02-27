import styles from "./Skeleton.module.css"

interface SkeletonProps {
  variant?: "line" | "circle"
  width?: string
  height?: string
}

export function Skeleton({ variant = "line", width, height }: SkeletonProps) {
  const style = { width, height }

  return (
    <div
      className={`${styles.skeleton} ${styles[variant]}`}
      style={style}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Skeleton variant="circle" width="64px" height="64px" />
        <div className={styles.headerLines}>
          <Skeleton width="60%" height="14px" />
          <Skeleton width="40%" height="14px" />
        </div>
      </div>
      <div className={styles.body}>
        <Skeleton width="100%" height="14px" />
        <Skeleton width="100%" height="14px" />
        <Skeleton width="65%" height="14px" />
      </div>
    </div>
  )
}
