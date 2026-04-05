import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { COLLECTIONS, heistConverter, type Heist } from "@/types/firestore"

interface UseHeistResult {
  heist: Heist | null
  isLoading: boolean
  error: Error | null
}

export function useHeist(id: string): UseHeistResult {
  const [heist, setHeist] = useState<Heist | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const ref = doc(db, COLLECTIONS.HEISTS, id).withConverter(heistConverter)

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          setHeist(snapshot.data())
        } else {
          setHeist(null)
        }
        setIsLoading(false)
        setError(null)
      },
      (err) => {
        setError(err)
        setIsLoading(false)
      },
    )

    return unsubscribe
  }, [id])

  return { heist, isLoading, error }
}
