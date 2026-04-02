import Link from "next/link"
import { Clock, UserRound, Calendar } from "lucide-react"
import type { Heist } from "@/types/firestore"
import styles from "./HeistCard.module.css"

function isOverdue(heist: Heist): boolean {
  return heist.deadline < new Date() && heist.finalStatus === null
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatDeadline(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export default function HeistCard({ heist }: { heist: Heist }) {
  const overdue = isOverdue(heist)

  return (
    <article className={styles.card}>
      <div className={styles.row}>
        <Link href={`/heists/${heist.id}`} className={styles.title}>
          {heist.title}
        </Link>
        {overdue && <span className={styles.overdue}>Overdue</span>}
      </div>

      <div className={styles.row}>
        <Clock size={16} className={styles.icon} />
        <span className={overdue ? styles.overdue : styles.label}>
          {formatDeadline(heist.deadline)}
        </span>
      </div>

      <div className={styles.row}>
        <UserRound size={12} className={styles.icon} />
        <span className={styles.label}>To</span>
        <span className={styles.primaryValue}>
          {heist.assignedToCodename || "Unknown"}
        </span>
      </div>

      <div className={styles.row}>
        <UserRound size={12} className={styles.icon} />
        <span className={styles.label}>By</span>
        <span className={styles.secondaryValue}>
          {heist.createdByCodename || "Unknown"}
        </span>
      </div>

      <div className={styles.row}>
        <Calendar size={12} className={styles.icon} />
        <span className={styles.label}>{formatDate(heist.createdAt)}</span>
      </div>
    </article>
  )
}
