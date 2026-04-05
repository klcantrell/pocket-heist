import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { COLLECTIONS, heistConverter, type Heist } from "@/types/firestore"

interface Snapshot {
  heist: Heist | null
  id: string
  error: Error | null
}

interface UseHeistResult {
  heist: Heist | null
  isLoading: boolean
  error: Error | null
}

export function useHeist(id: string): UseHeistResult {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null)

  useEffect(() => {
    const ref = doc(db, COLLECTIONS.HEISTS, id).withConverter(heistConverter)

    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        setSnapshot({
          heist: snap.exists() ? snap.data() : null,
          id,
          error: null,
        })
      },
      (err) => {
        setSnapshot({ heist: null, id, error: err })
      },
    )

    return unsubscribe
  }, [id])

  if (!snapshot || snapshot.id !== id) {
    return { heist: null, isLoading: true, error: null }
  }

  return { heist: snapshot.heist, isLoading: false, error: snapshot.error }
}
