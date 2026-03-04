import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Avatar from "@/components/Avatar"

describe("Avatar", () => {
  it("renders the first letter of a simple name", () => {
    render(<Avatar name="Alice" />)

    expect(screen.getByText("A")).toBeInTheDocument()
  })

  it("renders the first two uppercase letters for a PascalCase name", () => {
    render(<Avatar name="HeistDetails" />)

    expect(screen.getByText("HD")).toBeInTheDocument()
  })

  it("renders a single letter for a lowercase name", () => {
    render(<Avatar name="bob" />)

    expect(screen.getByText("B")).toBeInTheDocument()
  })
})
