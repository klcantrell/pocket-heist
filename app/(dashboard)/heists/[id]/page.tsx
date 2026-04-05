"use client"

import { use } from "react"
import Link from "next/link"
import { ArrowLeft, UserRound, Clock, Calendar, FileText } from "lucide-react"
import { useHeist } from "@/hooks/useHeist"
import { useTimeRemaining } from "@/hooks/useTimeRemaining"
import { formatDate } from "@/lib/format"
import Badge from "@/components/Badge"
import { Skeleton } from "@/components/Skeleton"
import styles from "./page.module.css"

function TimeRemaining({ deadline }: { deadline: Date }) {
  const { label, isExpired } = useTimeRemaining(deadline)

  return (
    <span className={isExpired ? styles.countdownExpired : styles.countdownValue}>
      {label}
    </span>
  )
}

function formatDeadline(date: Date): string {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function HeistDetailsContent({ id }: { id: string }) {
  const { heist, isLoading, error } = useHeist(id)

  if (isLoading) {
    return (
      <div className={styles.details}>
        <Skeleton width="40%" height="28px" />
        <div className={styles.card}>
          <Skeleton width="100%" height="14px" />
          <Skeleton width="80%" height="14px" />
        </div>
        <div className={styles.card}>
          <Skeleton width="60%" height="14px" />
          <Skeleton width="60%" height="14px" />
          <Skeleton width="60%" height="14px" />
        </div>
      </div>
    )
  }

  if (error) {
    return <p className={styles.errorText}>Failed to load heist: {error.message}</p>
  }

  if (!heist) {
    return <p className={styles.stateText}>Heist not found.</p>
  }

  const isExpired = heist.deadline < new Date()

  return (
    <>
      <div className={styles.header}>
        <h2 className={styles.title}>{heist.title}</h2>
        {heist.finalStatus && (
          <Badge variant={heist.finalStatus === "success" ? "success" : "danger"}>
            {heist.finalStatus === "success" ? "Success" : "Failed"}
          </Badge>
        )}
        {!heist.finalStatus && isExpired && (
          <Badge variant="danger">Overdue</Badge>
        )}
      </div>

      <div className={styles.details}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Time Remaining</h3>
          <div className={styles.countdown}>
            <Clock size={20} className={styles.countdownIcon} />
            <TimeRemaining deadline={heist.deadline} />
          </div>
          <p className={styles.deadlineText}>
            Deadline: {formatDeadline(heist.deadline)}
          </p>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Details</h3>
          <p className={styles.description}>
            {heist.description || "No description provided."}
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Assigned To</span>
              <span className={styles.infoValue}>
                <UserRound size={12} className={styles.infoIcon} />
                <span className={styles.primaryValue}>
                  {heist.assignedToCodename || "Unknown"}
                </span>
              </span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Created By</span>
              <span className={styles.infoValue}>
                <UserRound size={12} className={styles.infoIcon} />
                <span className={styles.secondaryValue}>
                  {heist.createdByCodename || "Unknown"}
                </span>
              </span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Created On</span>
              <span className={styles.infoValue}>
                <Calendar size={12} className={styles.infoIcon} />
                {formatDate(heist.createdAt)}
              </span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Status</span>
              <span className={styles.infoValue}>
                <FileText size={12} className={styles.infoIcon} />
                {heist.finalStatus
                  ? heist.finalStatus === "success" ? "Completed" : "Failed"
                  : isExpired ? "Overdue" : "In Progress"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function HeistDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  return (
    <div className="page-content">
      <Link href="/heists" className={styles.backLink}>
        <ArrowLeft size={16} />
        Back to heists
      </Link>
      <HeistDetailsContent id={id} />
    </div>
  )
}
