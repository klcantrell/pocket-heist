"use client"

import styles from "./LogoutButton.module.css"

type LogoutButtonProps = {
  onLogout: () => void
}

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  return (
    <button className={styles.logoutBtn} onClick={onLogout}>
      Logout
    </button>
  )
}
