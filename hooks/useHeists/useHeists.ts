import { useEffect, useState } from "react"
import { collection, query, where, onSnapshot, or } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useUser } from "@/contexts/AuthContext"
import { COLLECTIONS, heistConverter, type Heist } from "@/types/firestore"

export type HeistFilter = "active" | "assigned" | "expired"

interface UseHeistsResult {
  heists: Heist[]
  isLoading: boolean
  error: Error | null
}

export function useHeists(filter: HeistFilter): UseHeistsResult {
  const { user } = useUser()
  const [heists, setHeists] = useState<Heist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      return
    }

    const col = collection(db, COLLECTIONS.HEISTS).withConverter(heistConverter)

    let q
    if (filter === "active") {
      q = query(col, where("createdBy", "==", user.uid))
    } else if (filter === "assigned") {
      q = query(col, where("assignedTo", "==", user.uid))
    } else {
      q = query(col, or(where("createdBy", "==", user.uid), where("assignedTo", "==", user.uid)))
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const now = new Date()
        let results = snapshot.docs.map((doc) => doc.data())

        if (filter === "active" || filter === "assigned") {
          results = results.filter((heist) => heist.deadline > now)
        } else {
          results = results
            .filter((heist) => heist.deadline < now)
            .sort((a, b) => b.deadline.getTime() - a.deadline.getTime())
        }

        setHeists(results)
        setIsLoading(false)
        setError(null)
      },
      (err) => {
        setError(err)
        setIsLoading(false)
      },
    )

    return unsubscribe
  }, [filter, user])

  if (!user) {
    return { heists: [], isLoading: false, error: null }
  }

  return { heists, isLoading, error }
}
