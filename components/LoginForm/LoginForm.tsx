"use client"

import { useState } from "react"
import Link from "next/link"
import FormField from "@/components/FormField"
import PasswordInput from "@/components/PasswordInput"
import { loginUser, getLoginErrorMessage } from "@/lib/login"
import styles from "./LoginForm.module.css"

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const email = data.get("email") as string
    const password = data.get("password") as string

    setError(null)
    setIsSuccess(false)
    setIsSubmitting(true)

    try {
      await loginUser(email, password)
      setIsSuccess(true)
    } catch (err) {
      const code = (err as { code?: string }).code ?? ""
      setError(getLoginErrorMessage(code))
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleInputChange() {
    setError(null)
    setIsSuccess(false)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <FormField label="Email" id="login-email">
        <input
          id="login-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="form-input"
          onChange={handleInputChange}
        />
      </FormField>

      <FormField label="Password" id="login-password">
        <PasswordInput
          id="login-password"
          name="password"
          required
          placeholder="Enter your password"
          onChange={handleInputChange}
        />
      </FormField>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {isSuccess && (
        <p className={styles.success} role="status">
          Login successful!
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={isSubmitting ? styles.submitBtnDisabled : styles.submitBtn}
      >
        {isSubmitting ? "Logging in..." : "Log In"}
      </button>

      <p className={styles.footer}>
        Don&apos;t have an account?{" "}
        <Link href="/signup" className={styles.link}>
          Sign up
        </Link>
      </p>
    </form>
  )
}
