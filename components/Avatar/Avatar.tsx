import styles from "./Avatar.module.css"

function getInitials(name: string): string {
  const upperLetters = name.match(/[A-Z]/g)
  if (upperLetters && upperLetters.length >= 2) {
    return upperLetters.slice(0, 2).join("")
  }
  return name.charAt(0).toUpperCase()
}

export default function Avatar({ name }: { name: string }) {
  return (
    <div className={styles.avatar}>
      {getInitials(name)}
    </div>
  )
}
