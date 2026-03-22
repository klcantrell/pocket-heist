import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { generateCodename } from "@/lib/codename"

export async function signUpUser(email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  const codename = generateCodename()

  await updateProfile(credential.user, { displayName: codename })

  await setDoc(doc(db, "users", credential.user.uid), {
    id: credential.user.uid,
    codename,
  })

  return { user: credential.user, codename }
}

export function getSignupErrorMessage(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "That email is already registered"
    case "auth/weak-password":
      return "Password must be at least 6 characters"
    case "auth/invalid-email":
      return "Please enter a valid email address"
    default:
      return "Something went wrong. Please try again."
  }
}
