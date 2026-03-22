"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import FormField from "@/components/FormField"
import PasswordInput from "@/components/PasswordInput"
import { signUpUser, getSignupErrorMessage } from "@/lib/signup"
import styles from "./SignupForm.module.css"

export default function SignupForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const email = data.get("email") as string
    const password = data.get("password") as string

    setError(null)
    setIsSubmitting(true)

    try {
      await signUpUser(email, password)
      router.push("/heists")
    } catch (err) {
      const code = (err as { code?: string }).code ?? ""
      setError(getSignupErrorMessage(code))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <FormField label="Email" id="signup-email">
        <input
          id="signup-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="form-input"
        />
      </FormField>

      <FormField label="Password" id="signup-password">
        <PasswordInput
          id="signup-password"
          name="password"
          required
          placeholder="Choose a password"
        />
      </FormField>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={isSubmitting ? styles.submitBtnDisabled : styles.submitBtn}
      >
        {isSubmitting ? "Signing up..." : "Sign Up"}
      </button>

      <p className={styles.footer}>
        Already have an account?{" "}
        <Link href="/login" className={styles.link}>
          Log in
        </Link>
      </p>
    </form>
  )
}
