import Link from "next/link"
import { CircleCheck, CircleX, Calendar, UserRound } from "lucide-react"
import type { Heist } from "@/types/firestore"
import { formatDate } from "@/lib/format"
import styles from "./ExpiredHeistCard.module.css"

export default function ExpiredHeistCard({ heist }: { heist: Heist }) {
  const isSuccess = heist.finalStatus === "success"
  const StatusIcon = isSuccess ? CircleCheck : CircleX
  const cardClass = isSuccess ? styles.cardSuccess : styles.cardFailed
  const badgeClass = isSuccess ? styles.badgeSuccess : styles.badgeFailed
  const statusIconClass = isSuccess ? styles.successIcon : styles.failedIcon

  return (
    <article className={cardClass}>
      <div className={styles.topRow}>
        <StatusIcon size={16} className={statusIconClass} aria-hidden="true" />
        <Link href={`/heists/${heist.id}`} className={styles.title}>
          {heist.title}
        </Link>
        <Calendar size={12} className={styles.icon} aria-hidden="true" />
        <span className={styles.label}>{formatDate(heist.deadline)}</span>
        <span className={badgeClass}>{isSuccess ? "SUCCESS" : "FAILED"}</span>
      </div>

      <div className={styles.bottomRow}>
        <UserRound size={12} className={styles.icon} aria-hidden="true" />
        <span className={styles.label}>To:</span>
        <span className={styles.primaryValue}>
          {heist.assignedToCodename || "Unassigned"}
        </span>
        <UserRound size={12} className={styles.icon} aria-hidden="true" />
        <span className={styles.label}>By:</span>
        <span className={styles.secondaryValue}>
          {heist.createdByCodename || "Unknown"}
        </span>
      </div>
    </article>
  )
}
