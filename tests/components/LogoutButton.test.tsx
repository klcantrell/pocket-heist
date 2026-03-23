import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"

import LogoutButton from "@/components/LogoutButton"

const mockLogout = vi.fn()

describe("LogoutButton", () => {
  it("renders the logout button", () => {
    render(<LogoutButton onLogout={mockLogout} />)

    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument()
  })

  it("calls onLogout when clicked", async () => {
    const user = userEvent.setup()
    render(<LogoutButton onLogout={mockLogout} />)

    await user.click(screen.getByRole("button", { name: /logout/i }))

    expect(mockLogout).toHaveBeenCalled()
  })
})
