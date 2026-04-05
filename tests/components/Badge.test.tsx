import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Badge from "@/components/Badge"
import styles from "@/components/Badge/Badge.module.css"

describe("Badge", () => {
  it("renders children text", () => {
    render(<Badge variant="success">Active</Badge>)

    expect(screen.getByText("Active")).toBeInTheDocument()
  })

  it("applies the success CSS class for variant='success'", () => {
    render(<Badge variant="success">Active</Badge>)

    expect(screen.getByText("Active")).toHaveClass(styles.success)
  })

  it("applies the danger CSS class for variant='danger'", () => {
    render(<Badge variant="danger">Expired</Badge>)

    expect(screen.getByText("Expired")).toHaveClass(styles.danger)
  })
})
