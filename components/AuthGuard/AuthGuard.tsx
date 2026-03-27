"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/AuthContext"
import styles from "./AuthGuard.module.css"

type AuthGuardProps = {
  children: React.ReactNode
  mode: "requireAuth" | "requireGuest"
}

export default function AuthGuard({ children, mode }: AuthGuardProps) {
  const { user, isLoading } = useUser()
  const router = useRouter()

  const shouldRedirect =
    (!isLoading && mode === "requireAuth" && !user) ||
    (!isLoading && mode === "requireGuest" && user)

  useEffect(() => {
    if (mode === "requireAuth" && !isLoading && !user) {
      router.push("/login")
    }
    if (mode === "requireGuest" && !isLoading && user) {
      router.push("/heists")
    }
  }, [mode, user, isLoading, router])

  if (isLoading || shouldRedirect) {
    return (
      <div className={styles.loader}>
        <p>Loading…</p>
      </div>
    )
  }

  return <>{children}</>
}
