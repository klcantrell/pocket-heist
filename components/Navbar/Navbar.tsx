"use client"

import { Clock8, Plus } from "lucide-react"
import Link from "next/link"
import LogoutButton from "@/components/LogoutButton"
import { useUser } from "@/contexts/AuthContext"
import styles from "./Navbar.module.css"

export default function Navbar() {
  const { user, logout } = useUser()

  return (
    <div className={styles.siteNav}>
      <nav>
        <header>
          <h1>
            <Link href="/heists">
              P<Clock8 className={styles.logo} size={14} strokeWidth={2.75} />
              cket Heist
            </Link>
          </h1>
          <div>Tiny missions. Big office mischief.</div>
        </header>
        <ul>
          {user && (
            <li>
              <LogoutButton onLogout={logout} />
            </li>
          )}
          <li>
            <Link href="/heists/create" className={styles.createBtn}>
              <Plus size={20} />
              Create New Heist
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
