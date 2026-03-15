"use client";

import Link from "next/link";
import FormField from "@/components/FormField";
import PasswordInput from "@/components/PasswordInput";
import styles from "./SignupForm.module.css";

export default function SignupForm() {
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

      <button type="submit" className={styles.submitBtn}>
        Sign Up
      </button>

      <p className={styles.footer}>
        Already have an account?{" "}
        <Link href="/login" className={styles.link}>
          Log in
        </Link>
      </p>
    </form>
  );
}
