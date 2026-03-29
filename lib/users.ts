import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { COLLECTIONS } from "@/types/firestore"
import type { User } from "@/types/firestore"

export async function fetchUsers(): Promise<User[]> {
  const snapshot = await getDocs(collection(db, COLLECTIONS.USERS))
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    codename: doc.data().codename,
  }))
}
