"use client"

import { useHeists, type HeistFilter } from "@/hooks/useHeists"
import { HeistCard, HeistCardSkeleton } from "@/components/HeistCard"
import type { Heist } from "@/types/firestore"
import styles from "./page.module.css"

function HeistSection({
  title,
  heists,
  isLoading,
  error,
  emptyMessage,
  variant,
}: {
  title: string
  heists: Heist[]
  isLoading: boolean
  error: Error | null
  emptyMessage: string
  variant: "card" | "list"
}) {
  return (
    <div className={styles.section}>
      <h2>{title}</h2>
      {error && (
        <p className={styles.errorText} role="alert">
          Failed to load heists.
        </p>
      )}
      {variant === "card" ? (
        <>
          {isLoading && (
            <div className={styles.grid}>
              <HeistCardSkeleton />
              <HeistCardSkeleton />
              <HeistCardSkeleton />
            </div>
          )}
          {!isLoading && !error && heists.length === 0 && (
            <p className={styles.stateText}>{emptyMessage}</p>
          )}
          {heists.length > 0 && (
            <div className={styles.grid}>
              {heists.map((heist) => (
                <HeistCard key={heist.id} heist={heist} />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {isLoading && <p className={styles.stateText}>Loading...</p>}
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
        </>
      )}
    </div>
  )
}

const sections: {
  filter: HeistFilter
  title: string
  emptyMessage: string
  variant: "card" | "list"
}[] = [
  {
    filter: "active",
    title: "Your Active Heists",
    emptyMessage: "No active heists right now.",
    variant: "card",
  },
  {
    filter: "assigned",
    title: "Heists You're Assigned",
    emptyMessage: "You haven't been assigned any heists yet.",
    variant: "card",
  },
  {
    filter: "expired",
    title: "All Expired Heists",
    emptyMessage: "No expired heists yet.",
    variant: "list",
  },
]

export default function HeistsPage() {
  const active = useHeists("active")
  const assigned = useHeists("assigned")
  const expired = useHeists("expired")

  const results = { active, assigned, expired }

  return (
    <div className="page-content">
      {sections.map(({ filter, title, emptyMessage, variant }) => (
        <HeistSection
          key={filter}
          title={title}
          heists={results[filter].heists}
          isLoading={results[filter].isLoading}
          error={results[filter].error}
          emptyMessage={emptyMessage}
          variant={variant}
        />
      ))}
    </div>
  )
}
