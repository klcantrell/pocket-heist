"use client";

import Link from "next/link";
import FormField from "@/components/FormField";
import PasswordInput from "@/components/PasswordInput";
import styles from "./LoginForm.module.css";

export default function LoginForm() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log({
      email: data.get("email") as string,
      password: data.get("password") as string,
    });
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
        />
      </FormField>

      <FormField label="Password" id="login-password">
        <PasswordInput
          id="login-password"
          name="password"
          required
          placeholder="Enter your password"
        />
      </FormField>

      <button type="submit" className={styles.submitBtn}>
        Log In
      </button>

      <p className={styles.footer}>
        Don&apos;t have an account?{" "}
        <Link href="/signup" className={styles.link}>
          Sign up
        </Link>
      </p>
    </form>
  );
}
