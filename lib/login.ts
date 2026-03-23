import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"

export async function loginUser(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return { user: credential.user }
}

export function getLoginErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password"
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later."
    case "auth/invalid-email":
      return "Please enter a valid email address"
    default:
      return "Something went wrong. Please try again."
  }
}
