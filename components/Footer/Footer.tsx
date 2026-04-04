import styles from "./Footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      &copy; {new Date().getFullYear()} Pocket Heist. All rights reserved.
    </footer>
  )
}
