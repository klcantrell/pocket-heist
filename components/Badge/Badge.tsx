import styles from "./Badge.module.css"

type BadgeVariant = "success" | "danger"

export default function Badge({
  variant,
  children,
}: {
  variant: BadgeVariant
  children: React.ReactNode
}) {
  return <span className={styles[variant]}>{children}</span>
}
