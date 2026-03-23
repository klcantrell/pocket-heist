import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@/contexts/AuthContext", () => ({
  useUser: vi.fn(),
}))

import { useUser } from "@/contexts/AuthContext"
const mockUseUser = vi.mocked(useUser)

// component imports
import Navbar from "@/components/Navbar"
import { User } from "firebase/auth"

describe("Navbar", () => {
  it("renders the main heading", () => {
    mockUseUser.mockReturnValue({
      user: null,
      isLoading: false,
      logout: vi.fn(),
    })
    render(<Navbar />)

    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it("renders the Create New Heist link", () => {
    mockUseUser.mockReturnValue({
      user: null,
      isLoading: false,
      logout: vi.fn(),
    })
    render(<Navbar />)

    const createLink = screen.getByRole("link", { name: /create new heist/i })
    expect(createLink).toBeInTheDocument()
    expect(createLink).toHaveAttribute("href", "/heists/create")
  })

  it("shows logout button when user is authenticated", () => {
    mockUseUser.mockReturnValue({
      user: { uid: "123" } as User,
      isLoading: false,
      logout: vi.fn(),
    })
    render(<Navbar />)

    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument()
  })

  it("hides logout button when user is not authenticated", () => {
    mockUseUser.mockReturnValue({
      user: null,
      isLoading: false,
      logout: vi.fn(),
    })
    render(<Navbar />)

    expect(
      screen.queryByRole("button", { name: /logout/i }),
    ).not.toBeInTheDocument()
  })
})
