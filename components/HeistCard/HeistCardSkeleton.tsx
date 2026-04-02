import { Skeleton } from "@/components/Skeleton"
import styles from "./HeistCard.module.css"

export default function HeistCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <Skeleton width="70%" height="16px" />
      <Skeleton width="50%" height="14px" />
      <Skeleton width="40%" height="14px" />
      <Skeleton width="40%" height="14px" />
      <Skeleton width="35%" height="14px" />
    </div>
  )
}
