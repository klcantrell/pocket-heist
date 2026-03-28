import Link from "next/link"
import { Clock8, Target, Users, Trophy } from "lucide-react"
import styles from "./page.module.css"

export default function Home() {
  return (
    <div className={styles.scene}>
      <div className={styles.gridOverlay} />
      <div className={styles.scanline} />

      <div className={styles.content}>
        <span className={styles.badge}>Classified Operation</span>

        <h1 className={styles.title}>
          P<Clock8 className="logo" strokeWidth={2.75} />
          cket <span className={styles.titleAccent}>Heist</span>
        </h1>

        <p className={styles.tagline}>
          Tiny missions. Big office mischief. Assemble your crew, plot harmless
          capers, and rise through the ranks of cubicle chaos.
        </p>

        <div className={styles.features}>
          <div className={styles.card}>
            <span className={styles.cardIcon}>
              <Target size={28} />
            </span>
            <h3 className={styles.cardTitle}>Plan Heists</h3>
            <p className={styles.cardDesc}>
              Create sneaky missions from desk swaps to surprise coffee runs
            </p>
          </div>

          <div className={styles.card}>
            <span className={styles.cardIcon}>
              <Users size={28} />
            </span>
            <h3 className={styles.cardTitle}>Recruit Crew</h3>
            <p className={styles.cardDesc}>
              Build your team of mischief makers and assign secret roles
            </p>
          </div>

          <div className={styles.card}>
            <span className={styles.cardIcon}>
              <Trophy size={28} />
            </span>
            <h3 className={styles.cardTitle}>Earn Glory</h3>
            <p className={styles.cardDesc}>
              Track your capers and climb the leaderboard of office legends
            </p>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/signup" className={styles.registerBtn}>
            Join the Heist
          </Link>
          <p className={styles.loginLink}>
            Already have a codename? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
