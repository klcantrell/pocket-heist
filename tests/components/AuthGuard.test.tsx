import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@/contexts/AuthContext", () => ({
  useUser: vi.fn(),
}))

const mockPush = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}))

import { useUser } from "@/contexts/AuthContext"
const mockUseUser = vi.mocked(useUser)

import AuthGuard from "@/components/AuthGuard"
import { User } from "firebase/auth"

describe("AuthGuard", () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it("shows loader while auth state is loading", () => {
    mockUseUser.mockReturnValue({
      user: null,
      isLoading: true,
      logout: vi.fn(),
    })
    render(
      <AuthGuard mode="requireAuth">
        <p>Protected</p>
      </AuthGuard>,
    )

    expect(screen.getByText("Loading…")).toBeInTheDocument()
    expect(screen.queryByText("Protected")).not.toBeInTheDocument()
  })

  it("renders children when requireAuth and user is authenticated", () => {
    mockUseUser.mockReturnValue({
      user: { uid: "123" } as User,
      isLoading: false,
      logout: vi.fn(),
    })
    render(
      <AuthGuard mode="requireAuth">
        <p>Protected</p>
      </AuthGuard>,
    )

    expect(screen.getByText("Protected")).toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it("redirects to /login when requireAuth and user is unauthenticated", () => {
    mockUseUser.mockReturnValue({
      user: null,
      isLoading: false,
      logout: vi.fn(),
    })
    render(
      <AuthGuard mode="requireAuth">
        <p>Protected</p>
      </AuthGuard>,
    )

    expect(mockPush).toHaveBeenCalledWith("/login")
    expect(screen.queryByText("Protected")).not.toBeInTheDocument()
  })

  it("renders children when requireGuest and user is unauthenticated", () => {
    mockUseUser.mockReturnValue({
      user: null,
      isLoading: false,
      logout: vi.fn(),
    })
    render(
      <AuthGuard mode="requireGuest">
        <p>Public</p>
      </AuthGuard>,
    )

    expect(screen.getByText("Public")).toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it("redirects to /heists when requireGuest and user is authenticated", () => {
    mockUseUser.mockReturnValue({
      user: { uid: "123" } as User,
      isLoading: false,
      logout: vi.fn(),
    })
    render(
      <AuthGuard mode="requireGuest">
        <p>Public</p>
      </AuthGuard>,
    )

    expect(mockPush).toHaveBeenCalledWith("/heists")
    expect(screen.queryByText("Public")).not.toBeInTheDocument()
  })
})
