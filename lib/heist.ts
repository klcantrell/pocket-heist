import { addDoc, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { COLLECTIONS } from "@/types/firestore"
import type { CreateHeistInput } from "@/types/firestore"

export async function createHeist(input: CreateHeistInput): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.HEISTS), input)
  return docRef.id
}
