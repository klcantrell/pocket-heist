"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { serverTimestamp } from "firebase/firestore"
import FormField from "@/components/FormField"
import { useUser } from "@/contexts/AuthContext"
import { fetchUsers } from "@/lib/users"
import { createHeist } from "@/lib/heist"
import type { User, CreateHeistInput } from "@/types/firestore"
import styles from "./CreateHeistForm.module.css"

export default function CreateHeistForm() {
  const router = useRouter()
  const { user } = useUser()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)

  useEffect(() => {
    fetchUsers()
      .then((allUsers) => {
        setUsers(allUsers.filter((u) => u.id !== user?.uid))
      })
      .catch(() => {
        setError("Failed to load agents. Please refresh the page.")
      })
      .finally(() => {
        setIsLoadingUsers(false)
      })
  }, [user?.uid])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user) return

    const data = new FormData(e.currentTarget)
    const title = data.get("title") as string
    const description = data.get("description") as string
    const assignedTo = data.get("assignTo") as string
    const assignedUser = users.find((u) => u.id === assignedTo)

    if (!assignedUser) return

    setError(null)
    setIsSubmitting(true)

    try {
      const input: CreateHeistInput = {
        title,
        description,
        createdBy: user.uid,
        createdByCodename: user.displayName ?? "",
        assignedTo: assignedUser.id,
        assignedToCodename: assignedUser.codename,
        deadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
        finalStatus: null,
        createdAt: serverTimestamp(),
      }
      await createHeist(input)
      router.push("/heists")
    } catch {
      setError("Failed to create heist. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <FormField label="Title" id="heist-title">
        <input
          id="heist-title"
          name="title"
          type="text"
          required
          placeholder="Name your heist"
          className="form-input"
          onChange={() => setError(null)}
        />
      </FormField>

      <FormField label="Description" id="heist-description">
        <textarea
          id="heist-description"
          name="description"
          required
          placeholder="Describe the mission..."
          className="form-input"
          rows={4}
          onChange={() => setError(null)}
        />
      </FormField>

      <FormField label="Assign To" id="heist-assign-to">
        <select
          id="heist-assign-to"
          name="assignTo"
          required
          className="form-input"
          disabled={isLoadingUsers}
          onChange={() => setError(null)}
        >
          <option value="">
            {isLoadingUsers ? "Loading agents..." : "Select an agent..."}
          </option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.codename}
            </option>
          ))}
        </select>
      </FormField>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || isLoadingUsers}
        className={
          isSubmitting || isLoadingUsers
            ? styles.submitBtnDisabled
            : styles.submitBtn
        }
      >
        {isSubmitting ? "Creating..." : "Plan the Heist"}
      </button>
    </form>
  )
}
