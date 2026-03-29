"use client"

import { useHeists, type HeistFilter } from "@/hooks/useHeists"
import type { Heist } from "@/types/firestore"
import styles from "./page.module.css"

function HeistSection({
  title,
  heists,
  isLoading,
  error,
  emptyMessage,
}: {
  title: string
  heists: Heist[]
  isLoading: boolean
  error: Error | null
  emptyMessage: string
}) {
  return (
    <div className={styles.section}>
      <h2>{title}</h2>
      {isLoading && <p className={styles.stateText}>Loading...</p>}
      {error && (
        <p className={styles.errorText} role="alert">
          Failed to load heists.
        </p>
      )}
      {!isLoading && !error && heists.length === 0 && (
        <p className={styles.stateText}>{emptyMessage}</p>
      )}
      {heists.length > 0 && (
        <ul className={styles.list}>
          {heists.map((heist) => (
            <li key={heist.id} className={styles.listItem}>
              {heist.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const sections: { filter: HeistFilter; title: string; emptyMessage: string }[] =
  [
    {
      filter: "active",
      title: "Your Active Heists",
      emptyMessage: "No active heists right now.",
    },
    {
      filter: "assigned",
      title: "Heists You're Assigned",
      emptyMessage: "You haven't been assigned any heists yet.",
    },
    {
      filter: "expired",
      title: "All Expired Heists",
      emptyMessage: "No expired heists yet.",
    },
  ]

export default function HeistsPage() {
  const active = useHeists("active")
  const assigned = useHeists("assigned")
  const expired = useHeists("expired")

  const results = { active, assigned, expired }

  return (
    <div className="page-content">
      {sections.map(({ filter, title, emptyMessage }) => (
        <HeistSection
          key={filter}
          title={title}
          heists={results[filter].heists}
          isLoading={results[filter].isLoading}
          error={results[filter].error}
          emptyMessage={emptyMessage}
        />
      ))}
    </div>
  )
}
